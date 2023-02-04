// import ground from './platform.png'
// console.log(ground)

    const theCoin = new Collectable() 
    const player = new PlayerMain()
    const background = new backGround()
    const fireObj = new Fire()
    
    const platforms = []
    
    function rand(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

    let animationFrame=0
    
    let g = 0
    let groundLimit = 1500
    let gameProgress=0;
    let renderProgress=300;
    let renderDelay = rand(100,600)
    let hole = rand(200,400)

    function animate(){
        animationFrame=animationFrame===10?0:animationFrame+1
        if(gameProgress >= renderProgress+renderDelay){
            renderDelay = rand(100,600)
            renderProgress +=600
            let singlePlatform = new Platform(renderProgress,rand(200,300))
            if(rand(1,6) === 3){
                singlePlatform.placeObstacle=true
            }
            platforms.push(
                singlePlatform
            )
            g+=hole
            hole = rand(200,400)
        }
        while(g< groundLimit){
            console.log("added : "+g)
            let singlePlatform = new Platform(g,50)
            if(rand(1,10)===7){
                singlePlatform.placeObstacle=true
            }
            platforms.push(       
                singlePlatform
                )
                g+=300
            }
            
        canv.clearRect(0,0,canvas.width*3,canvas.height)
        theCoin.update()
        fireObj.updateFire()
        background.draw()
        player.update()
        platforms.forEach((platform)=>{
            platform.update()
        })
        platforms.forEach((platform)=>{
        if(player.position.y+player.size.height <= platform.position.y && 
           player.position.y+player.size.height+player.velocity.y >= platform.position.y &&
           player.position.x+player.size.width >= platform.position.x &&
           player.position.x+player.velocity.x <= platform.position.x+platform.size.width 
           ){
            player.velocity.y=0
        }
        if(platform.placeObstacle &&
           player.position.x+player.size.width+player.velocity.x >= platform.firePosition.x &&
           player.position.x+player.velocity.x <= platform.firePosition.x+platform.fireSize.width &&
           player.position.y <= platform.firePosition.y+platform.fireSize.height && 
           player.position.y+player.size.height+player.velocity.y >= platform.firePosition.y
           ){
            // player.velocity={x:0,y:0}
            console.log('Bured :game over')
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
            g -= player.velocity.x
            gameProgress += player.velocity.x
        }else if(player.backward && player.position.x <= 100){
            platforms.forEach((platform)=>{
                platform.position.x += player.velocity.x
            })
            background.position.x += player.velocity.x
            g+=player.velocity.x
            gameProgress -= player.velocity.x
        }else if(player.forward){
            gameProgress += 10
        }else if(player.backward){
            gameProgress -= 10
        }
        // console.log(groundLimit,gameProgress,g,Math.abs(groundLimit-gameProgress))
        requestAnimationFrame(animate)
    }
    animate()
    
    addEventListener('keydown',(event)=>{
        console.log(event.keyCode)
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
            case 90:
                canv.clearRect(0,0,canvas.width,canvas.height)
                canv.scale(0.5,0.5)
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