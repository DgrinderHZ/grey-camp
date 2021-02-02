
const GRID_SIZE = 10;
const GRADIENT_GRID_SIZE = 7;
const SATURATION_MIN = 10;

const gameWrapEl = document.getElementById('game-wrapper');
const randomWrapEl = document.getElementById('random-boxes-wrapper');
const resultWrapEl = document.getElementById('result-wrapper');

var finalIndexes = [];
var gradientIndexes = [];
var gameCompleted = false;

/**
 * Generates the HTML Structure.
 */
generateBoxes = function (){
    for(var i=0; i<GRID_SIZE; i++){
        var div = document.createElement('div');

        div.classList.add('box');
        div.setAttribute('draggable', true);
        div.setAttribute('ondragstart', "dragStart(event);");
        div.setAttribute('ondragend', "dragEnd(event);");
        div.id = 'box'+i;
        randomWrapEl.append(div);
    }

    for(var i=0; i<GRADIENT_GRID_SIZE; i++){
        var div = document.createElement('div');
        div.classList.add('gradient');
        div.setAttribute('ondragover', "dragOver(event);");
        div.setAttribute('ondrop', "drop(event);");
        div.setAttribute('value', i);
        div.id = 'submitable'+i;
        resultWrapEl.append(div);
    }
}
generateBoxes();

/**
 * Gets the hsl for css styling.
 * @param {int} hue 
 * @param {int} saturation as a %
 * @param {int} lightness as a %
 */
function getHSL(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Generates a random hue value.
 */
function getHue() {
    return Math.floor(Math.random() * 360);
}

/**
 * Returns an array of n colors as a gradient.
 * @param {int} hue in range(0, 360)
 * @param {int} n the number of colors to  generate
 */
function getGradient(hue, n) {
    const colours = [];
    const interval = (100 - SATURATION_MIN) / n;
    for (var i = 0; i < n; i++) {
        colours[i] = [getHSL(hue, SATURATION_MIN + interval * i, 50), i];
    }
    return colours;
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * 
 * ES2015 (ES6) version https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Main function.
 */
start = function () {
    hue = getHue();
    colours = shuffle(getGradient(hue, GRID_SIZE));
    gradientEls = document.getElementsByClassName('gradient');
    
    for(var i = 0; i < GRID_SIZE ; i++){
        colour = colours[i][0];
        colourIndex = colours[i][1];
        document.getElementById(`box${i}`).style.backgroundColor = colour;
        document.getElementById(`box${i}`).setAttribute('value', colourIndex);
    } 
    
    for (let i = 0; i < GRADIENT_GRID_SIZE; i++) {
        finalIndexes[i] =  -1;    
    }

    for (let i = 0; i < gradientEls.length; i++) {
        gradientIndexes[i] = parseInt(gradientEls[i].getAttribute('value'));
    }
}
start();


/**
 * Drag start handler.
 * @param {Event} event 
 */
function dragStart(event) {
    event.currentTarget.style.border = "dotted";
    // Save the draged box's id 
    event.dataTransfer.setData("text", event.target.id);
    event.effectAllowed = "copyMove";
}

/**
 * Drag end handler.
 * @param {Event} event 
 */
function dragEnd(event) {
    event.target.style.border = "solid black";
    event.dataTransfer.clearData();
}

/**
 * Drag over handler.
 * @param {Event} event 
 */
function dragOver(event) {
    event.preventDefault();
}

/**
 * Drop down handler.
 * @param {Event} event 
 */      
function drop(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData("text");
   
    event.target.style.backgroundColor = document.getElementById(id).style.backgroundColor;
    // add to finalIndesxes array 
    targetIndex = event.target.getAttribute('value');
    finalIndexes[targetIndex] = parseInt(document.getElementById(id).getAttribute('value'));
    // check if the gradient is fits
    check();
}
       

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * 
 * ES2015 (ES6) version https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Check if we still have empty boxes.
 */
function containsMinusOne() {
    for (let i = 0; i < finalIndexes.length; i++) {
        if(finalIndexes[i] === -1)
            return true;
    }
    return false;
}

/**
 * Check if the game is complete after every move.
 */
function check() {
    var gameComplete =  (checkAscending() || checkDescending()) ;

    if(containsMinusOne()==false && gameComplete){
        success();
    }else if ( containsMinusOne()==false ){
        gameOver();
    }
}

/**
 * Update game to display a completed state.
 */
function success() {
    document.getElementById('title').innerText = "Success!"
    document.getElementById('hint').innerText = "Congratulations on constructing the gradient... "
    gradientEls = document.getElementsByClassName('gradient');
    for (let i = 0; i < gradientEls.length; i++) {
        gradientEls[i].style.border = "0px";
    }
}

/**
 * Update game to display a Game Over state.
 */
function gameOver() {
    document.getElementById('title').innerText = "Game Over!"
    document.getElementById('hint').innerText = "Try Again... "
    gradientEls = document.getElementsByClassName('gradient');
    for (let i = 0; i < gradientEls.length; i++) {
        gradientEls[i].style.border = "3px solid red";
    }
}

/**
 * Check if an ascending gradient is made.
 */
function checkAscending() {
    for (let i = 0; i < finalIndexes.length-1; i++) {
        if(finalIndexes[i] >= finalIndexes[i+1]){
            return false;
        }
    }
    return true;
}

/**
 * Check if a descending gradient is made.
 */
function checkDescending() {
    for (let i = 0; i < finalIndexes.length-1; i++) {
        if(finalIndexes[i] <= finalIndexes[i+1]){
            return false;
        }
    }
    return true;
}