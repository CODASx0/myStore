let dpr = 4;

let circle0 = [];//画布上出现的第一类圆型



function setup() {
	createCanvas(400, 400);

	let xNum = parseInt(width / dpr);
	let yNum = parseInt(height / dpr);

	let pointVolume = [];

	circle0[0] =new circleDraw(200, 200, 20);
	

}

function draw() {
	background(20, 20, 20);
	drawSketchPoint();

}



function drawSketchPoint() {
	for (let i = 0; i < xNum; i++) {
		for (let j = 0; j < yNum; j++) {
			for (let n = 0; n < circle0.length; n++){
				
			}
		}
	}
}

class circleDraw{ 
	constructor(posX, posY, radius) {
		this.x = posX;
		this.y = posY;
		this.r = radius;
	}
}