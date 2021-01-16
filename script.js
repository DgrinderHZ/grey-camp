
const GRID_SIZE = 8;
const GRID_COUNT = GRID_SIZE*GRID_SIZE;

const CLASSES = ['c1', 'c2', 'c3', 'c4', 'c5'];
const NO_OF_BOXES = CLASSES.length;

const gameWrapEl = document.getElementById('game-wrapper');
const buttonEls = document.getElementsByTagName('button');

var isMouseDown = false;

generateBoxes = function (){
    for(var i=0; i<GRID_COUNT; i++){
        var div = document.createElement('div');
        var randomClass = parseInt(Math.random() * NO_OF_BOXES)

        div.classList.add('box');
        div.classList.add(CLASSES[randomClass]);

        gameWrapEl.append(div);
    }
}
generateBoxes();

addBoxEventHandlers = function (){
    gameWrapEl.addEventListener('mousedown', function (e){
        console.log('down', e.pageX, e.pageY);

        pageXStart = e.pageX;
        pageYStart = e.pageY;

        isMouseDown = true;
    });

    gameWrapEl.addEventListener('mouseup', function (e){
        console.log('up', e.pageX, e.pageY);

        pageXEnd = e.pageX;
        pageYEnd = e.pageY;

        isMouseDown = false;
    });
}
addBoxEventHandlers();

