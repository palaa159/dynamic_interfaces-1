

/*---------- VARIABLES ----------*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//Canvas position
var canvasPosition;
var nColumns;
var defragIndex;
var mouse;

var rects;
var types;
// var myList = new Array('image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video');
var myList;

/*---------- FUNCTIONS ----------*/							

function setup(data){
	mouse = new Object();
	mouse = {
		x: 0,
		y: 0
	}

	myList = data;
	types = new Array();
	loadTypes();
	createPalette();

	rects = new Array(myList.length);
	for(var i = 0; i < rects.length; i ++){
		var rectangle = new Object;	//creating object
		initDefragRect(rectangle, myList[i].extension, myList[i].filename);		//initializing
		rects[i] = rectangle;
	}

	nColumns = Math.round(canvas.width/rects[0].size.x);
	// console.log(nColumns);
	defragIndex = -1;
	update();
}

function update(){
	defragIndex ++;
	// console.log(defragIndex);
	draw();
}

function draw(){
	//Erasing the background
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < rects.length; i ++){

		var position = new Object();
		position = {
			x: (i % nColumns) * rects[i].size.x,
			y: Math.floor((i/nColumns)) * rects[i].size.y
		}

		rects[i].draw(position);

		//Mouse Over
		if(position.x < mouse.x && mouse.x < position.x + rects[i].size.x
			&& position.y < mouse.y && mouse.y < position.y + rects[i].size.y){
			console.log(rects[i].filename + '.' + rects[i].type);
		}
	}
	if(defragIndex < rects.length){
		drawIndex();
		setTimeout(update, 1000);		
	}

	//request = requestAnimFrame(update);		
}

function drawIndex(){
	var position = new Object();
	position = {
		x: (defragIndex % nColumns) * rects[0].size.x,
		y: Math.floor((defragIndex/nColumns)) * rects[0].size.y
	}

	ctx.lineWidth = 4;
	ctx.strokeStyle = parseHslaColor(0, 0, 0, 1);
	ctx.strokeRect(position.x + 2, position.y + 2, rects[0].size.x - 4, rects[0].size.y - 4);	
}

function loadTypes(){
	for(var i = 0; i < myList.length; i ++){
		var alreadyListed = false;

		for(var j = 0; j < types.length; j ++){
			if(myList[i].extension == types[j]){
				alreadyListed = true;
			}
		}

		if(!alreadyListed){
			types.push(myList[i].extension);
		}
	}
	console.log(types);
}

function createPalette(){
	palette = new Array(types.length);
	for(var i = 0; i < palette.length; i ++){
		palette[i] = map(i, 0, palette.length - 1, 0, 320);
	}
	console.log(palette);
}

var findTypeColor = function(objType){
	var typeHue;
	for(var i = 0; i < types.length; i ++){	
		if(types[i] == objType){
			typeIndex = i;
		}
	}
	typeHue = palette[typeIndex];
	return typeHue;
}

/*---------- SQUARES ----------*/
function initDefragRect(obj, tempType, tempFilename){
	//Variables
		//declaring
		var tempSize = new Object();	

		//initializing
		tempSize = {
			x: 4,
			y: 6
		}

		tempFillColor = {
			h: findTypeColor(tempType),
			s: 100,
			l: 50,
			a: 1
		}

		tempStrokeColor = {
			h: findTypeColor(tempType),
			s: 100,
			l: 20,
			a: 1
		}

		//Attributing to the object
		obj.type = tempType;
		obj.filename = tempFilename;
		obj.size = tempSize;
		obj.fillColor = parseHslaColor(tempFillColor.h, tempFillColor.s, tempFillColor.l, tempFillColor.a);
		obj.strokeColor = parseHslaColor(tempStrokeColor.h, tempStrokeColor.s, tempStrokeColor.l, tempStrokeColor.a);				

	//Functions
	obj.update = updateDefragRect;
	obj.draw = drawDefragRect;		
}

function updateDefragRect(){

}

function drawDefragRect(position){
	ctx.fillStyle = this.fillColor;
	ctx.fillRect(position.x, position.y, this.size.x, this.size.y);
	ctx.lineWidth = 1;
	ctx.strokeStyle = this.strokeColor;
	ctx.strokeRect(position.x, position.y, this.size.x, this.size.y);
}

/*---------- AUXILIAR FUNCTIONS ----------*/
//Resizing the canvas to the full window size
function canvasResize(){
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
	canvas.width = screenWidth - 4;
	canvas.height = screenHeight - 4;
}	

var map = function(value, aMin, aMax, bMin, bMax){
  	var srcMax = aMax - aMin,
    	dstMax = bMax - bMin,
    	adjValue = value - aMin;
  	return (adjValue * dstMax / srcMax) + bMin;
}		

var parseHslaColor = function(h, s, l, a){
	var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
	//console.log('called calculateAngle function');
	return myHslColor;
}

canvas.addEventListener('mousemove', function(evt){
	getMousePos(evt);
}, false);

function getMousePos(evt){
	mouse.x = evt.clientX - canvasPosition.left;
	mouse.y = evt.clientY - canvasPosition.top;
	//You have to use evt.clientX! evt..x doesn't work with Firefox!
	// console.log(mouse.x + ', ' + mouse.y);
}	

//Resizing the canvas
canvasResize();
//setup();
