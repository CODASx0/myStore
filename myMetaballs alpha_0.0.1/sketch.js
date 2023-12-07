var elem = document.getElementById('myElement');
//设置精度
let dpr = 14;

//设置显示模式
let displayMode = 0;

//设置全局阈值，相当于统一调整半径，非必要不调整
let lim = 1.2;

//设置圆的属性
let putMode = 0;

//设置鼠标滚轮初始值
let mouseWheelValue = 20;
let mouseWheelValueTarget = 20;


//初始化画布的宽、高、图层数量
let xNum = 0;
let yNum = 0;
let zNum = 8;//初始化得到一个图层数量上限
let circleLim = new Array(zNum);

//初始化不同图层上的圆
circleArray = new Array(zNum);
for (z = 0; z < zNum; z++) {
	circleArray[z] = new Array();
}

//定义画布
let canvas;


function hideMouseCursor() {
	var elem = document.body; //获取页面body元素
	elem.style.cursor = 'none'; //隐藏鼠标指针
}


//定义悬浮触控的输入点
let touchInputX;
let touchInputY;

function touchInput() {
	if (detections != undefined) {
		if (detections.multiHandLandmarks != undefined) {
			for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
				touchInputX = width - detections.multiHandLandmarks[i][8].x * width;
				touchInputY = detections.multiHandLandmarks[i][8].y * height;
				//console.log(touchInputX, touchInputY);
				//console.log(detections.multiHandLandmarks[0][8].x, detections.multiHandLandmarks[0][8].y);
			}
		}
	}
	/*
	touchInputX = mouseX;
	touchInputY = mouseY;
	*/
}

class VideoInterface {
	constructor(speed) {
		this.nowPosX = width / 2;
		this.nowPosY = height / 2;

		this.nowRadius = 1;
		this.speed = speed;

		this.thumbFingerX = width / 2;
		this.thumbFingerY = height / 2;
		this.thumbFingerTargetX = width / 2;
		this.thumbFingerTargetY = height / 2;
		this.indexFingerX = width / 2;
		this.indexFingerY = height / 2;
		this.indexFingerTargetX = width / 2;
		this.indexFingerTargetY = height / 2;
		//其他手指
		this.middleFingerX = width / 2;
		this.middleFingerY = height / 2;
		this.middleFingerTargetX = width / 2;
		this.middleFingerTargetY = height / 2;
		this.ringFingerX = width / 2;
		this.ringFingerY = height / 2;
		this.ringFingerTargetX = width / 2;
		this.ringFingerTargetY = height / 2;
		this.pinkyX = width / 2;
		this.pinkyY = height / 2;
		this.pinkyTargetX = width / 2;
		this.pinkyTargetY = height / 2;
	}
	update() {
		if (detections != undefined) {
			if (detections.multiHandLandmarks != undefined) {
				for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
					this.indexFingerTargetX = width - detections.multiHandLandmarks[i][8].x * width;
					this.indexFingerTargetY = detections.multiHandLandmarks[i][8].y * height;
					this.thumbFingerTargetX = width - detections.multiHandLandmarks[i][4].x * width;
					this.thumbFingerTargetY = detections.multiHandLandmarks[i][4].y * height;



					this.indexFingerX += (this.indexFingerTargetX - this.indexFingerX) * this.speed;
					this.indexFingerY += (this.indexFingerTargetY - this.indexFingerY) * this.speed;
					this.thumbFingerX += (this.thumbFingerTargetX - this.thumbFingerX) * this.speed;
					this.thumbFingerY += (this.thumbFingerTargetY - this.thumbFingerY) * this.speed;

					this.nowPosX = (this.indexFingerX + this.thumbFingerX) * 0.5;
					this.nowPosY = (this.indexFingerY + this.thumbFingerY) * 0.5;
					this.nowRadius = sqrt(sq(this.indexFingerX - this.thumbFingerX) + sq(this.indexFingerY - this.thumbFingerY));

					//console.log(touchInputX, touchInputY);
					//console.log(detections.multiHandLandmarks[0][8].x, detections.multiHandLandmarks[0][8].y);
					this.middleFingerTargetX = width - detections.multiHandLandmarks[i][12].x * width;
					this.middleFingerTargetY = detections.multiHandLandmarks[i][12].y * height;
					this.middleFingerX += (this.middleFingerTargetX - this.middleFingerX) * this.speed;
					this.middleFingerY += (this.middleFingerTargetY - this.middleFingerY) * this.speed;
					this.pinkyTargetX = width - detections.multiHandLandmarks[i][20].x * width;
					this.pinkyTargetY = detections.multiHandLandmarks[i][20].y * height;
					this.pinkyX += (this.pinkyTargetX - this.pinkyX) * this.speed;
					this.pinkyY += (this.pinkyTargetY - this.pinkyY) * this.speed;
					this.ringFingerTargetX = width - detections.multiHandLandmarks[i][16].x * width;
					this.ringFingerTargetY = detections.multiHandLandmarks[i][16].y * height;
					this.ringFingerX += (this.ringFingerTargetX - this.ringFingerX) * this.speed;
					this.ringFingerY += (this.ringFingerTargetY - this.ringFingerY) * this.speed;
				}
			}
		}

	}
}

