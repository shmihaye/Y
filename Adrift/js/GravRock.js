// Parameters
var gravDistance = 250;

// Just for the gravAttach function
var gravRockPosX, gravRockPosY;

function GravRock(game, image) {
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	this.body.immovable = true;
	
	// Add animations
	this.animations.add('default', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
	var anim = this.animations.add('implode', [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28], 20, false);
	anim.killOnComplete = true;
	this.animations.play('default');
	
};

GravRock.prototype = Object.create(Phaser.Sprite.prototype);
GravRock.prototype.constructor = GravRock;

GravRock.prototype.update = function() {
	
	if(this.alive){
	// Temporarily hold these values.
	gravRockPosX = this.x;
	gravRockPosY = this.y;
	
	// GravRock will be looking to pull every object in the scene.
	let obstacleLength = obstacles.children.length;
	for(let i = 0; i < obstacleLength; i++){
		if(obstacles.children[i].alive && obstacles.children[i] !== this && obstacles.children[i] !== player.grabbed ){
			
			// Collide other objects and attach them with self.
			let collided = game.physics.arcade.collide(obstacles.children[i], this, gravAttach, null, this);
			
			// Try to pull obstacles that are not attached.
			if(!collided) gravPull(obstacles.children[i]);
		}
		
	}}
}

GravRock.prototype.die = function(){
	implodeSound.play('',0,sfxVolume);
	this.animations.play('implode');
}


function gravPull(object) {
	
	// Calculate distances.
	let distanceX = object.x - gravRockPosX;
	let distanceY = object.y - gravRockPosY;
	let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
	
	if (distance < gravDistance) {
		
		// Implement the pull force.
		object.body.velocity.x -= distanceX / 50;
		object.body.velocity.y -= distanceY / 50;
		
	}	
	
}

function gravAttach(obstacle, gravRock) {
	
	// Disable another object's original velocity.
	//obstacle.body.velocity.x = 0; obstacle.body.velocity.y = 0;
	
	// Ride
	obstacle.body.velocity.x = gravRock.body.velocity.x;
	obstacle.body.velocity.y = gravRock.body.velocity.y;
	//obstacle.x += gravRockPosX - gravRockLastPosX;
	//obstacle.y += gravRockPosY - gravRockLastPosY;
	
}
