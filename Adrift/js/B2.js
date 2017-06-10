
var B2 = {

	create: function() {

		// library of all text for a given "chapter"
		 DiaA = "Hey Captain, how goes the bootcamping?"
		 DiaB = "I want to be clear, I’m not trying to take your job."
		 DiaC = "Leading and giving directions is in my very nature."
		
		 DiaA1 = " I told you this would be difficult."
		 DiaA2 = " Buggering off into deep space with this crew?"
		 DiaA3 = " Here’s hoping we don’t croak before they get their shit together."
		
		 DiaB1 = " I just… well I have a habit of telling people off."
		 DiaB2 = " I’m not used to working without people to manage."
		 DiaB3 = " I feel like my potential is being...not wasted, but diminished."
		
		 DiaC1 = " I'm not getting any younger. That’s clear to me."
		 DiaC2 = " I don’t want to give up what I believe is my strongest quality."
		 DiaC3 = " But at the same time, I don’t want to intrude on your authority, captain."
		
		choice1 = DiaA
		choice2 = DiaB
		choice3 = DiaC
		
		Acount= 1
		Bcount= 1
		Ccount= 1

		this.background = game.add.tileSprite(0, 0, game.width, game.height, 'spaceBackground');
		BG = game.add.sprite(0, 0, 'room2Background');
		
		// Add character sprite
		game.add.sprite(89, 182, 'bridget2');
		
		// Create energy bar
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		energyBar.fixedToCamera = true;
		
		slot1 = game.add.text(0, 0, choice1, { font: "32px Source Sans Pro", fill: bridrestclr, align: "left",  wordWrap: true,wordWrapWidth: 800})
		slot2 = game.add.text(0, 0, choice2, { font: "32px Source Sans Pro", fill: bridrestclr, align: "left",  wordWrap: true,wordWrapWidth: 800})
	 	slot3 = game.add.text(0, 0, choice3, { font: "32px Source Sans Pro", fill: bridrestclr, align: "left", wordWrap: true,wordWrapWidth: 800 })

    	exitSign = game.add.text(375,500, '', {font: "32px Source Sans Pro", fill: '#8B0000', align: "left" })

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

   		exitSign.stroke = '#000000';
    	exitSign.strokeThickness = 6;
		exitSign.events.onInputOver.add(this.color_change, exitSign)
  		exitSign.events.onInputOut.add(this.color_revert, exitSign)
  		exitSign.events.onInputDown.add(this.moveon, exitSign)



	},
	
	update: function() {
		slot2.y = (Acount*42)+12
		slot3.y = ((Acount+Bcount)*42)+24

		if (Acount+Bcount+Ccount >= 9){
			slot1.inputEnabled = false
			slot2.inputEnabled = false 
			slot3.inputEnabled = false
//		slot1.fill = done_color
//		slot2.fill = done_color
//		slot3.fill = done_color
			exitSign.text = 'Exit'
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
		item.fill = bridhoverclr
	},
	
	color_revert: function(item) {
		item.fill = bridrestclr
		
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
		
		game.state.start('Hallway');


	}
};