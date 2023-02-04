const canvas = document.getElementById('screen')
const platformImg = document.getElementById('platform-1')
const standing = document.getElementById('standing')
const standingL = document.getElementById('standingL')
const running = document.getElementById('running')
const runningL = document.getElementById('runningL')
const trees = document.getElementById('tree')
const fireImg = document.getElementById('fire')
const coin = document.getElementById('coin')

canvas.width = innerWidth*0.99
canvas.height = innerHeight*0.99
const canv = canvas.getContext('2d')


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
        this.gravity = 1
        this.jumpAcceleration = 4
        this.jump = false
        this.jumpHeight = this.position.y+1000
        this.forward=false
        this.backward=false
        this.spriteFrame=0
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
        
    }
        draw(){
            // canv.fillStyle='grey'
            // canv.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)
            const width=177
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
        update(){
            this.spriteFrame = this.spriteFrame===28?0:this.spriteFrame+1

            if(this.jump){
                this.position.y -= this.velocity.y
                if(this.velocity.y > 0 && this.position.y+this.size.height+this.velocity.y >= canvas.height-this.jumpHeight){
                    this.velocity.y -= this.jumpAcceleration
                }else{
                    this.jump=false
                }
            }else{
                this.position.y += this.velocity.y
                if(this.position.y+this.size.height+this.velocity.y <= canvas.height){
                    this.velocity.y += this.gravity
                }else{
                    this.velocity.y = 0
                }
            }
            if(this.forward && this.position.x <= innerWidth/2){
                this.position.x += this.velocity.x
            }else if(this.backward && this.position.x >= 100){
                this.position.x = this.position.x-this.velocity.x
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
        constructor(x,y){
            super(0,0)
            this.position={
                x:x,
                y:innerHeight*0.74-y
            }
            this.size={
                width:300,
                height:50
            }
            this.placeObstacle = false
        }
        draw(){
            canv.drawImage(platformImg,this.position.x,this.position.y,this.size.width,this.size.height)
        }
        update(){
            if(this.placeObstacle){
            this.updateFire(this.position.x+100,this.position.y-90)    
            }
            this.draw()
        }
    }

    class backGround{
        constructor(){
            this.position={
                x:0,
                y:110
            }
        }
        draw(){
            canv.drawImage(trees,this.position.x,this.position.y)
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