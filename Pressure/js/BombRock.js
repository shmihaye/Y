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
	
	// Add animations
	this.animations.add('default', [0,1,2], 10, true);
	this.animations.play('default');
	var anim = this.animations.add('explode', [3,4,5,6,7,8,9,10,11,12,13], 10, false);
	anim.killOnComplete = true;
};

BombRock.prototype = Object.create(Phaser.Sprite.prototype);
BombRock.prototype.constructor = BombRock;

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
	
	this.animations.play('explode'); // The rock will be killed when the animation is complete
	
}
