// Parameters
var gravRockVelocityX = -30;
var gravDistance = 300;

// Just for the gravAttach function
var gravRockPosX, gravRockPosY, gravRockLastPosX, gravRockLastPosY;

function GravRock(game, image) {
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Add properties and set default values
	
	// Physics
	game.physics.enable(this);
	this.body.immovable = true;
	this.body.velocity.x = gravRockVelocityX;
	
	// Add animations
	this.animations.add('default', [0,1,2,3,4,5,6,7,8,9,10], 10, true);
	this.animations.play('default');
	
	// Resize hitbox
	this.body.setSize(30, 30, 17, 17);
	
};

GravRock.prototype = Object.create(Phaser.Sprite.prototype);
GravRock.prototype.constructor = GravRock;

GravRock.prototype.update = function() {
	
	// Temporarily hold these values.
	var currentGravRock = this;
	gravRockPosX = this.x;
	gravRockPosY = this.y;
	
	// Try to pull the player. Doesn't work yet.
	//gravPull(player);
	
	// GravRock will be looking to pull every object in the scene.
	obstacles.children.forEach(function(obstacle) {
		
		// Skip dead objects.
		if (! obstacle.alive) { return; }
		
		// Skip self.
		if (obstacle === currentGravRock) { return; }

		// Collide other objects and attach them with self.
		var collided = game.physics.arcade.collide(obstacle, currentGravRock, gravAttach, null, this);
		
		// Do nothing if it's already collided.
		if (collided) { return; }
		
		// But if it's not colliding because the grav rock is dead, give attached obstacle the velocity of inertia.
		if (! currentGravRock.alive) {
			
			obstacle.body.velocity.x = gravRockVelocityX;
			
			return;
			
		}
		
		// Try to pull obstacles.
		gravPull(obstacle);
		
	});
	
	// Update self's latest position.
	gravRockLastPosX = this.x;
	gravRockLastPosY = this.y;
	
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

function gravAttach(obstacle, currentGravRock) {
	
	// Disable another object's original velocity.
	obstacle.body.velocity.x = 0; obstacle.body.velocity.y = 0;
	
	// Ride
	obstacle.x += gravRockPosX - gravRockLastPosX;
	obstacle.y += gravRockPosY - gravRockLastPosY;
	
}
