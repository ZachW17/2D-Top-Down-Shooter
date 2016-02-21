// laser.js
// dependencies: none

"use strict";
var app = app || {};

app.Laser = function(){

	function Laser(img, x, y, xVel, yVel){
		// ivars - unique for every instance
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVelocity = xVel;
		this.yVelocity = yVel;
		this.width = 50;
		this.height = 50;
		this.color = "#FFF";
		//console.log(img);
		this.image = img;
		this.active = true;
	} // end Laser Constructor
	
	
	var p = Laser.prototype;
		
	p.update = function(dt) {
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && inBounds(this.y);
	};

	p.draw = function(ctx) {
	
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		
		if(!this.image)
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		}
		else
		{
		//console.log(this.image);
			ctx.drawImage(this.image, 0,0,600,600,this.x , this.y, this.width - halfW, this.height - halfH);
			/*
				ctx.drawImage(this.image,
				28,2,17,21,
				this.x - halfW, this.y - halfH, this.width, this.height);
			*/
		}
	};
	
	// private method
	function inBounds(y){
		return y >= -10;
	};

	return Laser; 
}();
