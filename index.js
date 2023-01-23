const canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
const canv = canvas.getContext('2d')

class PlayerMain{
    constructor(){
        this.position = {
            x:100,
            y:100
        }
        this.size = {
            width:50,
            height:50
        }
        this.velocity = {
            x:0,
            y:10
        }
        this.gravity = 0.5
        this.jumpAcceleration = 4
        this.jump = false
        this.jumpHeight = 300
    }
        draw(){
            canv.fillStyle='grey'
            canv.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)
        }
        update(){
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
            this.draw()
        }
    }
    
    const player = new PlayerMain()
    // player.update()

    function animate(){
        requestAnimationFrame(animate)
        canv.clearRect(0,0,canvas.width,canvas.height)
        player.update()
    }
    animate()
    
    addEventListener('keydown',(event)=>{
        switch(event.keyCode){
            case 38:
            player.jump=true
            player.velocity.y=50

        }
    })