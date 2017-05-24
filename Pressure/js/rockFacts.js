var rockVelocity = -30;

function getDistance(object1, object2) {
		
	// Calculate distances.
	let distanceX = object1.x - object2.x;
	let distanceY = object1.y - object2.y;
	let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		
	return distance;
		
}

function isSpecialRock(rock) {
	
	if (rock.constructor.name == 'GravRock' || rock.constructor.name == 'BombRock' || rock.constructor.name == 'FragRock') { return true; } // Keep updating this line with new rock types
	
	else { return false; }
	
}