//定义类：画在上面的圆
class circleDraw {

	constructor(stability, posX, posY, radius, speed, moveRadius) {

		this.inputX = posX;
		this.inputY = posY;
		this.inputR = radius;
		this.inputMR = moveRadius;
		this.x = posX;
		this.y = posY;
		this.r = radius;
		this.s = speed;
		this.mr = moveRadius;
		this.stability = stability;
	}
	normalUpdate(targetX, targetY) {
		if (this.stability == 0) {
			let scaleDis = sqrt(sq(this.x - targetX) + sq(this.y - targetY)) * 0.001;
			this.r = this.inputR * (-scaleDis * 1.2 + 1);
			this.mr = this.inputMR * (scaleDis + 1);
			this.inputX += (targetX - this.inputX) * this.s;
			this.inputY += (targetY - this.inputY) * this.s;
			this.x = this.inputX + Math.cos(frameCount * this.s * 0.28) * this.mr;
			this.y = this.inputY + Math.sin(frameCount * this.s * 0.2) * this.mr;
		} else if (this.stability == 0.5) {
			let scaleDis = sqrt(sq(this.x - targetX) + sq(this.y - targetY)) * 0.001;
			this.r = this.inputR * (-scaleDis * 0.1 + 1);
			this.mr = this.inputMR * (scaleDis + 1);

			this.x = this.inputX + Math.cos(frameCount * this.s * 0.28) * this.mr;
			this.y = this.inputY + Math.sin(frameCount * this.s * 0.2) * this.mr;
		}
	}
	radiusUpdate(radiusValue) {
		this.inputR = radiusValue;
	}

}

