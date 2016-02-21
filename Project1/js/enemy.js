"use strict";
app.Enemy = function()
{

	function Enemy(image,canvasWidth,canvasHeight, firRate)
	{
		// variables
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		this.color = "#A2B";
		this.x = this.canvasWidth / 4 + Math.random() * this.canvasWidth / 2;
		this.y = 0;
		this.xVelocity = 0;
		this.yVelocity = 100;
		this.amplitude = app.utilities.getRandom(1.5,7.0);
		this.image = image;
		this.width = 34;
		this.height = 40;
		this.fireRate = firRate;
		
		var whichType = Math.floor((Math.random() * 10) + 1);
		
		
		if(whichType < 5)
		{
			this.type = 1;
		}
		else
		{
			this.type = 3;
			this.yVelocity = Math.floor((Math.random() * 150) + 50);
		}
		
	};
	
	var p = Enemy.prototype;
	
	p.draw = function(ctx)
	{
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		
		if(!this.image)
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		}
		else
		{
			ctx.drawImage(this.image, 
			0,0,125,238,
			this.x - halfW, this.y - halfH, this.width, this.height);
			/*
				ctx.drawImage(this.image,
				28,2,17,21,
				this.x - halfW, this.y - halfH, this.width, this.height);
			*/
		}
		
	};

	p.update = function(dt)
	{
		if(this.type == 1)
		{
			// sine wave
			this.xVelocity = this.amplitude * Math.sin(this.age * Math.PI * dt);
		}
		else if(this.type == 2)
		{
			// tan wave, doesn't work
			//this.xVelocity = Math.tan(this.age * Math.PI * dt);
		}
		else if(this.type == 3)
		{
			// Do nothing, just fall straight down
			this.xVelocity = Math.random();
			var temp = Math.random();
			if(temp <= 0.5)
			{
				this.xVelocity *= -1;
				this.xVelocity *= 2;
			}
		}
		this.x += this.xVelocity;
		this.y += this.yVelocity * dt;
		this.age++;
		this.active = this.active && p.inBounds(this);
	};
	
	p.explode = function()
	{
		this.active = false;
	};
	
	p.inBounds = function(obj)
	{
		if(obj.y <= obj.canvasHeight - obj.height * 0.5)
		{
			return true;
		}
		else
		{
			//landedEnemies.push(this);
			return false;
		}
	};
	
	// fires a laser at the player
	p.shoot = function()
	{
		var self = this;
		var lazer = new app.Laser(app.blastem.laserImage, self.x, self.y, 0, 200);
		app.blastem.enemyLasers.push(lazer);
	};
	
	
	return Enemy;


}();