// import ground from './platform.png'
// console.log(ground)
    const soundEffects = new Sounds()
    const theCoin = new Collectable() 
    const player = new PlayerMain()
    const background = new backGround()
    const fireObj = new Fire()
    
    let platform1 = new Platform(200,300)
    platform1.hover=true
    
    const platforms = []
    const collectables = []
    
    function rand(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

    let animationFrame=0
    
    let g = 0
    let groundLimit = 2500
    let gameProgress=0;
    let renderProgress=2000;
    let renderDelay = rand(100,600)
    let hole = rand(150,300)
    let collected = {
        coins:0
    }
    function makeSound(sound){
        if(soundEffects[sound].currentTime > 0){
            soundEffects[sound].currentTime = 0
        }else{
            soundEffects[sound].play()
        }
    }
    function updateScoreBoard(){
        document.getElementById('coinCount').innerText = collected.coins
        document.getElementById('life').innerText = player.life
    }  
    function animate(){
        updateScoreBoard()
        animationFrame=animationFrame===10?0:animationFrame+1
        if(gameProgress >= renderProgress+renderDelay){
            renderDelay = rand(100,600)
            renderProgress +=600
            let singlePlatform = new Platform(renderProgress,rand(200,300))
            if(rand(1,4) === 2){
                singlePlatform.hoverDirection = 'horizontal'
                singlePlatform.hover = true
            }
            if(rand(1,6) === 3){
                singlePlatform.placeObstacle=true
            }
            platforms.push(
                singlePlatform
            )
            g+=hole
            hole = rand(200,400)
           
            let num=rand(0,5)

            for(let x=0;x<=num;x++){
                collectables.push(
                    new Collectable(gameProgress+(x*60),400)
                    )
                }
            
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
        
        fireObj.updateFire()
        background.draw()
        platforms.forEach((platform)=>{
            platform.update()
        })
        collectables.forEach((collectable)=>{
            collectable.update()
        })
        player.update()
        if(player.position.y >= canvas.height*1.2){
            if(player.life === 0){
                player.dead=true
            }else{
                player.life -=1
                player.reSpawn()
            }
            makeSound('die')
        }
        platforms.forEach((platform)=>{
        if(player.position.y+player.size.height <= platform.position.y && 
           player.position.y+player.size.height+player.velocity.y >= platform.position.y &&
           player.position.x+player.size.width >= platform.position.x &&
           player.position.x+player.velocity.x <= platform.position.x+platform.size.width 
           ){
               if(platform.hover){
                    if(platform.hoverDirection === 'vertical'){
                        player.position.y += platform.hoverIncrement.y 
                    }else{
                        player.position.x += platform.hoverIncrement.x 
                    }
                }
                    player.velocity.y=0
                    
            
        }
        if(platform.placeObstacle &&
           player.position.x+player.size.width+player.velocity.x >= platform.firePosition.x &&
           player.position.x+player.velocity.x <= platform.firePosition.x+platform.fireSize.width &&
           player.position.y <= platform.firePosition.y+platform.fireSize.height && 
           player.position.y+player.size.height+player.velocity.y >= platform.firePosition.y
           ){
            if(player.life === 0){
                player.dead=true
            }else{
                player.life -=1
                player.reSpawn()
            }
            makeSound('die')
        }
    }
        )
        
        collectables.forEach((collectable)=>{
            if(
            player.position.x+player.size.width+player.velocity.x >= collectable.position.x &&
            player.position.x+player.velocity.x <= collectable.position.x+collectable.size.width &&
            player.position.y <= collectable.position.y+collectable.size.height && 
            player.position.y+player.size.height+player.velocity.y >= collectable.position.y
            ){
                delete collectables[collectables.indexOf(collectable)]
                collectables.length -= 1
                collected.coins += 10
                updateScoreBoard()
                    makeSound('coinTakeSound')
                    
                }
        })

        if(player.forward && Math.abs(groundLimit-gameProgress) <= 500){
            groundLimit += 300
        }
        console.log(gameProgress)
        if(player.forward && player.position.x >= innerWidth/2){
            
            collectables.forEach((collectable)=>{
                collectable.position.x -= player.velocity.x
            })

            platforms.forEach((platform)=>{
                platform.position.x -= player.velocity.x
            })
            background.position.x -= player.velocity.x
            g -= player.velocity.x
            gameProgress += player.velocity.x
        }else if(player.backward && player.position.x <= 100 && gameProgress >= 10){

            collectables.forEach((collectable)=>{
                collectable.position.x += player.velocity.x
            })
            platforms.forEach((platform)=>{
                platform.position.x += player.velocity.x
            })
            background.position.x += player.velocity.x
            g+=player.velocity.x
            gameProgress -= player.velocity.x
        }
        requestAnimationFrame(animate)
    }
    animate()
    addEventListener('keydown',(event)=>{
        if(!player.dead){
            switch(event.keyCode){
                case 38:
                if(player.velocity.y === 0){
                    player.jump=true
                    player.velocity.y += 50
                }
                makeSound('jump')
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
                player.velocity.x = 20
                // canv.clearRect(0,0,canvas.width,canvas.height)
                // canv.scale(0.5,0.5)
                break
            case 65:
                player.velocity.x = 10
                    // canv.clearRect(0,0,canvas.width,canvas.height)
                // canv.scale(2,2)
                break
                }
            }
            })
            addEventListener('keyup',(event)=>{
                if(!player.dead){
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
                }else{
                    player.forward = false
                    player.backward = false
                }
    })