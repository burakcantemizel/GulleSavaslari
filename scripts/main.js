
//Görsel Değişkenleri------------------------------------------------------------------------------------------------------------------------------------------------------------
let sprite_sea;
let sprite_hearth;
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Tuş Değişkenleri---------------------------------------------------------------------------------------------------------------------------------------------------------------

//Birinci Geminin Tuşları
//Space KeyTypedda tanımlı
let key_up_arrow = false;
let key_left_arrow = false;
let key_right_arrow = false;

//İkinci Geminin Tuşları
//Numpad0 KeyTypedda tanımlı
let key_w = false;
let key_a = false;
let key_d = false;

//Kamera Tuşları
let key_i = false;
let key_j = false;
let key_k = false;
let key_l = false;
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Top Liste Değişkenleri---------------------------------------------------------------------------------------------------------------------------------------------------------
let ship1_cannonballs = [];
let ship2_cannonballs = [];
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Fizik Değişkenleri-------------------------------------------------------------------------------------------------------------------------------------------------------------
let last_time = 0;
let delta = 0;
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Kamera Değişkenleri------------------------------------------------------------------------------------------------------------------------------------------------------------
let camera_x = 0;
let camera_y = 0;
let camera_speed = 600;
let camera_zoom = 1;

//Kamera Modları
//MANUEL
//AUTO
let camera_mode = "MANUEL";
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Sahne Değişkenleri-------------------------------------------------------------------------------------------------------------------------------------------------------------
//OYUN ALANI - "GAME"
//OYUN SONU - "GAME_OVER"
let current_stage = "GAME"
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Diğer Değişkenler--------------------------------------------------------------------------------------------------------------------------------------------------------------
let game_winner;
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function preload() {
  sprite_sea = loadImage("data/sprites/Tiles/tile_73.png");
  sprite_hearth = loadImage("data/sprites/hearth.png");

  gameMap = new Map();
  ship1 = new Ship1(-100, 0, 180);
  ship2 = new Ship2( 100, 0, 0);
  cannonball = new Cannonball(windowWidth / 2, windowHeight / 2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  //Fizik İşlemleri için delta time tanımlıyoruz.
  delta = (millis() - last_time) / 1000;

  switch(current_stage){
    case "GAME":
      //Kamerayı Ayarlıyoruz.
      setup_camera();

      //Kameradan etkilenmemesi için ayrı bir transform matrisi içerisinde denizi çizdiriyoruz.
      push();
        resetMatrix();
        draw_sea();
      pop();

      
      //Haritayı Çizdiriyoruz.
      push();
        //resetMatrix();
        translate(-gameMap.width/2, -gameMap.height/2);
        gameMap.draw();
      pop();
      

      //Birinci Geminin Toplarının Döngüsü
      for (let i = 0; i < ship1_cannonballs.length; i++) {
        ship1_cannonballs[i].move();
        ship1_cannonballs[i].draw();
        
        //Toplar Haritadan Çıkınca Silme İşlemi(Belli bir süre sonra yok oldukları için şimdilik gerek yok.)
        /*
        if (ship1_cannonballs[i].position_x < 0 || ship1_cannonballs[i].position_x > windowWidth || ship1_cannonballs[i].position_y < 0 || ship1_cannonballs[i].position_y > windowHeight) {
          ship1_cannonballs.splice(i, 1);
        }
        */
        
        //Topları belli bir süre sonra yok ediyoruz.
        if (ship1_cannonballs[i].life_time > 1.5) {
          ship1_cannonballs.splice(i, 1);
        }
    
      }

      //İkinci Geminin Toplarının Döngüsü
      for (let i = 0; i < ship2_cannonballs.length; i++) {
        ship2_cannonballs[i].move();
        ship2_cannonballs[i].draw();
    
        //Toplar Haritadan Çıkınca Silme İşlemi(Belli bir süre sonra yok oldukları için şimdilik gerek yok.)
        /*
        if (ship2_cannonballs[i].position_x < 0 || ship2_cannonballs[i].position_x > windowWidth || ship2_cannonballs[i].position_y < 0 || ship2_cannonballs[i].position_y > windowHeight) {
          ship2_cannonballs.splice(i, 1);
        }
        */
    
        //Topları belli bir süre sonra yok ediyoruz.
        if (ship2_cannonballs[i].life_time > 1.5) {
          ship2_cannonballs.splice(i, 1);
        }
      }

      //Birinci Geminin Fonksiyonları
      ship1.move();
      ship1.detect_fire_direction();
      ship1.draw();

      //İkinci Geminin Fonksiyonları
      ship2.move();
      ship2.detect_fire_direction();
      ship2.draw();

      //Arayüzü ayarlıyoruz ve çizdiriyoruz.
      setup_gui();

      //Oyun Sonunu Kontrol ediyoruz.
      game_over_control();
    break;

    case "GAME_OVER":
      //Denizi çizdiriyoruz.
      draw_sea();
      fill(100);
      textSize(32);
      textAlign(CENTER,CENTER);
      text(game_winner + " Kazandı!",windowWidth/2,windowHeight/2);
      text("Yeniden Başlamak İçin 'space' tuşuna basınız.",windowWidth/2,windowHeight/2+100);
    break;
  }

  //Fizik işlemleri için son zamanı tanımlıyoruz.
  last_time = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw_sea() {
  for (let i = 0; i < windowWidth; i += sprite_sea.width) {
    for (let j = 0; j < windowHeight; j += sprite_sea.height) {
      image(sprite_sea, i, j);
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    key_up_arrow = true;
  }

  if (keyCode === LEFT_ARROW) {
    key_left_arrow = true;
  }

  if (keyCode === RIGHT_ARROW) {
    key_right_arrow = true;
  }

  //KEY W
  if (keyCode === 87) {
    key_w = true;
  }

  //KEY A
  if (keyCode === 65) {
    key_a = true;
  }

  //KEY D
  if (keyCode === 68) {
    key_d = true;
  }
  
  //KEY I
  if (keyCode === 73) {
    key_i = true;
  }

  //KEY J
  if (keyCode === 74) {
    key_j = true;
  }

  //KEY K
  if (keyCode === 75) {
    key_k = true;
  }

  //KEY L
  if (keyCode === 76) {
    key_l = true;
  }

}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    key_up_arrow = false;
  }

  if (keyCode === LEFT_ARROW) {
    key_left_arrow = false;
  }

  if (keyCode === RIGHT_ARROW) {
    key_right_arrow = false;
  }

  //KEY W
  if (keyCode === 87) {
    key_w = false;
  }

  //KEY A
  if (keyCode === 65) {
    key_a = false;
  }

  //KEY D
  if (keyCode === 68) {
    key_d = false;
  }

  //KEY I
  if (keyCode === 73) {
    key_i = false;
  }

  //KEY J
  if (keyCode === 74) {
    key_j = false;
  }

  //KEY K
  if (keyCode === 75) {
    key_k = false;
  }

  //KEY L
  if (keyCode === 76) {
    key_l = false;
  }

}

function keyTyped() {

  //KEY SPACE
  if (keyCode === 32) {
    
    if (current_stage != "GAME_OVER" && ship1.firing_time >= 1) {
      ship1.fire();
      ship1.firing_time = 0;
    }

    if(current_stage == "GAME_OVER"){
      game_reset();
      current_stage = "GAME";
    }

  }

  //KEY ENTER
  if (keyCode === 13) {

    if (ship2.firing_time >= 1) {
      ship2.fire();
      ship2.firing_time = 0;
    }

  }

}

function collide_circle_circle(x1, y1, r1, x2, y2, r2) {
  let distance_origins = dist(x1, y1, x2, y2);

  if (distance_origins <= r1 + r2) {
    return true;
  } else {
    return false;
  }

}

function mouseWheel(event) {

  camera_zoom += event.delta/10000;

  //Kamera Zoom Değerinin Sınırlandırılması
  if(camera_zoom >= 1){
    camera_zoom = 1;
  }else if(camera_zoom < 0){
    camera_zoom = 0;
  }


  //print(camera_zoom);
}

function setup_camera(){

  switch(camera_mode){
    case "MANUEL":
      if(key_i){
        camera_y -= camera_speed * delta;
      }
    
      if(key_j){
        camera_x -= camera_speed * delta;
      }
    
      if(key_k){
        camera_y += camera_speed * delta;
      }
    
      if(key_l){
        camera_x += camera_speed * delta;
      }

      translate(windowWidth/2 - camera_x, windowHeight/2 - camera_y);
      scale(camera_zoom);
    break;

    case "AUTO":
      let ships_distance = dist(ship1.position_x, ship1.position_y, ship2.position_x, ship2.position_y);
      print(ships_distance);

      translate(windowWidth/2 - camera_x, windowHeight/2 - camera_y);
      

      scale(camera_zoom);
    break;
  }


}

function setup_gui(){
  push();
    resetMatrix();

    fill(255);
    textSize(25);
    textAlign(LEFT,TOP);
    text("Player 1: Emre", 10,10);

    for(let i=0; i < ship1.health; i++){
      image(sprite_hearth,10+i*50,40);  
    }

    
    for(let i=0; i < ship2.health; i++){
      image(sprite_hearth,windowWidth-10-40 - i*50,40);
    }
    

    fill(255);
    textSize(25);
    textAlign(RIGHT,TOP);
    text("Player 2: Burak", windowWidth-10, 10);
  pop();
}

function game_over_control(){
  if(ship1.health == 0 || ship2.health == 0){

    //Kazanan Oyuncunun Tespitini yapıyoruz.
    if(ship1.health != 0){
      game_winner = "Player 1";
    }else if(ship2.health != 0){
      game_winner = "Player 2";
    }

    //Game Over sahnesine gidiyoruz.
    current_stage = "GAME_OVER"
  }
}

function game_reset(){
  //1. Gemiyi Sıfırlıyoruz.
  ship1.health = 3;
  ship1.position_x = -100;
  ship1.position_y = 0;
  ship1.angle = 180;
  ship1.speed = 0;
  ship1.speed_x = 0;
  ship1.speed_y = 0;
  ship1.cannonballs = [];

  //2. Gemiyi Sıfırlıyoruz
  ship2.health = 3;
  ship2.position_x = 100; 
  ship2.position_y = 0;
  ship2.angle = 0;
  ship2.speed = 0;
  ship2.speed_x = 0;
  ship2.speed_y = 0;
  ship2.cannonballs = [];
}