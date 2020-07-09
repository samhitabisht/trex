var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage
var cloudGroup
var obsImg1,obsImg2,obsImg3,obsImg4,obsImg5,obsImg6;
var obstacleGroup
var score;
var PLAY, END, gameState;
var gameOver, gameOverImg;
var restart, restartImg;
var dieSound, checkPointSound, jumpSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudImage= loadImage("cloud.png");
  groundImage = loadImage("ground2.png")
  obsImg1=loadImage("obstacle1.png");
  obsImg2=loadImage("obstacle2.png");
  obsImg3=loadImage("obstacle3.png");
  obsImg4=loadImage("obstacle4.png");
  obsImg5=loadImage("obstacle5.png");
  obsImg6=loadImage("obstacle6.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  jumpSound=loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  cloudGroup=new Group();
  obstacleGroup= createGroup();
  PLAY=1;
  END=0;
  gameState=PLAY;
  score= 0;
  
  gameOver=createSprite(300,80,20,20);
  restart=createSprite(300,120,20,20);
  gameOver.visible = false;
  restart.visible = false;
  gameOver.addImage(gameOverImg);
  restart.addImage(restartImg);
  gameOver.scale=0.7;
  restart.scale=0.5;
  
}

function draw() {
  background(150);
  fill("blue");
  text("Score:"+score,500,30);  
  if (gameState===PLAY){
    
    ground.velocityX = -(6 + 3*score/100);
    
    score= score+ Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (keyDown("space")){
      trex.velocityY=-10;
      jumpSound.play();
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    if (score>0 && score%100 === 0){
     checkPointSound.play();
    }
    
    //spawn the clouds
    spawnClouds();
    //spawn obstacles
    spawnObstacles();
  
    if (obstacleGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();
    }
  } 
  else if (gameState===END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided");
    //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)) {
    reset();
  }
  }
  
  
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,170,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obsImg1);
        break;
      case 2:obstacle.addImage(obsImg2);
        break;
      case 3:obstacle.addImage(obsImg3);
        break;
      case 4:obstacle.addImage(obsImg4);
        break;
      case 5:obstacle.addImage(obsImg5);
        break;
      case 6:obstacle.addImage(obsImg6);
        break;
      default:obstacle.addImage(obsImg1); 
        break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = Math.round(obstacle.x/Math.abs(obstacle.velocityX));
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  
  trex.changeAnimation("running");
  
  score = 0;
  
}
