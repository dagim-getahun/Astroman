// import ground from './platform.png'
// console.log(ground)
const canvas = document.getElementById('screen')
const platformImg = document.getElementById('platform-1')
const standing = document.getElementById('standing')
const standingL = document.getElementById('standingL')
const running = document.getElementById('running')
const runningL = document.getElementById('runningL')
const trees = document.getElementById('tree')

canvas.width = innerWidth
canvas.height = innerHeight*0.74
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
        this.jumpHeight = this.position.y+500
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

    class Platform{
        constructor(x,y){
            this.position={
                x:x,
                y:canvas.height-y
            }
            this.size={
                width:300,
                height:50
            }
        }
        draw(){
            // canv.fillStyle='red'
            // canv.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)
            canv.drawImage(platformImg,this.position.x,this.position.y,this.size.width,this.size.height)
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
    
    const player = new PlayerMain()
    const background = new backGround()

    const platforms = [
        new Platform(200,400),
        new Platform(1000,550),
        new Platform(700,300)]
    
    
    let g = 0
    let groundLimit = 900
    let gameProgress=0;

    function animate(){
        
        while(g< groundLimit){
            platforms.push(       
            new Platform(g,50)
                )
                g+=300
        }

        canv.clearRect(0,0,canvas.width*3,canvas.height)
        background.draw()
        player.update()
        platforms.forEach((platform)=>{
            platform.draw()
        })
        platforms.forEach((platform)=>{
        if(player.position.y+player.size.height <= platform.position.y && 
           player.position.y+player.size.height+player.velocity.y >= platform.position.y &&
           player.position.x+player.size.width >= platform.position.x &&
           player.position.x+player.velocity.x <= platform.position.x+platform.size.width 
           ){
            player.velocity.y=0
        }
        })
        if(player.forward && Math.abs(groundLimit-gameProgress) <= 500){
            groundLimit += 300
        }
        if(player.forward && player.position.x >= innerWidth/2){
            
            platforms.forEach((platform)=>{
                platform.position.x -= player.velocity.x
            })
            background.position.x -= player.velocity.x
            gameProgress += player.velocity.x
        }else if(player.backward && player.position.x <= 100){
            platforms.forEach((platform)=>{
                platform.position.x += player.velocity.x
            })
            background.position.x += player.velocity.x
            gameProgress -= player.velocity.x
        }else if(player.forward){
            gameProgress += 10
        }else if(player.backward){
            gameProgress -= 10
        }
        console.log(groundLimit,gameProgress,g,Math.abs(groundLimit-gameProgress))
        requestAnimationFrame(animate)
    }
    animate()
    
    addEventListener('keydown',(event)=>{
        switch(event.keyCode){
            case 38:
                if(player.velocity.y === 0){
                    player.jump=true
                    player.velocity.y += 50
                }
                break
            case 37:
                player.backward = true
                player.playerState = 'runningLeft'
                break
                case 39:
                    player.forward = true
                    player.playerState = 'runningRight'
                    break
                }
            })
            addEventListener('keyup',(event)=>{
            switch(event.keyCode){
                case 37:
                    player.backward=false
                    player.playerState = 'standingLeft'
                    break
                case 39:
                    player.playerState = 'standingRight'
                    player.forward=false
                    break
        }
    })