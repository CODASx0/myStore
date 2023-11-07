//设置精度
let dpr = 4;
//画布上出现的第一类圆型
let circle0 = [];
//初始化几个后面会用到的参数
let xNum = 0;
let yNum = 0;
//屏幕上显示的点阵
let pointVolume = [];

//定义类：画在上面的圆
class circleDraw {
	constructor(posX, posY, radius) {
		this.x = posX;
		this.y = posY;
		this.r = radius;
	}
}

//在屏幕上把点阵画出来
function drawSketchPoint(x, y) {
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			for (let n = 0; n < circle0.length; n++) {

			}
		}
	}
}

function setup() {
	createCanvas(400, 400);
	xNum = parseInt(width / dpr);
	yNum = parseInt(height / dpr);

	circle0[0] = new circleDraw(200, 200, 20);

}

function draw() {
	background(20, 20, 20);
	drawSketchPoint(xNum, yNum);

}