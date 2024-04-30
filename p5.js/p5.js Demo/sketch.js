let canvas;


let text;
let text0;
let characters = [];


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  text = document.querySelector('.text').textContent;
  text0 = document.querySelector('.text');
  


  characters = text.split('');
  document.querySelector('.text').textContent = '';
  characters.forEach(function (character) {
    var span = document.createElement('span');
    span.textContent = character;
    document.querySelector('.text').appendChild(span);
  });


}

function draw() {
  //circle(mouseX, mouseY, 20);
  //text.style('font-variation-settings',"'posx' "+mouseX+", 'posy' "+mouseY);

  let spans = document.querySelectorAll('.text span');
  spans.forEach(function (span, index) {
    var x = 50 * cos(0.02 * frameCount + index * 0.06) + 50;
    var y = 50 * sin(0.02 * frameCount + index * 0.1) + 50;
    span.style.fontVariationSettings = "'posx' " + x + ", 'posy' " + y;
    span.style.border = "1px solid #000";  // 1px宽，实线，黑色
    
    
    
  });

  text0.style.left = mouseX - text0.offsetWidth / 2 + 'px';
  text0.style.top = mouseY - text0.offsetHeight / 2 + 'px';
  text0.style.border = '1px solid black';
  text0.style.lineHeight = '1em';

  

}
