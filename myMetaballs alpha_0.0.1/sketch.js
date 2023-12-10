var elem = document.getElementById('myElement');
//设置精度
let dpr = 16;

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
					this.nowRadius = sqrt(sq(this.indexFingerX - this.thumbFingerX) + sq(this.indexFingerY - this.thumbFingerY)) * 0.5;

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
/*
function mouseClicked() {
	let randomValue = 0.2 * random(0.1, 1)
	circleArray[0][circleArray[0].length] = new circleDraw(putMode, mouseX, mouseY, mouseWheelValue * 0.6 + 25, randomValue, random(1, 10));
	circleArray[1][circleArray[1].length] = new circleDraw(putMode, mouseX, mouseY, mouseWheelValue, randomValue, random(1, 5));
}
*/


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
	canvas.id("canvas");
	touchInputX = width / 2;
	touchInputY = height / 2;
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;
	videoInterface = new VideoInterface(0.1);

	circleLim[0] = 1;
	circleLim[1] = 0.6;
	circleLim[2] = 2;

	//circleArray[][](stability, posX, posY, radius, speed, moveRadius) 
	circleArray[0][0] = new circleDraw(0, width * 0.65, height * 0.5, 60, 0.15, 0);
	circleArray[0][1] = new circleDraw(0, width * 0.65, height * 0.5, 50, 0.23, 0);
	circleArray[0][2] = new circleDraw(0, width * 0.65, height * 0.5, 40, 0.18, 0);
	circleArray[0][3] = new circleDraw(0, width * 0.65, height * 0.5, 36, 0.15, 0);
	circleArray[0][4] = new circleDraw(0, width * 0.65, height * 0.5, 50, 0.8, 0);
	//circleArray[0][3] = new circleDraw(0, width * 0.65, height * 0.5, 34, 0.1, 0);


	circleArray[1][0] = new circleDraw(0, width * 0.35, height * 0.5, 30, 0.8, 0);


}


function draw() {
	//隐藏鼠标指针
	//hideMouseCursor();
	clear();

	displayMode = 0;
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
	//background(255);
	//touchInput();

	//鼠标滚轮平滑
	mouseWheelValueSmooth(0.1);

	//暂时这样
	circleArray[0][4].radiusUpdate(videoInterface.nowRadius );
	circleArray[1][0].radiusUpdate(videoInterface.nowRadius);

	//更新圆的属性
	circleArray[0][0].normalUpdate(videoInterface.thumbFingerTargetX, videoInterface.thumbFingerTargetY);
	circleArray[0][1].normalUpdate(videoInterface.indexFingerTargetX, videoInterface.indexFingerTargetY);
	circleArray[0][2].normalUpdate(videoInterface.middleFingerTargetX, videoInterface.middleFingerTargetY);
	circleArray[0][3].normalUpdate(videoInterface.ringFingerTargetX, videoInterface.ringFingerTargetY);
	circleArray[0][4].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY)
	//类似于指示器
	circleArray[1][0].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY);
	//circleArray[0][3].normalUpdate(videoInterface.pinkyTargetX, videoInterface.pinkyTargetY);
	for (j = 4; j < circleArray[0].length; j++) {
		circleArray[0][j].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY);
	}
	for (i = 1; i < zNum; i++) {
		for (j = 1; j < circleArray[i].length; j++) {
			//circleArray[i][j].normalUpdate(mouseX, mouseY);
			circleArray[i][j].normalUpdate(videoInterface.nowPosX, videoInterface.nowPosY);
		}
	}
	//circleLim[0] += (-circleLim[0] + 0.2 * circleArray[0].length ) * 0.06;

	/*
	if (keyIsPressed === true) {
		putMode = 0;
	} else {
		putMode = 1;
	}
	*/
	putMode = 1;
	//削减数列长度
	deleteArray(40);

	drawSketchPoint(xNum, yNum, zNum);

}

//删减数列
//排除[0][x]开头的元素
function deleteArray(num) {
	if (circleArray[0].length > num) {
		//忘记为什么是从 3 开始了，毁灭吧，这个代码写的和💩一样，记住就行了
		for (i = 4; i < circleArray[0].length - 2; i++) {
			circleArray[0][i + 1] = circleArray[0][i + 2];
		}
		circleArray[0].length--;
		for (z = 1; z < zNum; z++) {
			for (i = 0; i < circleArray[z].length - 2; i++) {
				circleArray[z][i + 1] = circleArray[z][i + 2];
			}
			circleArray[z].length--;
		}
	}
}


function keyPressed() {
	if (keyCode === TAB || keyCode === RETURN) {
		let randomValue = 0.2 * random(0.1, 1)
		circleArray[0][circleArray[0].length] = new circleDraw(putMode, videoInterface.nowPosX, videoInterface.nowPosY, videoInterface.nowRadius * 0.6 + 25, randomValue, random(1, 10));
		circleArray[1][circleArray[1].length] = new circleDraw(putMode, videoInterface.nowPosX, videoInterface.nowPosY, videoInterface.nowRadius, randomValue, random(1, 5));
	}
	if (keyCode === BACKSPACE) {
		if (circleArray[0].length > 5) {
			for (z = 0; z < zNum; z++) {
				circleArray[z].length--;
			}
		}
	}
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function myDelay(targetValue, startTime, currentTime) {

}

