
var P3 = {

	create: function() {

		// library of all text for a given "chapter"
		 DiaA = "I miss the sun, boss. I miss lyin’ on my back in the cornfields back home, just takin’ in th’ warmth"
		 DiaB = "I never went t’ college...I went out partyin’ an’ drinkin’ "
		 DiaC = "Durin’ the years after, I landed a job at the Missouri port, I was still afraid."
		
		 DiaA1 = " The stars just remind me of what I’m missing: home. But I can’t go back."
		 DiaA2 = " But I can’t go back. I need to prove that I can handle livin’ on my own."
		 DiaA3 = " I need to prove that I can… that I can handle it this time."
		
		 DiaB1 = " Soon I found myself out of friends and out of money"
		 DiaB2 = " I was alone an’ fighting addiction...So scared..."
		 DiaB3 = " My parents could hardly look at me, but they helped me."
		
		 DiaC1 = " Afraid that one mistake, one misstep, one sip… would send me back into oblivion."
		 DiaC2 = " So I left it behind. Thought maybe I could catch a break out here in space."
		 DiaC3 = " But when I look out there, I can’t think of anything else. "
		
		choice1 = DiaA
		choice2 = DiaB
		choice3 = DiaC
		
		Acount= 1
		Bcount= 1
		Ccount= 1
		
		this.background = game.add.tileSprite(0, 0, game.width, game.height, 'spaceBackground');
		BG = game.add.sprite(0, 0, 'room1Background');
		
		// Add character sprite
		game.add.sprite(275, 301, 'patricia3');
		
		// Create energy bar
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		energyBar.fixedToCamera = true;
		
		slot1 = game.add.text(0, 0, choice1, { font: "26px Source Sans Pro", fill: unselected_color, align: "left",  wordWrap: true,wordWrapWidth: 800})
		slot2 = game.add.text(0, 0, choice2, { font: "26px Source Sans Pro", fill: unselected_color, align: "left",  wordWrap: true,wordWrapWidth: 800})
	 	slot3 = game.add.text(0, 0, choice3, { font: "26px Source Sans Pro", fill: unselected_color, align: "left", wordWrap: true,wordWrapWidth: 800 })

    	exitSign = game.add.text(375,500, 'exit', {font: "32px Source Sans Pro", fill: '#8B0000', align: "left" })

    	slot1.inputEnabled = true
    	slot2.inputEnabled = true
    	slot3.inputEnabled = true
   		exitSign.inputEnabled = false

//  	slot1.input.enableDrag()  
//  	slot2.input.enableDrag()
//  	slot3.input.enableDrag()


   		slot1.stroke = '#000000';
    	slot1.strokeThickness = 6;
		slot1.events.onInputOver.add(this.color_change, slot1)
  		slot1.events.onInputOut.add(this.color_revert, slot1)
 		slot1.events.onInputDown.add(this.nextDia1, slot1)
   		

   		slot2.stroke = '#000000';
    	slot2.strokeThickness = 6;
    	slot2.events.onInputOver.add(this.color_change, slot2)
  		slot2.events.onInputOut.add(this.color_revert, slot2)
		slot2.events.onInputDown.add(this.nextDia2, slot2)

   		slot3.stroke = '#000000';
    	slot3.strokeThickness = 6;
    	slot3.events.onInputOver.add(this.color_change, slot3)
  		slot3.events.onInputOut.add(this.color_revert, slot3)
  		slot3.events.onInputDown.add(this.nextDia3, slot3)

		exitSign.events.onInputOver.add(this.color_change, exitSign)
  		exitSign.events.onInputOut.add(this.color_revert, exitSign)
  		exitSign.events.onInputDown.add(this.moveon, exitSign)


	},
	
	update: function() {
		slot2.y = (Acount*36)+36
		slot3.y = ((Acount+Bcount)*36)+48

		if (Acount+Bcount+Ccount >= 9){
			slot1.inputEnabled = false
			slot2.inputEnabled = false 
			slot3.inputEnabled = false
//		slot1.fill = done_color
//		slot2.fill = done_color
//		slot3.fill = done_color
			exitSign.inputEnabled = true

		}
		
		// Update energy bar scaling
		if(energy < 0) energy = 0;
		else if(energy < 100) energy += energyRegen;
		energyBar.scale.x = energy/30;
		
		// Scroll background slowly
		this.background.tilePosition.x -= 2;
	},
		
	
	color_change: function(item) {
		item.fill = selected_color
	},
	
	color_revert: function(item) {
		item.fill = unselected_color
		
	},
//	nextDia1: (item) => {
	nextDia1: function(item) {

		console.log('A')

		if (Acount == 3){
			item.text = item.text.concat(DiaA3)
		}


		if (Acount == 2){
			item.text = item.text.concat(DiaA2)
		}


		if (Acount == 1){
			item.text = item.text.concat(DiaA1)
		}
		if (Acount <4) {
			Acount+=1
		}

	},

	nextDia2: function(item) {

		console.log('B')


		if (Bcount == 3){
			item.text = item.text.concat(DiaB3)
		}


		if (Bcount == 2){
			item.text = item.text.concat(DiaB2)
		}


		if (Bcount == 1){
			item.text = item.text.concat(DiaB1)
		}

		if (Bcount <4){
			Bcount+=1
		}
	},

	nextDia3: function(item) {
		console.log('C')


		if (Ccount == 3){
			item.text =  item.text.concat(DiaC3)
		}

		if (Ccount == 2){
			item.text =  item.text.concat(DiaC2)
		}

		if (Ccount == 1){
			item.text = item.text.concat(DiaC1)
		}

		if (Ccount <4){
			Ccount+=1
		}

	},

	moveon: function(item){
		hallStart = 0;
		game.state.start('Hallway');


	}
};