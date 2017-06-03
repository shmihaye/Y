
// Parameters
var bombDistance = 250;

function BombRock(game, image) {
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	
	// Add animations
	this.animations.add('default', [0,1,2], 10, true);
	var anim = this.animations.add('explode', [3,4,5,6,7,8,9,10,11,12,13], 20, false);
	anim.killOnComplete = true;
	this.animations.play('default');
	this.exploded = false;
	
	// Resize hitbox
	this.body.setSize(30, 30, 17, 17);
};

BombRock.prototype = Object.create(Phaser.Sprite.prototype);
BombRock.prototype.constructor = BombRock;

BombRock.prototype.die = function(){
	if(!this.exploded){
		explodeSound.play('',0,sfxVolume);
		this.exploded = true;
		let obstacleLength = obstacles.children.length;
		for(let i = 0; i < obstacleLength; i++){
			if(obstacles.children[i].alive && obstacles.children[i] !== this && obstacles.children[i] !== player.grabbed 
			&& getDistance(this, obstacles.children[i]) < bombDistance) obstacles.children[i].die();
		}
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		this.animations.play('explode'); // The rock will be killed when the animation is complete
	}
}