//把点阵上的数值计算后视觉化呈现出来
function drawSketchPoint(W, H, Z) {
	for (let z = 0; z < Z; z++) {

		//把第 Z 类圆形的数值叠加后计算出来
		for (let i = 0; i < W + 1; i++) {
			for (let j = 0; j < H + 1; j++) {
				//储存到圆心距离的倒数

				inputValue[i][j][z] = circleArray[z][0].r / sqrt(sq(circleArray[z][0].x - i * dpr) + sq(circleArray[z][0].y - j * dpr));
				for (let n = 1; n < circleArray[z].length; n++) {
					let dt = circleArray[z][n].r / sqrt(sq(circleArray[z][n].x - i * dpr) + sq(circleArray[z][n].y - j * dpr));
					inputValue[i][j][z] += dt * dt * dt;
				}
			}
		}


		if (z == 0) {
			for (let i = 0; i < W; i++) {
				for (let j = 0; j < H; j++) {
					var nw = inputValue[i][j][z];
					var ne = inputValue[i + 1][j][z];
					var se = inputValue[i + 1][j + 1][z];
					var sw = inputValue[i][j + 1][z];
					var a = [i * dpr + dpr * myLerp(lim * circleLim[z], nw, ne), j * dpr];
					var b = [
						i * dpr + dpr,
						j * dpr + dpr * myLerp(lim * circleLim[z], ne, se)
					];
					var c = [
						i * dpr + dpr * myLerp(lim * circleLim[z], sw, se),
						j * dpr + dpr
					];
					var d = [i * dpr, j * dpr + dpr * myLerp(lim * circleLim[z], nw, sw)];

					gridValue[i][j][z] = binaryToType(
						inputValue[i][j][z] > lim * circleLim[z],
						inputValue[i + 1][j][z] > lim * circleLim[z],
						inputValue[i + 1][j + 1][z] > lim * circleLim[z],
						inputValue[i][j + 1][z] > lim * circleLim[z]
					)


					noStroke();
					//stroke(250);
					strokeWeight(3);
					//noFill();
					fill(246, 243, 243, 255);
					//绘制 Metaballs

					switch (gridValue[i][j][z]) {
						case 1:
						case 14:
							if (inputValue[i][j + 1][z] > lim * circleLim[z]) {
								triangle(d[0], d[1], c[0], c[1], d[0], c[1]);
							} else {
								beginShape();
								vertex(d[0], d[1]);
								vertex(c[0], c[1]);
								vertex(b[0], c[1]);
								vertex(b[0], a[1]);
								vertex(d[0], a[1]);
								endShape(CLOSE);
							}
							break;
						case 2:
						case 13:
							if (inputValue[i + 1][j + 1][z] > lim * circleLim[z]) {
								triangle(b[0], b[1], c[0], c[1], b[0], c[1])
							} else {
								beginShape();
								vertex(b[0], b[1]);
								vertex(c[0], c[1]);
								vertex(d[0], c[1]);
								vertex(d[0], a[1]);
								vertex(b[0], a[1]);
								endShape(CLOSE);
							}
							break;
						case 3:
						case 12:
							if (inputValue[i][j][z] > lim * circleLim[z]) {
								beginShape();
								vertex(d[0], a[1]);
								vertex(b[0], a[1]);
								vertex(b[0], b[1]);
								vertex(d[0], d[1]);
								endShape(CLOSE);
							} else {
								beginShape();
								vertex(d[0], c[1]);
								vertex(b[0], c[1]);
								vertex(b[0], b[1]);
								vertex(d[0], d[1]);
								endShape(CLOSE);
							}
							break;
						case 11:
						case 4:
							if (inputValue[i + 1][j][z] > lim * circleLim[z]) {
								triangle(a[0], a[1], b[0], b[1], b[0], a[1]);
							} else {
								beginShape();
								vertex(a[0], a[1]);
								vertex(b[0], b[1]);
								vertex(b[0], c[1]);
								vertex(d[0], c[1]);
								vertex(d[0], a[1]);
								endShape(CLOSE);
							}
							break;
						case 5:
							if (inputValue[i][j][z] > lim * circleLim[z]) {
								beginShape(TRIANGLES);
								vertex(d[0], a[1]);
								vertex(a[0], a[1]);
								vertex(d[0], d[1]);
								vertex(b[0], b[1]);
								vertex(c[0], c[1]);
								vertex(b[0], c[1]);
								endShape();
							} else {
								beginShape();
								vertex(d[0], d[1]);
								vertex(a[0], a[1]);
								vertex(b[0], a[1]);
								vertex(b[0], b[1]);
								vertex(c[0], c[1]);
								vertex(d[0], c[1]);
								endShape(CLOSE);
							}
							break;
						case 6:
						case 9:
							if (inputValue[i][j][z] > lim * circleLim[z]) {
								beginShape();
								vertex(d[0], a[1]);
								vertex(a[0], a[1]);
								vertex(c[0], c[1]);
								vertex(d[0], c[1]);
								endShape(CLOSE);
							} else {
								beginShape();
								vertex(b[0], a[1]);
								vertex(a[0], a[1]);
								vertex(c[0], c[1]);
								vertex(b[0], c[1]);
								endShape(CLOSE);
							}
							break;
						case 7:
						case 8:
							if (inputValue[i][j][z] > lim * circleLim[z]) {
								triangle(d[0], a[1], a[0], a[1], d[0], d[1]);
							} else {
								beginShape();
								vertex(d[0], d[1]);
								vertex(a[0], a[1]);
								vertex(b[0], a[1]);
								vertex(b[0], c[1]);
								vertex(d[0], c[1]);
								endShape(CLOSE);
							}
							break;
						case 10:
							if (inputValue[i][j][z] > lim * circleLim[z]) {
								beginShape();
								vertex(d[0], a[1]);
								vertex(a[0], a[1]);
								vertex(b[0], b[1]);
								vertex(b[0], c[1]);
								vertex(c[0], c[1]);
								vertex(d[0], d[1]);
								endShape(CLOSE);
							} else {
								beginShape(TRIANGLES);
								vertex(a[0], a[1]);
								vertex(b[0], b[1]);
								vertex(b[0], a[1]);
								vertex(d[0], c[1]);
								vertex(d[0], c[1]);
								endShape();
							}
							break;
						case 15:
							rect(d[0], a[1], dpr, dpr);
						default:
							break;
					}

					if (displayMode == 1) {
						stroke(240, 240, 240);
						switch (gridValue[i][j][z]) {
							case 1:
							case 14:
								line(d[0], d[1], c[0], c[1]);
								break;
							case 2:
							case 13:
								line(b[0], b[1], c[0], c[1]);
								break;
							case 3:
							case 12:
								line(d[0], d[1], b[0], b[1]);
								break;
							case 11:
							case 4:
								line(a[0], a[1], b[0], b[1]);
								break;
							case 5:
								line(d[0], d[1], a[0], a[1]);
								line(c[0], c[1], b[0], b[1]);
								break;
							case 6:
							case 9:
								line(c[0], c[1], a[0], a[1]);
								break;
							case 7:
							case 8:
								line(d[0], d[1], a[0], a[1]);
								break;
							case 10:
								line(a[0], a[1], b[0], b[1]);
								line(c[0], c[1], d[0], d[1]);
								break;
							case 15:
							default:
								break;
						}
					}

				}
			}
		} else if (z == 1) {
			noFill();
			for (n = 1; n < circleArray[z].length; n++) {
				stroke(0, 0, 0, 20);
				fill(255, 100);
				ellipse(circleArray[z][n].x, circleArray[z][n].y, circleArray[z][n].r / (lim * circleLim[z]), circleArray[z][n].r / (lim * circleLim[z]))
			}
			stroke("#ECCCCC");
			fill(255, 200);
			ellipse(circleArray[z][0].x, circleArray[z][0].y, circleArray[z][0].r / (lim * circleLim[z]), circleArray[z][0].r / (lim * circleLim[z]))
		}
	}
}

