var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var jumpSound;
var gameOver, restart;
var dead;
var revive;

// localStorage["HighestScore"] = 0;
//localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png"); 
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jumpSound.wav");
  dead = loadSound("Death.mp4");
  revive =loadSound("Revive.mp4");
}
function setup() {
  // createCanvas(600, 200);
  createCanvas(windowWidth,windowHeight);

  // trex = createSprite(windowWidth/2,windowHeight/2,20,50);
  trex = createSprite(width/2,height-50,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = false;

  // ground = createSprite(camera.position.x,camera.position.y+425,500,20);
  ground = createSprite(width/2,height-70,width,2);
  ground.addImage("ground",groundImage);
  // ground.x = ground.width /2;
  ground.x = width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.debug = false;

  // gameOver = createSprite(windowWidth/2+70,windowHeight/2 -200);
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);

  // restart = createSprite(windowWidth/2+70,windowHeight/2-150);
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);

  // gameOver.scale = 0.5;
  // restart.scale = 0.5;
  gameOver.scale = 0.7;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;

  // invisibleGround = createSprite(windowWidth/2,windowHeight/2+70,400,10);
  invisibleGround = createSprite(width/2,height-4,width,125);  
  invisibleGround.visible = false;
  invisibleGround.debug = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}
function draw() {
  //trex.debug = true;
  background(255);
  strokeWeight(2);
  stroke("black");
  fill("grey");
  textSize(30);
  // text("Score: "+ score, windowWidth/2,windowHeight - 600);
  // text("Score: "+ score, camera.position.x,camera.position.y-300);
  text("Score: "+ score, windowWidth/2-50,windowHeight/2-50);
  //text("Score: "+ score,30,50);

  restart.depth = trex.depth;
  gameOver.depth = trex.depth;
  camera.position.x = trex.x;
  camera.position.y = trex.y;
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    // if(keyDown("space") && trex.y >= 390) {
    if(keyDown("space") && trex.y >=height-100) {
      jumpSound.play();
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8

    // if (ground.x < 350){
      // ground.x = ground.width/2;
    if (ground.x < width/3){
      ground.x = width/2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dead.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("enter")) {
      reset();
      revive.play();
    }
  }
   
  // console.log(trex.y);
  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    // var cloud = createSprite(windowWidth + 100,windowHeight +30,40,10);
    // cloud.y = Math.round(random(80,300));
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(height/5,height/3));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    // var obstacle = createSprite(windowWidth + 100,windowHeight/2 +40,10,40);
    var obstacle = createSprite(width,height-80,20,30);
    obstacle.debug = false;
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);

  // if(localStorage["HighestScore"]<score){
  //   localStorage["HighestScore"] = score;
  // }
  // console.log(localStorage["HighestScore"]);


  score = 0;

  // } 
}