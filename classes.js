const canvas = document.getElementById('screen')
const platformImg1 = document.getElementById('platform-1')
const platformImg2 = document.getElementById('platform-2')
const platformImg3 = document.getElementById('platform-3')
const platformImg4 = document.getElementById('platform-4')
const standing = document.getElementById('standing')
const standingL = document.getElementById('standingL')
const running = document.getElementById('running')
const runningL = document.getElementById('runningL')
const trees = document.getElementById('tree')
const fireImg = document.getElementById('fire')
const coin = document.getElementById('coin')
const dead = document.getElementById('dead')
const backG = document.getElementById('backG')

canvas.width = innerWidth
canvas.height = innerHeight
const canv = canvas.getContext('2d')

function rand(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


class Sounds{
    constructor(){
        this.coinTakeSound = new Audio('sounds/success.mp3')
    this.jump = new Audio('sounds/jump.mp3')
    this.die = new Audio('sounds/negative-beep.mp3')
    }
    
}

class PlayerMain{
    constructor(){
        this.position = {
            x:100,
            y:100
        }
        this.size = {
            width:66,
            height:150
        }
        this.velocity = {
            x:10,
            y:10
        }
        this.life = 1
        this.gravity = 1
        this.jumpAcceleration = 4
        this.jump = false
        this.jumpHeight = this.position.y+1000
        this.forward=false
        this.backward=false
        this.spriteFrame=0
        this.spriteFrame2=0
        this.dead=false
        this.playerAnimation={
            runningRight:{
                image:running,
                cropWidth:341,
                width:127.875
                },
            standingRight:{
                image:standing,
                cropWidth:177,
                width:66
                },
            runningLeft:{
                image:runningL,
                cropWidth:341,
                width:127.875
                },
            standingLeft:{
                image:standingL,
                cropWidth:177,
                width:66
                }
            }
        this.playerState='standingRight'
        this.stoppedForward = false
        this.stoppedBack = false
        this.boost=10
        this.boostOn=false
        this.flashAnimateTimer = 75
        this.reSpawning = false
    }
        playerBoost(a){
            if(!this.boostOn){
                this.boost = this.boost>=100?100: this.boost+a
            }
        }
        reSpawn(){
            this.forward = false 
            this.backward = false
                this.position = {
                    x:this.position.x+ 200,y:100
                }
        }
        draw(){
            const width=177
            if(this.dead){
                this.die()
            }else if(this.flashAnimateTimer === 75){
                this.reSpawning = false
                canv.drawImage(this.playerAnimation[this.playerState].image,
                    this.playerAnimation[this.playerState].cropWidth *this.spriteFrame,
                    0,
                this.playerAnimation[this.playerState].cropWidth,
                400,
                this.position.x,
                this.position.y,
                this.playerAnimation[this.playerState].width,
                this.size.height)
            }
            
        }
        die(){
            let c = this.spriteFrame2<5?this.spriteFrame2:this.spriteFrame2%5
            canv.drawImage(
                dead,
                    187 *c,
                    0,
                  200,150,
                  this.position.x,
                  this.position.y-50,
                  150,
                  150
                )  
        }
        update(){
            if(this.boostOn && (this.forward || this.backward)){
                if(this.boost < 5){
                    this.boostOn =false
                }
                this.velocity.x = 20
                this.boost = this.boost>5?this.boost-0.1:5
            }else{
                this.velocity.x = 10
            }
            this.spriteFrame = this.spriteFrame===28?0:this.spriteFrame+1
            if(animationFrame === 5 || animationFrame === 10){
                this.spriteFrame2 = this.spriteFrame2===20?0:this.spriteFrame2+1
            }

            if(this.jump && !this.reSpawning){
                this.position.y -= this.velocity.y
                if(this.velocity.y > 0 && this.position.y+this.size.height+this.velocity.y >= canvas.height-this.jumpHeight){
                    this.velocity.y -= this.jumpAcceleration
                }else{
                    this.jump=false
                }
            }else{
                this.position.y += this.velocity.y
                if(this.position.y+this.size.height+this.velocity.y <= canvas.height*1.5){
                    this.velocity.y += this.gravity
                }else{
                    this.velocity.y = 0
                }
            }

                if(this.forward && this.position.x <= innerWidth/2 && !this.stoppedForward && !player.reSpawning){
                    gameProgress += this.velocity.x
                    this.position.x += this.velocity.x
                }else if(this.backward && this.position.x >= 100 && gameProgress >= 10 && !this.stoppedBackward && !player.reSpawning){
                    gameProgress -= this.velocity.x
                    this.position.x -= this.velocity.x
                }
            this.draw()
        }
    }

   
    
    class Fire{
        constructor(){
            this.firePosition ={
                x:0,
                y:0
            }
            this.fireSize={
                height:100,
                width:80
            }
            this.spriteFrame=0
        }
        drawFire(){
            let width= (800*this.spriteFrame)+(298*this.spriteFrame)
            canv.drawImage(
                fireImg,
                width,0,
                800,1500,
                this.firePosition.x,
                this.firePosition.y,
                this.fireSize.width,
                this.fireSize.height)
        }
        updateFire(x,y){
            this.firePosition={x,y}
            if(animationFrame%2 === 0){
                this.spriteFrame= this.spriteFrame===4?0:this.spriteFrame+1
            }
            this.drawFire()
            }
    }
    
    class Platform extends Fire{
        constructor(x,y,random=false,type=null){
            super(0,0)
            this.random = random
            this.platformTypes = [
                {image:platformImg1,
                width: 300,
                height:50},
                {image:platformImg2,
                width: 380,
                height:260},
                {image:platformImg3,
                width: 127,
                height:88},
                {image:platformImg4,
                width: 129,
                height:86},
            ]
            this.type = type !== null? type:rand(0,2)
            this.position={
                x:x,
                y:innerHeight*0.74-y
            }
            this.size={
                width:this.platformTypes[this.type].width,
                height:this.platformTypes[this.type].height,
            }
            this.placeObstacle = false
            this.hover = false
            this.hoverDirection = 'vertical'
            this.hoverDistance = {
                x:50,
                y:50
            }
            this.hoverIncrement = {
                x:2,
                y:0.25
            }

        }
        draw(){
            canv.drawImage(this.platformTypes[this.type].image,this.position.x,this.position.y,this.size.width,this.size.height)
        }
        update(){
            if(this.hover){
                if(this.hoverDirection==='vertical'){
                    if(this.hoverDistance.y===0 || this.hoverDistance.y===50){
                        this.hoverIncrement.y *= -1     
                    }
                    this.position.y += this.hoverIncrement.y
                    this.hoverDistance.y += this.hoverIncrement.y
                    
                }else{
                    if(this.hoverDistance.x===0 || this.hoverDistance.x===50){
                        this.hoverIncrement.x *= -1     
                    }
                    this.position.x += this.hoverIncrement.x
                    this.hoverDistance.x += this.hoverIncrement.x
                    

                }

            }
            if(this.placeObstacle){
            this.updateFire(this.position.x+100,this.position.y-90)    
            }
            this.draw()
        }
    }

    class backGround{
        constructor(){
            this.position={
                scene:{
                    x:0,
                    y:0
                },
                nextScene:{
                    x:0,
                    y:0
                },
                tree:{
                x:0,
                y:180
                }
            }
            this.width = 3839
            this.backgrounds = {
                main: {
                    image: backG,
                    width:3839
                },
                next: {
                    image: backG,
                    width:3839
                } 
            }
        }

        draw(){
            
            
            
            
            canv.drawImage(this.backgrounds.main.image,this.position.scene.x,this.position.scene.y) //1
            
            if(Math.abs(this.position.scene.x) >= this.backgrounds.main.width*0.1){
                canv.drawImage(this.backgrounds.next.image,this.position.scene.x+this.backgrounds.main.width,this.position.scene.y) //2
            }
            if(this.position.scene.x+this.backgrounds.main.width <= 0){
                this.position.scene.x += this.backgrounds.main.width-2 
                this.backgrounds = {
                                main: this.backgrounds.next, 
                                next: this.backgrounds.main
                            }
                
            }
            canv.drawImage(trees,this.position.tree.x,this.position.tree.y)
        }
        
    }

    class Collectable{
        constructor(x,y){
            this.position={
                x,y
            }
            this.size ={
                width:50,
                height:50
            }
            this.levitatePos=0
            this.levitatePosAdd=-0.5
        }
        draw(){
            canv.drawImage(coin,
                this.position.x,
                this.position.y+this.levitatePos,
                this.size.width,
                this.size.height)
        }
        update(){
            if(this.levitatePos === 30 || this.levitatePos ===0){
                this.levitatePosAdd *= -1
            }
            this.levitatePos +=this.levitatePosAdd
            this.draw()
        }
    }