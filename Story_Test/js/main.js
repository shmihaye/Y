var game = new Phaser.Game(800, 600, Phaser.AUTO, 'StoryTEST');

// library of all text for a given "chapter"
 DiaA = "pick ME!!!"
 DiaB = "don't pick me!"
 DiaC = "Praise the Sun!"

 DiaA1 = "\nGJ"
 DiaA2 = "\nNo problem son"
 DiaA3 = "\nuuuhhhh"

 DiaB1 = "\nI'm so sorry"
 DiaB2 = "\nBuck up son welcome to space"
 DiaB3 = "\n........"

 DiaC1 = "\nHEY, U HOLLOW LOOKING ASS MOTHE..."
 DiaC2 = "\nPraise the Sun..."
 DiaC3 = "\nGo play hunipop you dirty casual"

choice1 = DiaA
choice2 = DiaB
choice3 = DiaC

Acount= 1
Bcount= 1
Ccount= 1

var unselected_color = "#F0F8FF"
var selected_color = "#00CED1"


var narratvieState = {
	
	preload: function() {
		
		game.load.path = 'assets/img/'
		game.load.image('space', 'space.png')
	},

	create: function() {
	
		BG = game.add.sprite(0, 0, 'space');
		slot1 = game.add.text(0, 0, choice1, { font: "32px Source Sans Pro", fill: unselected_color, align: "left" })
		slot2 = game.add.text(0, 0, choice2, { font: "32px Source Sans Pro", fill: unselected_color, align: "left" })
	 	slot3 = game.add.text(0, 0, choice3, { font: "32px Source Sans Pro", fill: unselected_color, align: "left" })
    

    	slot1.inputEnabled = true
    	slot2.inputEnabled = true
    	slot3.inputEnabled = true
   

//  	slot1.input.enableDrag()  
//  	slot2.input.enableDrag()
//  	slot3.input.enableDrag()


		slot1.events.onInputOver.add(this.color_change, slot1)
  		slot1.events.onInputOut.add(this.color_revert, slot1)
 		slot1.events.onInputDown.add(this.nextDia1, slot1)

    	slot2.events.onInputOver.add(this.color_change, slot2)
  		slot2.events.onInputOut.add(this.color_revert, slot2)
		slot2.events.onInputDown.add(this.nextDia2, slot2)


    	slot3.events.onInputOver.add(this.color_change, slot3)
  		slot3.events.onInputOut.add(this.color_revert, slot3)
  		slot3.events.onInputDown.add(this.nextDia3, slot3)
	},
	
	update: function() {
	slot2.y = (Acount*36)+12
	slot3.y = ((Acount+Bcount)*36)+24

	if (Acount+Bcount+Ccount >= 9){
		slot1.inputEnabled = false
		slot2.inputEnabled = false 
		slot3.inputEnabled = false
	}

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
};

game.state.add('narratvieState', narratvieState);
game.state.start('narratvieState');