
function FragRock(game, image) {
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	this.canBreak = false;
	
	// Resize hitbox
	this.body.setSize(30, 30, 17, 17);
}

FragRock.prototype = Object.create(Phaser.Sprite.prototype);

FragRock.prototype.constructor = FragRock;

FragRock.prototype.update = function(){
	if(this.primedCooldown == 0) this.primed = true;
	else if(this.primedCooldown > 0) this.primedCooldown--;
}

FragRock.prototype.die = function(){
	if(this.canBreak){
		var fragment1 = {type:"FragRock2", x:this.x, y:this.y, scale:this.scale.x, primedCooldown:20, xvel:-300, yvel:30, canBreak:false};
		var fragment2 = {type:"FragRock3", x:this.x, y:this.y, scale:this.scale.x, primedCooldown:20, xvel:300, yvel:30, canBreak:false};
		var fragment3 = {type:"FragRock4", x:this.x, y:this.y, scale:this.scale.x, primedCooldown:20, xvel:0, yvel:-200, canBreak:false};
		addObstacles.push(fragment1);
		addObstacles.push(fragment2);
		addObstacles.push(fragment3);
	}
	this.kill();
}
