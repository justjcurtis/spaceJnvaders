const Game = function() {

    this.world = {
  
      background_color:"rgba(40,48,56,1)",
      bgImage:"./assets/space.jpeg",
    
      friction:0.69,
      gravity:3,
  
      player:new Game.Player(),
      highscore:0,
      level:1,
      enemies:undefined,
      enemySpeed:10,
      shouldStepDown:0.01,
      changeDirection:false,
      height:3000,
      width:4000,
  
      collideObject:function(object) {
  
        if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
        if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
        else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }
      },
  
      collideBullet:function(object, bullet) {
        if(object.x < bullet.x + bullet.width && object.x + object.width > bullet.x){
            if(object.y < bullet.y + bullet.height && object.y + object.height > bullet.y){
                object.hit()
                return true;
            }
        }
      },  

      collideBulletCancel:function(bulletA, bulletB) {
        if(bulletA.x < bulletB.x + bulletB.width && bulletA.x + bulletA.width > bulletB.x){
            if(bulletA.y < bulletB.y + bulletB.height && bulletA.y + bulletA.height > bulletB.y){
                return true;
            }
        }
      },

      createEnemies:function(rows, columns, margin){
          enemies = []
          var width = 80;
          var height = 80;
          var spacing_x = 170;
          var spacing_y = 100;
          var initial_x = margin*28;
          var initial_y = 200;
          for(var i = 0; i < columns; i++){
              for (var j = 0; j < rows; j++){
                  var invader_x = initial_x + ((spacing_x+width)*i) + spacing_x;
                  var inavder_y = initial_y + ((spacing_y+height)*j) + spacing_y;
                  enemies.push(new Game.Invader(invader_x, inavder_y, i, j));
              }
          }
          return enemies;
      },

      rightmostEnemy:function(enemies){
          return enemies[enemies.length -1];
      },

      leftmostEnemy(enemies){
          return enemies[0];
      },

      lowestEnemy(enemies){
        var maxEnemy = enemies[0];
        enemies.forEach(enemy =>{
            if(enemy.rowId > maxEnemy.rowId){
                maxEnemy = enemy;
            }
            if(maxEnemy.rowId == 3){
                return maxEnemy;
            }
        });
        return maxEnemy;
      },
  
      update:function() {
  
        this.player.velocity_y += this.gravity;
        this.player.update();
        if(!this.changeDirection){
            if(this.enemies[0].direction > 0){
                var rme = this.rightmostEnemy(this.enemies)
                if(rme.x+rme.width >= this.width){
                    this.changeDirection = true;
                }
            }else{
                var lme = this.leftmostEnemy(this.enemies)
                if(lme.x <= 0){
                    this.changeDirection = true
                }
            }
        }
        if(this.changeDirection){
            var ssd = false;
            if(Math.random() + (this.level*5/100 - 0.01) <this.shouldStepDown){
                ssd = true;
            }
        }
        var chanceToShoot = (0.001+this.level/10000+(0.001*(1-(this.enemies.length/40))));
        var eIndex = 0
        var dead = []
        var enemyBullets = []
        this.enemies.forEach(enemy => {
            if(this.changeDirection){
                enemy.direction *= -1;
                enemy.x -= 2;
                if(ssd){
                    enemy.stepDown()
                }
            }
            enemy.speed = this.enemySpeed;
            if(this.player.shooting){
                killBullet = this.collideBullet(enemy, this.player.currentBullet)
                if(killBullet){
                    this.player.score += 100
                    this.player.shooting = false;
                    this.player.currentBullet = undefined;
                }
            }
            if(enemy.lives < 1){
                dead.push(eIndex);
            }else{
                if(Math.random()<chanceToShoot){
                    enemy.shoot(eIndex, this.level)
                    
                }
            }
            if(enemy.shooting){
                enemyBullets.push(enemy.currentBullet)
                enemy.currentBullet.update() 
                if(enemy.currentBullet.y > this.height){
                    enemy.currentBullet = undefined;
                    enemy.shooting = false;
                }
            }
            enemy.update();
            eIndex ++;
        });
        if(dead.length > 0){
            dead.forEach(ded =>{
                this.enemies.splice(ded, 1);
            });
            dead = [];
        }
        this.shouldStepDown = (1-(this.enemies.length/40))+(3/40)
        this.enemySpeed = 18+(10*this.level*(1-(this.enemies.length/80))) + (this.level/2)
        this.changeDirection = false;
  
        this.player.velocity_x *= this.friction;
        this.player.velocity_y *= this.friction;
        enemyBullets.forEach(bullet => {
            var killBullet = this.collideBullet(this.player, bullet);
            if(killBullet===true){
                this.enemies[bullet.owner].shooting = false;
                this.enemies[bullet.owner].currentBullet = undefined;
            }
        });
        this.collideObject(this.player);

        if(this.player.shooting){
            var ignore = false;
            enemyBullets.forEach(bullet => {
                try{
                    if(this.enemies[bullet.owner].shooting && bullet !== undefined && !ignore){
                        var cancel = this.collideBulletCancel(this.player.currentBullet, bullet)
                        if(cancel){
                            this.player.score += 50
                            this.player.currentBullet = undefined;
                            this.player.shooting = false;
                            this.enemies[bullet.owner].currentBullet = undefined;
                            this.enemies[bullet.owner].shooting = false;
                            ignore = true;
                        }
                    }
                }catch{}
            });
            ignore = false;
        }

        if(this.player.shooting){ 
            this.player.currentBullet.update() 
            if(this.player.currentBullet.y < 0){
                this.player.currentBullet = undefined;
                this.player.shooting = false;
            }
        }
        if(this.enemies.length == 0){
            this.player.score = Math.round(this.player.score * 1.61803399);
            this.player.lives += Math.ceil(this.level/2);
            this.level ++;
            this.enemies = undefined;
        }
        if(this.enemies){
            var low = this.lowestEnemy(this.enemies);
            if(low.y + low.height >= this.height){
                this.player.lives = 0;
            }
        }
        if(this.player.lives < 1){
            this.enemies = undefined;
            this.level = 1;
        }else{
            if(this.player.score > this.highscore){
                this.highscore = this.player.score;
            }
            this.player.speed = 11 + (2*(this.level));
        }
      }
  
    };
  
    this.update = function() {
  
      this.world.update();  
    };
  
  };
  
  Game.prototype = { constructor : Game };
  
  Game.Invader = function(x, y, columnId, rowId){
    this.color      = "#ff0000";
    this.height     = 80;
    this.shooting    = false;
    this.width      = 80;
    this.x          = x;
    this.y          = y;
    this.currentBullet = undefined;
    this.speed = 1
    this.direction = 1
    this.lives = 1
    this.columnId = columnId;
    this.rowId = rowId;
  }

  Game.Invader.prototype = {
    stepDown:function(){
        this.y += this.height*0.8;
    },
    shoot:function(id, speedModifier) {
  
      if (!this.shooting) {
        this.shooting = true;
        this.currentBullet = new Game.Bullet(this.x + this.width/2 -1, this.y, 1, 60+(speedModifier*10), false, id);
        this.currentBullet.fire()
      }
    },
    hit:function(){
        this.lives --;
    },
    update:function(){
        this.x += this.speed * this.direction;
    }
  }

  Game.Bullet = function(x, y, direction, speed, friendly, owner){
      if(friendly){
          this.color = "#1fbcff"
      }
      else{
        this.color = "#ff0000"
      }
      this.friendly = friendly
      this.direction = direction;
      this.x = x;
      this.y = y;
      this.height = 77;
      this.width = 11;
      this.velocity_y = 0;
      this.speed = speed;
      this.visible = true;
      this.owner = owner
  }

  Game.Bullet.prototype ={
      
    constructor : Game.Bullet,

    fire:function() { this.velocity_y = this.speed * this.direction; },
    
    update:function() {
         this.y += this.velocity_y
    }

  }

  Game.Player = function(x, y) {
  
    this.color      = "#1fbcff";
    this.height     = 160;
    this.shooting    = false;
    this.jumping = true;
    this.speed = 13;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.width      = 160;
    this.x          = 4000/2 - this.width/2;
    this.y          = 3000-this.height;
    this.currentBullet = undefined;
    this.score = 0
    this.lives = 5
    this.imgSrc = "./assets/player.png"
  
  };
  
  Game.Player.prototype = {
  
    constructor : Game.Player,
  
    shoot:function(speedModifier) {
  
      if (!this.shooting) {
        this.shooting = true;
        this.currentBullet = new Game.Bullet(this.x + this.width/2 -1, this.y+77, -1, 100+(speedModifier*10), true, 1111);
        this.currentBullet.fire()
      }
    },

    hit:function(){
        this.score -= 25
        if(this.score < 0){
            this.score = 0;
        }
        this.lives --;
    },

    reset:function() {
  
      if (this.shooting) {
          this.currentBullet = undefined;
          this.shooting = false;
      }
      this.velocity_x = 0;
      this.x = 4000/2 - this.width/2;
      this.score = 0;
      this.lives = 5;
    },
  
    moveLeft:function()  { this.velocity_x -= this.speed; },
    moveRight:function() { this.velocity_x += this.speed; },
  
    update:function() {
  
      this.x += this.velocity_x;
      this.y += this.velocity_y;
      if(this.lives < 1){
          this.reset()
      }
  
    }
  
  };