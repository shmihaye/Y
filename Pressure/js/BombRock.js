var currentBombRock;

// Parameters
var bombDistance = 200;

function BombRock(game, image) {
	
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	this.body.gravity.y = 0;
	this.body.velocity.x = -30;
	
	this.anchor.set(0.5);
	this.primed = false;
	
};

BombRock.prototype = Object.create(Phaser.Sprite.prototype);
BombRock.prototype.constructor = BombRock;

BombRock.prototype.create = function() {
	
	this.animations.add('default', [1, 2, 3, 4, 5], 10, true);
	
	this.animations.play('default');
	
}

BombRock.prototype.update = function() {
	
	currentBombRock = this;
	
	var collided = game.physics.arcade.collide(this, obstacles, explode, null, this);
	
}

function explode(bombRock, collidedObject) {
		
	obstacles.children.forEach(function(obstacle) {
		
		// Skip self.
		if (obstacle === currentBombRock) { return; }
		
		if (getDistance(bombRock, obstacle) < bombDistance) {
			
			obstacle.kill();
			
		}
		
	});
	
	currentBombRock.kill();
	
}