//鼠标滚轮事件
function mouseWheel(event) {
	mouseWheelValueTarget += -event.delta * 0.2;
	if (mouseWheelValueTarget < 20) {
		mouseWheelValueTarget = 20;
	} else if (mouseWheelValueTarget > 200) {
		mouseWheelValueTarget = 200;
	}

}
//鼠标滚轮数值平滑
function mouseWheelValueSmooth(value) {
	mouseWheelValue += (mouseWheelValueTarget - mouseWheelValue) * value;
}

//鼠标点击事件
function mouseClicked() {
	let randomValue = 0.2 * random(0.1, 1)
	circleArray[0][circleArray[0].length] = new circleDraw(putMode, mouseX, mouseY, mouseWheelValue * 0.6 + 25, randomValue, random(1, 10));
	circleArray[1][circleArray[1].length] = new circleDraw(putMode, mouseX, mouseY, mouseWheelValue, randomValue, random(1, 5));
}


function myLerp(x, x0, x1, y0 = 0, y1 = 1) {
	if (x0 === x1) {
		return null;
	}

	return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function binaryToType(nw, ne, se, sw) {
	a = [nw, ne, se, sw];
	return a.reduce((res, x) => (res << 1) | x);
}

//初始化视频接口
let videoInterface;

//初始化画布
function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	touchInputX = width / 2;
	touchInputY = height / 2;
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;
	videoInterface = new VideoInterface(0.05);

	circleLim[0] = 2;
	circleLim[1] = 1;
	circleLim[2] = 2;

	//circleArray[][](stability, posX, posY, radius, speed, moveRadius) 
	circleArray[0][0] = new circleDraw(0, width * 0.65, height * 0.5, 50, 0.15, 0);
	circleArray[0][1] = new circleDraw(0, width * 0.65, height * 0.5, 50, 0.23, 0);
	circleArray[0][2] = new circleDraw(0, width * 0.65, height * 0.5, 40, 0.18, 0);
	circleArray[0][3] = new circleDraw(0, width * 0.65, height * 0.5, 36, 0.15, 0);
	//circleArray[0][3] = new circleDraw(0, width * 0.65, height * 0.5, 34, 0.1, 0);


	circleArray[1][0] = new circleDraw(0, width * 0.35, height * 0.5, 30, 1, 0);


}


