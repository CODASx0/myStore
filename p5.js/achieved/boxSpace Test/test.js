let detections;
let isRecording = false;

let lips = [];
let lipsLine = [];
var smoothingFactor = 0.36; // 平滑因子，取值范围是 0 到 1。值越大，平滑效果越强。
var smoothingFactorMin = 0;
var smoothingFactorMax = 1;
var smoothingFactorStep = 0.01;

let smoothedDetections = null;

let returnReady = false;
var gridDisplay = true;


//页边距
var pageMargin = 0;
//段间距
var paragraphSpacing = 0;
//段内边距
var padding = 0;
//行间距
var lineSpacing = 0;
//字间距
var wordSpacing = 0;

//字符占位大小
var gridSize = 0;

//圆角大小
var cornerRadius = 0;
var cornerRadiusMin = 0;
var cornerRadiusMax = 40;
var cornerRadiusStep = 1;

//Y轴滚动值
var scrollY = 0;

//图案缩放系数
var ratio = 1;
var ratioMin = 0.1;
var ratioMax = 1;
var ratioStep = 0.01;



let gui;

//马赛克尺寸
var mMeshSize = 30
var mMeshSizeMin = 4
var mMeshSizeMax = 60
var mMeshSizeStep = 1

//判断是否是右引号
let isRightQuote = 0;
let isRightQuote2 = 0;

//p5.js

let font;