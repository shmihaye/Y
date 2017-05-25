var rockVelocity = -30;

function getDistance(object1, object2) {
		
	// Calculate distances.
	let distanceX = object1.body.x - object2.body.x;
	let distanceY = object1.body.y - object2.body.y;
	let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		
	return distance;
		
}

function isSpecialRock(rock) {
	
	// Keep updating the list of special rocks below.
	if (rock.constructor.name === 'GravRock' || rock.constructor.name === 'BombRock' || rock.constructor.name === 'FragRock') { return true; }
	
	if (rock.constructor.name === 'OrbitRock') { return true; }
	
	// Toxic rock should collide just like normal rocks.
	if (rock.constructor.name === 'ToxicRock') { return false; }
	
	else { return false; }
	
}