function draw() {
	//隐藏鼠标指针
	//hideMouseCursor();

	//更新视频接口
	videoInterface.update();

	//动态响应
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;
	zNum = 2;//限定显示的图层数量
	//let circleLim = new Array(zNum);

	//动态初始化三维数组
	inputValue = new Array(xNum + 1);
	gridValue = new Array(xNum + 1);
	for (let i = 0; i <= xNum; i++) {
		inputValue[i] = new Array(yNum + 1);
		gridValue[i] = new Array(yNum + 1);
		for (let j = 0; j <= yNum; j++) {
			inputValue[i][j] = new Array(zNum);
			gridValue[i][j] = new Array(zNum);
		}
	}
	background(255);
	//touchInput();

	//鼠标滚轮平滑
	mouseWheelValueSmooth(0.1);

	//暂时这样
	//circleArray[0][0].radiusUpdate(videoInterface.nowRadius + 20);
	circleArray[1][0].radiusUpdate(videoInterface.nowRadius);

	//更新圆的属性
	circleArray[0][0].normalUpdate(videoInterface.thumbFingerTargetX, videoInterface.thumbFingerTargetY);
	circleArray[0][1].normalUpdate(videoInterface.indexFingerTargetX, videoInterface.indexFingerTargetY);
	circleArray[0][2].normalUpdate(videoInterface.middleFingerTargetX, videoInterface.middleFingerTargetY);
	circleArray[0][3].normalUpdate(videoInterface.ringFingerTargetX, videoInterface.ringFingerTargetY);
	//circleArray[0][3].normalUpdate(videoInterface.pinkyTargetX, videoInterface.pinkyTargetY);
	for (j = 4; j < circleArray[0].length; j++) {
		circleArray[0][j].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY);
	}
	for (i = 1; i < zNum; i++) {
		for (j = 0; j < circleArray[i].length; j++) {
			//circleArray[i][j].normalUpdate(mouseX, mouseY);
			circleArray[i][j].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY);
		}
	}
	//circleLim[0] += (-circleLim[0] + 0.2 * circleArray[0].length ) * 0.06;

	if (keyIsPressed === true) {
		putMode = 0;
	} else {
		putMode = 1;
	}
	//削减数列长度
	deleteArray(40);

	drawSketchPoint(xNum, yNum, zNum);

}

//删减数列
//-----待修改-----未排除[0][x]开头的元素
function deleteArray(num) {
	if (circleArray[0].length > num) {
		for (z = 0; z < zNum; z++) {
			for (i = 0; i < circleArray[z].length - 2; i++) {
				circleArray[z][i + 1] = circleArray[z][i + 2];
			}
			circleArray[z].length--;
		}
	}
}


function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function myDelay(targetValue, startTime, currentTime) {

}

