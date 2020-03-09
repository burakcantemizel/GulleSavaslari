class Cannonball{

    constructor(position_x, position_y, angle){
        this.position_x = position_x;
        this.position_y = position_y;
        this.angle = angle;
        this.speed = 300;
        this.speed_x = 0;
        this.speed_y = 0;
        this.sprite_cannonball = loadImage("data/sprites/Ship parts/cannonBall.png");
        this.life_time = 0;
        this.scale_amount = 1;
    }

    move(){
        this.life_time += delta;

        
        this.speed_x = cos(this.angle) * this.speed;
        this.speed_y = sin(this.angle) * this.speed;
        this.position_x += this.speed_x * delta;
        this.position_y += this.speed_y * delta;
        
    }

    draw(){
        push();
            if(this.life_time > 0 && this.life_time < 0.7){
                this.scale_amount += 0.02;
            }else{
                if(this.scale_amount > 0.8){
                    this.scale_amount -= 0.02;
                }
            }
            translate(this.position_x, this.position_y);
            scale(this.scale_amount);
            image(this.sprite_cannonball, -this.sprite_cannonball.width/2, -this.sprite_cannonball.height/2);
        pop();
    }

}