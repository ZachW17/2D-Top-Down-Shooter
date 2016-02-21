// life2.js
// dependencies: app.draw module
// description: singleton object
"use strict";
var app = app || {};

app.life2 = {

	color: "yellow",
	x: undefined,
	y: undefined,
	width: 34,
	height: 42,
	speed: 250,
	image: undefined,
	
	// creates a new life image
	init : function()
	{
	
	
	},
	
	// draws a picture of the ship representing a life
	draw : function(ctx)
	{
		var halfW = this.width/2;
		var halfH = this.height/2;
	
	   var halfW = this.width/2;
	   var halfH = this.height/2;
	   
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

	}
	
	
};