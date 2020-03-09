class Ship2{

    constructor(position_x, position_y, angle){
        this.position_x = position_x;
        this.position_y = position_y;
        this.sprite_ship = loadImage("data/sprites/Ships/ship2.png");
        this.angle = angle;
        this.speed = 0;
        this.speed_x = 0;
        this.speed_y = 0;
        this.minimum_speed = 0;
        this.maximum_speed = 100;
        this.acceleration = 0.3;
        this.drag = 0.1;
        this.turn_offset = 0.8;
        this.firing_time = 1;
        this.shoot_angle = this.angle;
        this.health = 3;
    }

    move(){
        if(key_left_arrow){
            this.angle -= (this.speed / this.maximum_speed) * this.turn_offset;
        }

        if(key_right_arrow){
            this.angle += (this.speed / this.maximum_speed) * this.turn_offset;
        }

        if(this.speed > 0){
            this.speed -= this.drag;
        }

        if(key_up_arrow){
            this.speed += this.acceleration;
        }

        if(this.speed <= this.minimum_speed){
            this.speed = this.minimum_speed;
        }
        
        if(this.speed >= this.maximum_speed){
            this.speed = this.maximum_speed;
        }

        this.speed_x = cos(this.angle) * this.speed;
        this.speed_y = sin(this.angle) * this.speed;

        this.position_x += this.speed_x * delta;
        this.position_y += this.speed_y * delta;

        if(this.firing_time <= 1){
            this.firing_time += delta;
        }

    }

    fire(){
        let firing_cannonball = new Cannonball(this.position_x, this.position_y, this.shoot_angle);
        ship2_cannonballs.push(firing_cannonball);
    }

    collide(){
        for (let i = 0; i < ship1_cannonballs.length; i++) {
            if(collide_circle_circle(this.position_x, this.position_y, 75/2, ship1_cannonballs[i].position_x, ship1_cannonballs[i].position_y, 5)){
                /*if(cannonballs[i].scale_amount >= 1 && cannonballs[i].scale_amount <= 1.3){

                }*/
                this.health -= 1;  
                ship1_cannonballs.splice(i,1);
                stroke(255);
                fill(255);
            }
        }
    }

    //GEÇİCİ FONKSİYON-----------------------------------------------------------------------------------------------------------------------------------------

    detect_fire_direction(){
        //Doğru Nokta 1
        let lx1 = this.position_x + this.sprite_ship.width/2 * cos(this.angle);
        let ly1 = this.position_y + this.sprite_ship.width/2 * sin(this.angle);

        //Doğru Nokta 2
        let lx2 = this.position_x - this.sprite_ship.width/2 * cos(this.angle);
        let ly2 = this.position_y - this.sprite_ship.width/2 * sin(this.angle);

        //Hedef Nokta
        //let px = mouseX;
        //let py = mouseY;
        let px = ship1.position_x;
        let py = ship1.position_y;

        //YAŞASIN MATEMATİK!!!
        //l1 orjin
        lx2 -= lx1; 
        ly2 -= ly1; 
        px -= lx1; 
        py -= ly1; 

        let cp = lx2 * py - ly2 * px;

        if(cp >= 0){
            //print("cp Pozitif Kısımda")
            //print("Hedef Geminin Solunda!");

            this.shoot_angle = this.angle-90;
        }

        if(cp < 0){
            //print("cp Negatif Kısımda")
            //print("Hedef Geminin Sağında!")

            this.shoot_angle = this.angle+90;
        }

        /*
        if(cp = 0){
            //print("cp 0")
            print("Hedef Gemiyle Aynı Doğrultuda")

            this.shoot_angle = this.angle+90;
        }
        */
    }

    //GEÇİCİ FONKSİYON-----------------------------------------------------------------------------------------------------------------------------------------
    

    draw(){
        push();
            translate(this.position_x, this.position_y);
            rotate(this.angle);
            image(this.sprite_ship,-this.sprite_ship.width/2,-this.sprite_ship.height/2);
        pop();

        //SONRADAN EKLEDİM-------------------------------------------------------------------------------------------------------------------------------------
        push();
            let x1 = (this.position_x - this.sprite_ship.width/2);
            let y1 = this.position_y;
            let x2 = this.position_x + this.sprite_ship.width/2;
            let y2 = this.position_y;
            noFill();
            ellipse(this.position_x,this.position_y,this.sprite_ship.width);
            stroke(255,0,0);
            strokeWeight(15);
            let p_x = this.position_x + this.sprite_ship.width/2 * cos(this.angle);
            let p_y = this.position_y + this.sprite_ship.width/2 * sin(this.angle);
            let p2_x = this.position_x - this.sprite_ship.width/2 * cos(this.angle);
            let p2_y = this.position_y - this.sprite_ship.width/2 * sin(this.angle);
            point(p_x, p_y);
            point(p2_x, p2_y);
            //point(this.position_x - this.sprite_ship.width/2,this.position_y);
            strokeWeight(2);
            line(p_x, p_y, p2_x, p2_y);
        pop();
        //SONRADAN EKLEDİM--------------------------------------------------------------------------------------------------------------------------------------

        push();
            stroke(255);
            noFill();
            this.collide();        
            ellipse(this.position_x, this.position_y, 75, 75);
        pop();
    }


}