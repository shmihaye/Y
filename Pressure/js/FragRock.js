var currentFragRock;

// Parameters
var collisionActivationTime = 2; // 2 Seconds

function FragRock(game, posX, posY, image, collisionEnabled) {
	
	Phaser.Sprite.call(this, game, posX, posY, image);
	
	// Physics
	game.physics.arcade.enable(this);
	this.body.gravity.y = 0;
	this.body.velocity.x = -60;
	
	this.anchor.set(0.5);
	
	this.primed = false;
	this.collisionEnabled = collisionEnabled;
	
}

FragRock.prototype = Object.create(Phaser.Sprite.prototype);
FragRock.prototype.constructor = FragRock;

FragRock.prototype.update = function() {
	
	currentFragRock = this;
	
	// Record the spawn time.
	var spawnTime = 0;
	var spawnTimeSet = false;
	
	if (! this.collisionEnabled && ! spawnTimeSet) {
		
		spawnTime = game.time.totalElapsedSeconds();
		
		spawnTimeSet = true;
		
	}
	
	// Enable collision after some time.
	if (! this.collisionEnabled && game.time.totalElapsedSeconds() - spawnTime >= collisionActivationTime) {
		
		this.collisionEnabled = true;
		
	}
	
	// Collide other objects if collision is enabled.
	if (this.collisionEnabled) {
	
		game.physics.arcade.collide(this, obstacles, shatter, null, this);
		
	}
	
}

function shatter(fragRock, collidedObject) {
	
	for (let i = 1; i <= 3; i++) {
		let imgName = 'fragRock' + (i+1).toString();
		let fragPiece = new FragRock(game, currentFragRock.x, currentFragRock.y, imgName, false);
		fragPiece.scale.setTo(currentFragRock.scale.x);
		
		if (i === 1) { fragPiece.body.velocity.x = -300; fragPiece.body.velocity.y = 30; } // ERROR: The frag piece's speed will go to -30 whatsoever.
		if (i === 2) { fragPiece.body.velocity.x = 300; fragPiece.body.velocity.y = 30; }
		if (i === 3) { fragPiece.body.velocity.x = 0; fragPiece.body.velocity.y = -200; }
		
		game.add.existing(fragPiece);
		obstacles.add(fragPiece);
	
	}
	
	collidedObject.kill();
	currentFragRock.kill();
	
}
