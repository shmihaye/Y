var orbitRadius = 20;
var orbitVelocity = 50;

var moonLastPosX, moonLastPosY;

function OrbitRock(game, posX, posY, image, isCenter) {
	
	Phaser.Sprite.call(this, game, posX, posY, image);
	
	this.isCenter = isCenter;
	
	// Physics
	game.physics.arcade.enable(this);
	this.body.gravity.y = 0;
	
	// Add to the game and group.
	game.add.existing(this);
	obstacles.add(this);
	
	this.anchor.set(0.5);
		
	this.primed = false;
	this.friendly = false;
	
	// Add moon rock, if this one is the center rock.
	if (this.isCenter) {
		
		this.moon = new OrbitRock(game, 850, 100 + orbitRadius, image, false);
		
		this.moon.scale.set(0.5);
		
		moonLastPosX = this.moon.x; moonLastPosY = this.moon.y;
		
	}
	
}

OrbitRock.prototype = Object.create(Phaser.Sprite.prototype);
OrbitRock.prototype.constructor = OrbitRock;

OrbitRock.prototype.update = function() {

	if (this.moon != null) {
	
		let distanceX = this.moon.body.x - this.body.x;
		let distanceY = this.moon.body.y - this.body.y;
		let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		
		console.log(distance);
		
		//this.moon.body.velocity.x = orbitVelocity * (distanceY / distance) + 60;
		//this.moon.body.velocity.y = orbitVelocity * (distanceX / distance);
		
		//this.moon.pivot.x = this.body.x; this.moon.pivot.y = this.body.y;
		//this.moon.rotation += 0.05;
		
		this.moon.x = moonLastPosX - (game.time.physicsElapsed / this.body.velocity.x) + (game.time.physicsElapsed / (orbitVelocity * (distanceY / distance)));
		this.moon.y = moonLastPosY + (game.time.physicsElapsed / (orbitVelocity * (distanceX / distance)));
		
		moonLastPosX = this.moon.body.x;
		moonLastPosY = this.moon.body.y;
		
	}
	
}
