// levelControl.js
// dependencies: app.draw module
// description: singleton object
"use strict";
var app = app || {};

app.levelControl = {

	level : undefined,
	enemySpeed : undefined,
	enemyRate : undefined,
	enemyFireRate : 2,
	
	init : function()
	{
	
		this.level = 1;
		this.enemyFireRate = 0.01;
		this.enemyRate = 0.01;
		this.enemySpeed = 1;
		
	},
	
	// Spawns a new enemy onto the page based off the level
	spawn : function(img, height, width)
	{
	
		//this.enemies.push(new app.Enemy(this.enemyImage, this.WIDTH, this.HEIGHT));
		//app.blastem.enemies.push(new app.Enemy(app.blastem.enemyImage,app.blastem.WIDTH,app.blastem.HEIGHT));

		if(Math.random() < this.enemyRate)
		{
			//var xVel = this.canvasWidth / 4 + Math.random() * this.canvasWidth / 2;
			//var yVel = 0;
			
			app.blastem.enemies.push(new app.Enemy(img, height, width, this.enemyFireRate));
			
		}
		
	},
	
	// increases the difficulty of the game
	levelUp : function()
	{
	
		this.level++;
		this.enemyRate += .01
		this.enemySpeed += .02
		app.blastem.tooNextLevel += 5;
	
	},
	
	// resets it to the first level
	reset : function()
	{
		this.level = 1;
		this.enemyRate = 0.01;
		this.enemySpeed = 1;
		this.enemyFireRate = .01;
		app.blastem.tooNextLevel = 10;
	}
	
	
	
};