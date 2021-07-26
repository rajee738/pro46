var bg,bgImg;
var rocket, rocketImg, rocket_shooting;
var enemy, enemyImg;
var bullet, bulletImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var enemyGroup;

var score = 0;
var life = 3;
var bullets = 70000;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  rocketImg = loadImage("assets/d.png")
  rocket_shooting = loadImage("assets/d.png")

  bulletImg = loadImage("assets/bullet.png");

  enemyImg = loadImage("assets/enemy.png")

  bgImg = loadImage("assets/ff.png")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,290,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
rocket = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
rocket.addImage(rocketImg)
  rocket.scale = 0.3
   rocket.debug = false
  rocket.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating groups for zombies and bullets
    bulletGroup = new Group()
    enemyGroup = new Group()



}

function draw() {
  background(0); 


if(gameState === "fight"){

  //displaying the appropriate image according to lives reamining
  if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  //go to gameState "lost" when 0 lives are remaining
  if(life===0){
    gameState = "lost"
    
  }


  //go to gameState "won" if score is 100
  if(score==100){
    gameState = "won"
    winning.play();
  }

  //moving the player and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  rocket.y = rocket.y-30
}

if(keyDown("DOWN_ARROW")||touches.length>0){
 rocket.y = rocket.y+30
}

if(keyDown("LEFT_ARROW")||touches.length>0){
 rocket.x = rocket.x-30
}

if(keyDown("RIGHT_ARROW")||touches.length>0){
 rocket.x = rocket.x+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,rocket.y-30,20,10)
  bullet.addImage(bulletImg);
  bullet.scale = 0.2
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  rocket.depth = bullet.depth
  rocket.depth = rocket.depth+2
 rocket.addImage(rocket_shooting)
  bullets = bullets-1
  explosionSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  rocket.addImage(rocketImg)
}

//go to gameState "bullet" when player runs out of bullets
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

//destroy the zombie when bullet touches it and increase score
if(enemyGroup.isTouching(bulletGroup)){
  for(var i=0;i<enemyGroup.length;i++){     
      
   if(enemyGroup[i].isTouching(bulletGroup)){
        enemyGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}

//reduce life and destroy zombie when player touches it
if(enemyGroup.isTouching(rocket)){
 
   lose.play();
 

 for(var i=0;i<enemyGroup.length;i++){     
      
  if(enemyGroup[i].isTouching(rocket)){
       enemyGroup[i].destroy()
      
      life=life-1
       } 
 
 }
}

//calling the function to spawn zombies
war();
}




drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
  fill("white")

text("Score = " + score,displayWidth-210,displayHeight/2-220)
text("Lives = " + life,displayWidth-200,displayHeight/2-280)

//destroy zombie and player and display a message in gameState "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("You Lost ",400,400)
  enemyGroup.destroyEach();
 rocket.destroy();

}

//destroy zombie and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("You Won ",400,400)
  enemyGroup.destroyEach();
  rocket.destroy();

}

//destroy zombie, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!!",470,410)
  enemyGroup.destroyEach();
  rocket.destroy();
  bulletGroup.destroyEach();

}

}


//creating function to spawn zombies
function war(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    enemy = createSprite(random(500,1100),random(100,500),40,40)

   enemy.addImage(enemyImg)
   enemy.scale = 0.19
   enemy.velocityX = -3
    enemy.debug= false
    enemy.setCollider("rectangle",0,0,400,400)
   
    enemy.lifetime = 400
  enemyGroup.add(enemy)
  }

}
