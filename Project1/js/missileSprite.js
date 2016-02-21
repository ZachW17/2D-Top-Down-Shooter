"use strict";
app.MissileSprite = function(){

	function MissileSprite(image,width,height,frameWidth,frameHeight,frameDelay) {

		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.xVelocity = 0
		this.yVelocity = 0;
		this.image = image;
		this.color = "red";
		this.active = true;
		// new
		this.frameWidth = frameWidth; // 400
		this.frameHeight = frameHeight; // 97
		this.frameDelay = frameDelay;
		this.numCols = Math.floor(this.image.width/this.frameWidth); // should be 17
		this.numRows = Math.floor(this.image.height/this.frameHeight);
		this.totalFrames = this.numCols * this.numRows;
		this.frameIndex = 0;
		this.lastTime = 0;
	};
		

	var p = MissileSprite.prototype;
	
  	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
			
		} else{
			//ctx.drawImage(this.image,this.x - halfW, this.y - halfH, this.width, this.height);
			// sprite animation will go here
			var col = this.frameIndex % this.numCols;
			var row = Math.floor(this.frameIndex / this.numCols);
			//console.log(col);
			var imageX = col * this.frameWidth;
			var imageY = row * this.frameHeight;
			
			ctx.drawImage(this.image, // sprite sheet
			imageX, imageY, this.frameWidth, this.frameHeight, // source
			this.x, this.y, this.width - halfW, this.height - halfH); // destination
		}
			
	  };
	
	  p.update = function(dt) {
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.lastTime += dt;
		if(this.lastTime >= this.frameDelay){
			this.lastTime = 0;
			this.frameIndex ++;
		}
		if(this.frameIndex >= this.totalFrames){
			this.frameIndex = 0; // if we wanted to loop
			//this.active = false;
		}
	  };
	  
	
	return MissileSprite;
	
}();