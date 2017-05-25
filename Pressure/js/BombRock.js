var currentBombRock;

// Parameters
var bombDistance = 200;

function BombRock(game, image) {
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	
	// Add animations
	this.animations.add('default', [0,1,2], 10, true);
	this.animations.play('default');
	var anim = this.animations.add('explode', [3,4,5,6,7,8,9,10,11,12,13], 10, false);
	anim.killOnComplete = true;
	
	// Resize hitbox
	this.body.setSize(30, 30, 17, 17);
};

BombRock.prototype = Object.create(Phaser.Sprite.prototype);
BombRock.prototype.constructor = BombRock;

BombRock.prototype.update = function() {
	
	currentBombRock = this;
	
}

BombRock.prototype.die = function(){
	obstacles.children.forEach(function(obstacle) {
		
		// Skip self.
		if (obstacle === currentBombRock) { return; }
		
		if (getDistance(currentBombRock, obstacle) < bombDistance) {
			
			obstacle.kill();
		}
		
	});
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	this.animations.play('explode'); // The rock will be killed when the animation is complete
}
