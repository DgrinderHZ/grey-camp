
const GRID_SIZE = 10;
const GRADIENT_GRID_SIZE = 7;
const SATURATION_MIN = 10;

const gameWrapEl = document.getElementById('game-wrapper');
const randomWrapEl = document.getElementById('random-boxes-wrapper');
const resultWrapEl = document.getElementById('result-wrapper');

var finalIndexes = [];
var gradientIndexes = [];
var gameCompleted = false;

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


function getHSL(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function getHue() {
    return Math.floor(Math.random() * 360);
}

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

function dragStart(event) {
    event.currentTarget.style.border = "dotted";
    event.dataTransfer.setData("text", event.target.id);
    event.effectAllowed = "copyMove";
}
       
function dragOver(event) {
    event.preventDefault();
}
       
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
       
function dragEnd(event) {
     event.target.style.border = "solid black";
     event.dataTransfer.clearData();
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

function containsMinusOne() {
    for (let i = 0; i < finalIndexes.length; i++) {
        if(finalIndexes[i] === -1)
            return true;
    }
    return false;
}

function check() {
    var gameComplete =  (checkAscending() || checkDescending()) ;

    if(containsMinusOne()==false && gameComplete){
        success();
    }
}

function success() {
    document.getElementById('title').innerText = "Success!"
    document.getElementById('hint').innerText = "Congratulations on constructing the gradient... "
    gradientEls = document.getElementsByClassName('gradient');
    for (let i = 0; i < gradientEls.length; i++) {
        gradientEls[i].style.border = "0px";
    }
}

function checkAscending() {
    //  check ascending
    for (let i = 0; i < finalIndexes.length-1; i++) {
        if(finalIndexes[i] >= finalIndexes[i+1]){
            return false;
        }
    }
    return true;
}

function checkDescending(params) {
    //  check descending
    for (let i = 0; i < finalIndexes.length-1; i++) {
        if(finalIndexes[i] <= finalIndexes[i+1]){
            return false;
        }
    }
    return true;
}