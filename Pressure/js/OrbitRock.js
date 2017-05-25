
function OrbitRock(game, image) {
	
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	this.moon = null;
	
	// Physics
	game.physics.arcade.enable(this);
	
	// Resize hitbox
	this.body.setSize(30, 30, 17, 17);
}

OrbitRock.prototype = Object.create(Phaser.Sprite.prototype);

OrbitRock.prototype.constructor = OrbitRock;

OrbitRock.prototype.die = function(){
	
	this.kill();
}

OrbitRock.prototype.update = function() {

	if (this.moon != null) {
		
		this.moon.body.acceleration.x = this.x - this.moon.body.x;
		this.moon.body.acceleration.y = this.y - this.moon.body.y;
		
		//this.moon.pivot.x = this.body.x; this.moon.pivot.y = this.body.y;
		//this.moon.rotation += 0.05;
		
		//this.moon.x = moonLastPosX - (game.time.physicsElapsed / this.body.velocity.x) + (game.time.physicsElapsed / (orbitVelocity * (distanceY / distance)));
		//this.moon.y = moonLastPosY + (game.time.physicsElapsed / (orbitVelocity * (distanceX / distance)));
		
		//moonLastPosX = this.moon.body.x;
		//moonLastPosY = this.moon.body.y;
		
	}
	
}
