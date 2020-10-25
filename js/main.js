window.addEventListener("load", function(event) {
    var loading = true;

    var moveLeftTrigger = false;
    var moveRightTrigger = false;
    var shootTrigger = false;
    "use strict";

    var keyDownUp = function(event) {
  
      controller.keyDownUp(event.type, event.keyCode);
  
    };

    var resize = function(event) {
  
      display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
      display.render();
  
    };
  
    var renderPlayer = function(){
        //display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.drawSpriteFrame(game.world.player.imgSrc, game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height);
        if(game.world.player.shooting) { display.drawRectangle(game.world.player.currentBullet.x, game.world.player.currentBullet.y, game.world.player.currentBullet.width, game.world.player.currentBullet.height, game.world.player.currentBullet.color) }
    }

    var renderEnemy = function(enemy){
        display.drawRectangle(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
        if(enemy.shooting) { display.drawRectangle(enemy.currentBullet.x, enemy.currentBullet.y, enemy.currentBullet.width, enemy.currentBullet.height, enemy.currentBullet.color) }
    }

    var renderEnemies = function(){
        if(game.world.enemies){
            game.world.enemies.forEach(enemy => {
                renderEnemy(enemy);
            });
        }
    }

    var renderHud = function(){
        var size = 70
        var blue = "#1fbcff"
        var red = "#ff0000"
        var w = 4000
        var h = 3000

        display.drawText("Lives : " + game.world.player.lives, w*0.1, h*0.075, size, blue)
        display.drawText("Score : " + game.world.player.score, w*0.3, h*0.075, size, blue)
        display.drawText(game.world.level, w*0.475, h*0.04, size, red)
        display.drawText("High Score : " + game.world.highscore, w*0.55, h*0.075, size, blue)
        display.drawText("Enemies : " + game.world.enemies.length, w*0.85, h*0.075, size, blue)
    }

    var render = function() {
      if(game.world.enemies === undefined){
          game.world.enemies = game.world.createEnemies(4,10,24);
      }
      //display.fill(game.world.background_color);
      //display.fillImage(game.world.bgImage);
      display.clear();
      renderPlayer();
      renderEnemies();
      renderHud();
      display.render();
      if(game.world.player.score > 0){
        var instructions = document.getElementById("instructions");
        instructions.classList.add("hide");
      }
  
    };
  
    var update = function() {
      if(loading){return;}
      if (controller.left.active || moveLeftTrigger) { game.world.player.moveLeft(); }
      if (controller.right.active || moveRightTrigger) { game.world.player.moveRight(); }
      if (controller.spacebar.active || shootTrigger) { game.world.player.shoot(game.world.level); controller.spacebar.active = false; }
      shootTrigger = false;
      game.update();
  
    };
    var sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    var load = async function(){
        var header = document.getElementById("sJHeader");
        var instructions = document.getElementById("instructions");
        var gameCanvas = document.getElementById("gameCanvas");
        
        instructions.classList.add("hide")
        gameCanvas.classList.add("hide")

        await sleep(2000);
        gameCanvas.classList.remove("invisible")
        instructions.classList.remove("invisible")

        header.classList.add("hide")

        instructions.classList.remove("hide")
        instructions.classList.add("show")
    
        await sleep(4000);
        instructions.classList.remove("show")
        instructions.classList.add("hide")

        await sleep(2000);
        gameCanvas.classList.remove("hide")
        gameCanvas.classList.add("show")

        await sleep(2000);
        loading = false;
    }

    var controller = new Controller();
    var display    = new Display(document.querySelector("canvas"));
    var game       = new Game();
    var engine     = new Engine(1000/30, render, update);

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
  
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup",   keyDownUp);
    window.addEventListener("resize",  resize);

    var leftTouch = document.getElementById("left");
    var rightTouch = document.getElementById("right");
    var shootTouch = document.getElementById("shoot");
    
    leftTouch.addEventListener("touchstart", function(){
        moveLeftTrigger = true;
    });
    leftTouch.addEventListener("touchend", function(){
        moveLeftTrigger = false;
    });

    rightTouch.addEventListener("touchstart", function(){
        moveRightTrigger = true;
    });
    rightTouch.addEventListener("touchend", function(){
        moveRightTrigger = false;
    });

    shootTouch.addEventListener("touchstart", function(){
        shootTrigger = true;
    })
  
    resize();
  
    load();

    engine.start();
  
  });