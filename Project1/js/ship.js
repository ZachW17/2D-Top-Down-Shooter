// ship.js
// dependencies: app.draw module
// description: singleton object
"use strict";
var app = app || {};

app.ship = {
	color: "yellow",
	x: undefined,
	y: undefined,
	width: 34,
	height: 42,
	speed: 250,
	image: undefined,
	exhaust: undefined,
	
	init: function(){
		
		this.exhaust = new app.Emitter();
		this.exhaust.numParticles = 100;
		this.exhaust.red = 255;
		this.exhaust.green = 150;
		
		this.exhaust.createParticles(this.emitterPoint());
		
	},
	
	draw: function(ctx)
	{
		// ctx.fillRect() draws from upper left of the x,y
		// we're doing these calculations so we are drawing the ship from center x,y
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		   var halfW = this.width/2;
		   var halfH = this.height/2;
		   //debugger;
		   if(!this.image)
		   {
				app.draw.rect(ctx,this.x - halfW,this.y - halfH, this.width,this.height, this.color);
		   }
		   else
		   {
				ctx.drawImage(this.image,
				0,0,173,291,
				this.x - halfW, this.y - halfH, this.width, this.height);
				
		   }
	   /*
		ctx.clearRect(x, y, w, h);
			
		if(!this.image)
		{
			app.draw.rect(ctx, this.x - halfW, this.y - halfH, this.width, this.height, this.color);
		}
		*/
		this.exhaust.updateAndDraw(ctx, this.emitterPoint());
	},
	
	moveLeft: function(dt)
	{
		this.x -= this.speed * dt;
	},
	
	moveRight: function(dt)
	{
		this.x += this.speed * dt;
	},
	
	moveDown: function(dt)
	{
		this.y += this.speed * dt;
	},
	
	moveUp: function(dt)
	{
		this.y -= this.speed * dt;
	},
	
	/*
	emitterPoint : function()
	{
		return
		{
			x:this.x,
			y:this.y + this.height/2 + 2
		};
	}
	*/
	emitterPoint : function(){
		return {
			x : this.x,
			y : this.y + this.height / 2 + 2
		};
	}
	
	
};