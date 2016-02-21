// blastem.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.blastem = {
    	// CONSTANT properties
    	WIDTH : 800, 
    	HEIGHT: 800,
		FIRE_RATE : 2,
		ENEMY_PROBABILITY_PER_SECOND : 1.0,
    	
    	
		// variable properties
		canvas : undefined,
		ctx :  undefined,
		dt: 1/60.0, // "delta time"
		ship: undefined,
		enemeyImage : undefined,
		pulsar: undefined,
		playerBullets : [],
		cooldown : 0,
		enemies : [],
		score : 0,
		
		// Part C
		explosions : [],
		explosionImage : undefined,
		explosionImage2 : undefined,
		explosionImage3 : undefined,
		explosionImage4 : undefined,
		
		// My variables
		missileImage : undefined,
		laserImage : undefined,
		playerMissiles : [],
		landedEnemies : [],
		shipLives : [],
		enemyLasers : [],
		ship1 : undefined,
		ship2 : undefined,
		ship3 : undefined,
		lives : 3,
		enemiesHit : 0,
		levelController : undefined,
		tooManyLanded : false,
		tooNextLevel : 10,
		enemiesTooLose : 10,
		enemiesLanded : 0,
		shipHit : false,
		level : 1,
		
    	init : function() {
		//debugger;
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			
			
			// the canvas context enables us to 
			// interact with the canvas api
			this.ctx = this.canvas.getContext('2d');
			
			
			this.canvas.onmousedown = app.blastem.doMousedown;
			
			//debugger;
			// set up player ship
			this.ship = app.ship;
			this.ship.init(); // doesn't do anything yet
			this.ship.x = 425;
			this.ship.y = 725;
			var image = new Image();
			image.src = app.IMAGES['shipImage'];
			this.ship.image = image;
			var image2 = new Image();
			image2.src = app.IMAGES['enemyImage'];
			this.enemyImage = image2;
			
			var image3 = new Image();
			image3.src = app.IMAGES['explosionImage'];
			this.explosionImage = image3;
			var image4 = new Image();
			image4.src = app.IMAGES['explosionImage2'];
			this.explosionImage2 = image4;
			var image5 = new Image();
			image5.src = app.IMAGES['explosionImage3'];
			this.explosionImage3 = image5;
			
			var image6 = new Image();
			image6.src = app.IMAGES['missileImage'];
			this.missileImage = image6;
			
			var image7 = new Image();
			image7.src = app.IMAGES['laserImage'];
			this.laserImage = image7;
			
			var image8 = new Image();
			image8.src = app.IMAGES['explosionImage4'];
			this.explosionImage4 = image8;
			
			// the extra lives ships
			this.ship1 = app.life1;
			this.ship1.init();
			this.ship1.x = 50;
			this.ship1.y = 50;
			this.ship1.image = image;
			this.shipLives.push(this.ship1);
			
			
			this.ship2 = app.life2;
			this.ship2.init();
			this.ship2.x = 100;
			this.ship2.y = 50;
			this.ship2.image = image;
			this.shipLives.push(this.ship2);
			
			
			this.ship3 = app.life3;
			this.ship3.init();
			this.ship3.x = 150;
			this.ship3.y = 50;
			this.ship3.image = image;
			this.shipLives.push(this.ship3);
			
			
			// pulsar
			
			this.pulsar = new app.Emitter();
			this.pulsar.red = 255;
			this.pulsar.minXspeed = this.pulsar.minYspeed = -.025;
			this.pulsar.maxXspeed = this.pulsar.maxXspeed = 0.25;
			this.pulsar.lifetime = 500;
			this.pulsar.expansionRate = 0.05;
			this.pulsar.numParticles = 100;
			this.pulsar.xRange = 1;
			this.pulsar.yRange = 1;
			this.pulsar.useCircles = false;
			this.pulsar.useSquares = true;
			this.pulsar.createParticles({x:100,y:100});
			
			
			this.levelController = app.levelControl;
			this.levelController.init();
			this.startSoundtrack();
			// draw the screen once
			this.update();
    	},
    	
    	
    update: function(){
	
    	// clear screen
    	app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		
		// check all of the four game states, paused, playing, start screen and end screen
		
		
		if(this.enemiesHit >= this.tooNextLevel)
		{
			app.playing = false;
			app.leveledScreen = true;
		}

		if(this.enemiesLanded >= this.enemiesTooLose)
		{
			
			app.playing = false;
			app.endScreen = true;
			this.tooManyLanded = true;
			
		}
		
		if(this.shipHit)
		{
			app.playing = false;
			app.hitScreen = true;
		}
		
		if(this.lives <= 0)
		{
			app.paused = false;
			app.startScreen = false;
			app.playing = false;
			app.leveledScreen = false;
			app.hitScreen = false;
			app.endScreen = true;
		}
		
		if(this.level >= 5)
		{
			app.paused = false;
			app.startScreen = false;
			app.playing = false;
			app.leveledScreen = false;
			app.hitScreen = false;
			app.endScreen = true;
		}
		
		if (app.paused) // paused
		{
			this.drawPauseScreen(this.ctx);
			return;
		} else if(app.playing) // playing the game
		{
		 
			for(var i = 0; i < this.enemies.length; i++)
			{
			
				if(Math.random() < this.levelController.enemyFireRate)
				{
					this.enemies[i].shoot();
					createjs.Sound.play("lazerz");
				}
				
			}
		 
			
			// UPDATE
			// move sprites
			this.moveSprites();
			
			// CHECK FOR COLLISIONS	
				this.checkForCollisions();
			
			// DRAW	
			// i) draw background
			app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
			
			// ii) draw sprites
			this.ctx.globalAlpha = 0.9;
			this.drawSprites();
			
			
			// iii) draw HUD
			this.ctx.globalAlpha = 1.0;
			this.drawHUD();
			
		} else if (app.startScreen) // the start screen
		{
		
			this.drawStartScreen(this.ctx);
			return;
		}
		else if (app.endScreen)
		{
			this.drawEndScreen(this.ctx);
		}
		else if(app.leveledScreen)
		{
		
			this.drawLeveledScreen(this.ctx);
			this.drawHUD();
		
			return;
		}
		else if(app.hitScreen)
		{
			this.drawHitScreen(this.ctx);
			this.drawHUD();
		}
		
		
		// LOOP
		// this calls the update() function 60 FPS
		// what happens is we don't use bind?
		app.animationID = requestAnimationFrame(this.update.bind(this));
	},
	
	
	// handle mouse clicking events
	doMousedown : function(e)
	{
		
		//canvas was clicked when on the start screen
		if(app.startScreen)
		{
			app.startScreen = false;
			app.playing = true;
			//debugger;
			app.blastem.ship.x = 425;
			app.blastem.ship.y = 725;
			app.blastem.update();
			return;
		}
		
		if(app.leveledScreen)
		{
			//debugger;
			//app.blastem.update();
			app.blastem.enemiesHit = 0;
			for(var i = 0; i < app.blastem.landedEnemies.length; i++)
			{
				app.blastem.landedEnemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.playerMissiles.length; i++)
			{
				app.blastem.playerMissiles[i].active = false;
			}
			for(var i = 0; i < app.blastem.explosions.length; i++)
			{
				app.blastem.explosions[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemies.length; i++)
			{
				app.blastem.enemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemyLasers.length; i++)
			{
				app.blastem.enemyLasers[i].active = false;
			}
				
			
			app.blastem.landedEnemies = app.blastem.landedEnemies.filter(function(enemy)
			{
				return enemy.active;
			});
			
			app.blastem.enemyLasers = app.blastem.enemyLasers.filter(function(laser)
			{
				return laser.active;
			});
			
			app.blastem.levelController.levelUp();
			
			
			app.blastem.ship.x = 425;
			app.blastem.ship.y = 725;
			app.leveledScreen = false;
			app.playing = true;
			app.blastem.update();
			return;
		} // end leveledScreen
	
		if(app.endScreen)
		{
			//debugger;
			app.blastem.enemiesHit = 0;
			for(var i = 0; i < app.blastem.landedEnemies.length; i++)
			{
				app.blastem.landedEnemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.playerMissiles.length; i++)
			{
				app.blastem.playerMissiles[i].active = false;
			}
			for(var i = 0; i < app.blastem.explosions.length; i++)
			{
				app.blastem.explosions[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemies.length; i++)
			{
				app.blastem.enemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemyLasers.length; i++)
			{
				app.blastem.enemyLasers[i].active = false;
			}
		
			app.blastem.landedEnemies = app.blastem.landedEnemies.filter(function(enemy)
			{
				return enemy.active;
			});
			
			
			app.blastem.enemyLasers = app.blastem.enemyLasers.filter(function(laser)
			{
				return laser.active;
			});
			
			app.blastem.lives = 3;
			app.blastem.ship.x = 425;
			app.blastem.ship.y = 725;
			app.enemiesHit = 0;
			app.blastem.enemiesLanded = 0;
			app.blastem.score = 0;
			app.endScreen = false;
			app.startScreen = true;
			app.blastem.levelController.reset();
			app.blastem.update();
			return;
		}
		
		if(app.hitScreen)
		{
			app.blastem.enemiesHit = 0;
			for(var i = 0; i < app.blastem.landedEnemies.length; i++)
			{
				app.blastem.landedEnemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.playerMissiles.length; i++)
			{
				app.blastem.playerMissiles[i].active = false;
			}
			for(var i = 0; i < app.blastem.explosions.length; i++)
			{
				app.blastem.explosions[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemies.length; i++)
			{
				app.blastem.enemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemyLasers.length; i++)
			{
				app.blastem.enemyLasers[i].active = false;
			}
		
			app.blastem.landedEnemies = app.blastem.landedEnemies.filter(function(enemy)
			{
				return enemy.active;
			});
			
			
			app.blastem.enemyLasers = app.blastem.enemyLasers.filter(function(laser)
			{
				return laser.active;
			});
			
			app.enemiesHit = 0;
			app.blastem.enemiesLanded = 0;
			app.blastem.shipHit = false;
			app.blastem.ship.x = 425;
			app.blastem.ship.y = 725;
			app.hitScreen = false;
			app.playing = true;
			return;
		}
		
		if(app.winScreen)
		{
			app.blastem.enemiesHit = 0;
			for(var i = 0; i < app.blastem.landedEnemies.length; i++)
			{
				app.blastem.landedEnemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.playerMissiles.length; i++)
			{
				app.blastem.playerMissiles[i].active = false;
			}
			for(var i = 0; i < app.blastem.explosions.length; i++)
			{
				app.blastem.explosions[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemies.length; i++)
			{
				app.blastem.enemies[i].active = false;
			}
			for(var i = 0; i < app.blastem.enemyLasers.length; i++)
			{
				app.blastem.enemyLasers[i].active = false;
			}
		
			app.blastem.landedEnemies = app.blastem.landedEnemies.filter(function(enemy)
			{
				return enemy.active;
			});
			
			
			app.blastem.enemyLasers = app.blastem.enemyLasers.filter(function(laser)
			{
				return laser.active;
			});
			
			app.blastem.drawWinScreen();
			
			return;
		}
	},
	
	drawWinScreen : function(ctx)
	{
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Congratulations!  You Won", this.WIDTH/2, this.HEIGHT/2, 40, "blue");
		ctx.restore();
	},
	
	
	// draws the screen when you get hit
	drawHitScreen : function(ctx)
	{
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "You got hit and lost a life!", this.WIDTH/2, this.HEIGHT/2, 40, "red");
		app.draw.text(this.ctx, "Click to reset the level", this.WIDTH/2, this.HEIGHT/2 + 50, 20, "white");
		ctx.restore();
	},
	
	drawLeveledScreen : function(ctx)
	{	
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Next Level!", this.WIDTH/2, this.HEIGHT/2, 60, "white");
		var tempNum = this.tooNextLevel + 5;
		var tempText = "You must now hit " + tempNum + " enemies!"
		app.draw.text(this.ctx, tempText, this.WIDTH/2, this.HEIGHT/2 + 40, 40, "white");
		ctx.restore();
	},
	
	drawEndScreen : function(ctx)
	{	
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Game Over", this.WIDTH/2, this.HEIGHT/2, 60, "red");
		if(this.lives == 0)
		{
			app.draw.text(this.ctx, "You Ran out of lives", this.WIDTH/2, this.HEIGHT/2 + 40, 40, "white");
		}
		else if(this.tooManyLanded)
		{
			app.draw.text(this.ctx, "Too many enemies landed!", this.WIDTH/2, this.HEIGHT/2 + 40, 40, "white");
		}
		var tempText = "Your score was " + this.score;

		app.draw.text(this.ctx, "Your score was " + this.score, this.WIDTH/2, this.HEIGHT/2 + 80, 40, "white");
		ctx.restore();
		
		this.levelController.reset();
	},
	
	// draws the starting screen giving the player instructions on how to play
	drawStartScreen : function(ctx)
	{
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "To Begin, click anywhere", this.WIDTH/2, this.HEIGHT/2, 30, "white");
		app.draw.text(this.ctx, "Instructions: arrows to move your ship and space to fire missiles", this.WIDTH/2, this.HEIGHT/2 + 50, 20, "white");
		app.draw.text(this.ctx, "You must stop the enemy invasion,", this.WIDTH/2, this.HEIGHT/2 + 80, 20, "white");
		app.draw.text(this.ctx, "Up to 10 enemy ships may hit the ground per level", this.WIDTH/2, this.HEIGHT/2 + 110, 20, "white");
		app.draw.text(this.ctx, "There are 5 levels", this.WIDTH/2, this.HEIGHT/2 + 140, 20, "green");
		app.draw.text(this.ctx, "Created by Zach Whitman", this.WIDTH/2, this.HEIGHT/2 + 160, 20, "blue");
		ctx.restore();
	},
	
	// draws the pause screen
	drawPauseScreen: function(ctx){
		ctx.save();
		app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, 60, "white");
		ctx.restore();
	},
	
	
	drawSprites : function (){
		
		
		for(var i = 0; i < this.playerMissiles.length; i++)
		{
			//this.playerBullets[i].draw(this.ctx);
			this.playerMissiles[i].draw(this.ctx);
		}
		//this.ship.draw(this.ctx); // the player knows how to draw itself
		this.ship.draw(this.ctx);
		//this.ship1.draw(this.ctx);
		//this.pulsar.updateAndDraw(this.ctx,{x:100,y:100});
		
		for(var i = 0; i < this.enemies.length; i++)
		{
			this.enemies[i].draw(this.ctx);
		};
		
		// draw explosions
		for(var i = 0; i < this.explosions.length; i++)
		{
			//this.explosions[i].draw(this.image, this.x, this.y, 84, 84, this.x, this.y, 84, 84);
			this.explosions[i].draw(this.ctx);
		};
		
		// draw landedEnemies
		for(var i = 0; i < this.landedEnemies.length; i++)
		{
			this.landedEnemies[i].draw(this.ctx);
		}
		
		// draw lasers
		for(var i = 0; i < this.enemyLasers.length; i++)
		{
			this.enemyLasers[i].draw(this.ctx);
		}
		this.enemyLasers = this.enemyLasers.filter(function(laser){
			return laser.active;
		});
		
		
	},
	
	moveSprites: function(){
		
		var paddingX = this.ship.width/2;
		this.ship.x  = app.utilities.clamp(this.ship.x, paddingX, this.WIDTH - paddingX);
		
		var paddingY = this.ship.height/2;
		this.ship.y  = app.utilities.clamp(this.ship.y, paddingY, this.HEIGHT - paddingY);
		
		// ask "Key Daemon" which keys are down
		if(app.keydown[app.KEYBOARD.KEY_LEFT])
		{
			this.ship.moveLeft(this.dt);
		}
		
		if(app.keydown[app.KEYBOARD.KEY_RIGHT])
		{
			this.ship.moveRight(this.dt);
		}
		if(app.keydown[app.KEYBOARD.KEY_DOWN])
		{
			this.ship.moveDown(this.dt);
		}
		
		if(app.keydown[app.KEYBOARD.KEY_UP])
		{
			this.ship.moveUp(this.dt);
		}
		
		this.cooldown --;
		if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_SPACE])
		{
			this.shoot(this.ship.x - 6,this.ship.y);
			this.cooldown = 50 / this.FIRE_RATE;
		}
		
		// move bullets
		for( var i = 0; i < this.playerBullets.length; i++)
		{
			this.playerBullets[i].update(this.dt);
		}
		
		this.playerBullets = this.playerBullets.filter(function(bullet)
		{
			return bullet.active;
		});
		
		for(var i = 0; i < this.playerMissiles.length; i++)
		{
			this.playerMissiles[i].update(this.dt);
		}
		this.playerMissiles = this.playerMissiles.filter(function(exp){
			return exp.active;
		});
		
		// Enemies
		for(var i = 0; i < this.enemies.length; i++)
		{
			this.enemies[i].update(this.dt);
			if(this.enemies[i].inBounds(this.enemies[i]) == false)
			{
				this.landedEnemies.push(this.enemies[i]);
				this.enemiesLanded++;
			}
			
		}
		
		this.enemies = this.enemies.filter(function(enemy)
		{
			return enemy.active;
		});
		
		this.levelController.spawn(this.enemyImage, this.WIDTH, this.HEIGHT);
		/*
		if(Math.random() < this.ENEMY_PROBABILITY_PER_SECOND/60)
		{
			this.enemies.push(new app.Enemy(this.enemyImage, this.WIDTH, this.HEIGHT));

		}
		*/
		
		// part c - Explosions
		for(var i = 0; i < this.explosions.length; i++)
		{
			this.explosions[i].update(this.dt);

		}
		
		this.explosions = this.explosions.filter(function(exp){
			return exp.active;
		});
		
		// move lasers
		for(var i = 0; i < this.enemyLasers.length; i++)
		{
			this.enemyLasers[i].update(this.dt);
		}
		
		
		this.enemyLasers = this.enemyLasers.filter(function(laser){
			return laser.active;
		});
		
	},
    
	shoot : function(x,y)
	{
		var self = this;
		//this.playerMissiles.push(new app.Bullet(x, y, 200));
		self.createMissile(x,y,0,-200);
		createjs.Sound.play("bullet");
	},
	
	checkForCollisions : function()
	{
	
		var self = this;
		
		this.playerMissiles.forEach(function(bullet) {
			self.enemies.forEach(function(enemy) {
				if (self.collides(bullet, enemy)) {
					self.createExplosion(enemy.x, enemy.y, -enemy.xVelocity/4, -enemy.yVelocity/4);
					enemy.active = false;
					bullet.active = false;
					self.score ++;
					self.enemiesHit ++;
				}
			});
		});
		
		this.enemies.forEach(function(enemy) {
			if (self.collides(enemy, self.ship)) {
				enemy.explode();
				self.score -= 5;
				self.shipHit = true;
				self.lives --;
				self.createExplosion(enemy.x, enemy.y, -enemy.xVelocity/4, -enemy.yVelocity/4);
			}
		});
		
		// check if the lasers hit the player
		this.enemyLasers.forEach(function(laser)
		{
			if(self.collides(laser,self.ship))
			{
				self.score -= 5;
				self.shipHit = true;
				self.lives --;
				
			}
		});
	
	},
	
	
	collides : function(a,b)
	{
		return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
	},
	
	drawHUD : function()
	{
		this.drawText("Score: " + this.score, 40, 20, 16, "#ddd");
		
		for(var i = 0; i < this.lives; i++)
		{
			this.shipLives[i].draw(this.ctx);
		}
		
		
		var tempNum = this.tooNextLevel;
		var tempText = this.enemiesHit + " / " + tempNum;
		this.drawText(tempText , 700, 20, 16, "white");
		
		
	},
	
	drawText : function(string, x, y, size, color) {
			this.ctx.font = 'bold '+size+'px Monospace';
			this.ctx.fillStyle = color;
			this.ctx.fillText(string, x, y);
	},
	
	// part C
	createExplosion : function(x, y, xVelocity, yVelocity)
	{
		//var exp = new app.ExplosionSprite(this.explosionImage, 84, 84, 84, 84, 1/7);
		//var exp = new app.ExplosionSprite(this.explosionImage, 200, 200, 84, 84, 1/14);
		//var exp = new app.ExplosionSprite(this.explosionImage, 30, 30, 84, 84, 1/3);
		//var exp = new app.ExplosionSprite(this.explosionImage2, 128, 128, 64, 64, 1/16);
		//var exp = new app.ExplosionSprite(this.explosionImage3, 64, 32, 256, 128, 1/12);
		var exp = new app.ExplosionSprite(this.explosionImage4, 84, 84,  Math.floor(480/5),  Math.floor(384/4), 1/7);
		exp.x = x;
		exp.y = y;
		exp.xVelocity = xVelocity;
		exp.yVelocity = yVelocity;
		createjs.Sound.play("explosion");
		this.explosions.push(exp);
	},
	
	startSoundtrack : function(){
		createjs.Sound.stop();
		createjs.Sound.play("soundtrack",{loop:-1, volume:2.0});
	},
	
	// creates a new missile to be fired, similar to the explosion
	// it will replace the boring bullet squares we used
	createMissile : function(x, y, xVelocity, yVelocity)
	{
		var missile = new app.MissileSprite(this.missileImage, Math.floor(400/17), 71, Math.floor(400/17), 97, 1/7);
		missile.x = x;
		missile.y = y;
		missile.xVelocity = xVelocity;
		missile.yVelocity = yVelocity;
		this.playerMissiles.push(missile);
	}
	
	
	
	
	
	
};