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

//把点阵上的数值计算后视觉化呈现出来
function drawSketchPoint(W, H) {
	//把第一类圆形的数值叠加后计算出来
	for (let n = 0; n < circle0.length; n++) {
		for (let i = 0; i < W; i++) {
			for (let j = 0; j < H; j++) {

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