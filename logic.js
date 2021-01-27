
const GRID_SIZE = 10;
const SUBMIT_GRID_SIZE = 7;

const gameWrapEl = document.getElementById('game-wrapper');

var isMouseDown = false;

generateBoxes = function (){
    for(var i=0; i<GRID_SIZE; i++){
        var div = document.createElement('div');

        div.classList.add('box');
        div.setAttribute('draggable', true);
        div.setAttribute('ondragstart', "dragStart(event);");
        div.setAttribute('ondragend', "dragEnd(event);");
        div.id = 'box'+i;
        gameWrapEl.append(div);
    }

    for(var i=0; i<SUBMIT_GRID_SIZE; i++){
        var div = document.createElement('div');
        div.classList.add('tosubmit');
        div.setAttribute('ondragover', "dragOver(event);");
        div.setAttribute('ondrop', "drop(event);");
        div.id = 'submitable'+i;
        gameWrapEl.append(div);
    }
}
generateBoxes();

function addBoxEventHandlers(){
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

start = function () {
    for(var i = 0; i < GRID_SIZE ; i++){
        document.getElementById(`box${i}`).style.backgroundColor = getRandomColor();
    }    
}
start();

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

document.getElementById("item2").style.backgroundColor;

function dragStart(event) {
    console.log("dragStart");
    // change background
    event.currentTarget.style.border = "dotted";
    // Add the id of the drag source element to the drag data payload so
    // it is available when the drop event is fired
    event.dataTransfer.setData("text", event.target.id);
    // Tell the browser both copy and move are possible
    event.effectAllowed = "copyMove";
}
       
function dragOver(event) {
    console.log("dragOver");
    // Change the target element's border to signify a drag over event
    // has occurred
    event.currentTarget.style.border = "dotted";
    event.preventDefault();
}
       
function drop(event) {
    console.log("Drop");
    event.preventDefault();
    // Get the id of drag source element (that was added to the drag data
    // payload by the dragstart event handler)
    var id = event.dataTransfer.getData("text");
    console.log(`Id is ${id}`);
    
    // Only drop if dragged to a correct position in hue array
    //  if (id == "item1" && ev.target.id == "result1") 
   
    event.target.style.backgroundColor = document.getElementById(id).style.backgroundColor;
   
}
       
function dragEnd(event) {
     console.log("dragEnd");
     // Restore source's border
     event.target.style.border = "solid black";
     // Remove all of the drag data
     event.dataTransfer.clearData();
}
   


