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
    }
        draw(){
            canv.fillStyle='grey'
            canv.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)
        }
        update(){
            this.position.y += this.velocity.y
            if(this.position.y+this.size.height+this.velocity.y <= canvas.height){
                this.velocity.y += this.gravity
            }else{
                this.velocity.y = 0
            }
            this.draw()
        }
    }
    
    const player = new PlayerMain()
    // player.update()

    function animate(){
        requestAnimationFrame(animate)
        console.log(player.position.y)
        canv.clearRect(0,0,canvas.width,canvas.height)
        player.update()
    }
    animate()