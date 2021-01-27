
const GAME_WRAPPER = document.getElementById("gameWrapper");
const TITLE = document.getElementById("title");
const SUBTITLE = document.getElementById("subtitle");
const SATURATION_MIN = 10;

var boxCount = 8;

/**
 * Generate a random hue value, an integer in the range 0-360.
 */
function generateHue() {
    return Math.floor(Math.random() * 360);
}

/**
 * Turn HSL colour values into a formatted string to set as the css background-color on an element.
 * @param {int} hue in range 0-360
 * @param {int} saturation as a % value 
 * @param {int} lightness as a % value
 */
function createColorValue(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Create a sequentially ordered array of shades of a given hue with even saturation spacing.
 * @param {int} hue in range 0-360
 * @param {int} count for number of shades to generate 
 */
function generateOrderedShadesForHue(hue, count) {
    const colours = [];
    const interval = (100 - SATURATION_MIN) / count;
    for (var i = 0; i < count; i++) {
        colours[i] = createColorValue(hue, SATURATION_MIN + interval * i, 50)
    }
    return colours;
}

/**
 * Shuffles array in place.
 * @param {Array} array to modify 
 */
function shuffleArray(array) {
    for (var i = (array.length - 1); i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

/**
 * Generate an array of unique numbers up to count in a random order.
 * @param {int} count length of the resulting array
 */
function generateShuffledIndexesArray(count) {
    const array = [];
    for (var i = 0; i < count; i++) {
        array.push(i);
    }
    shuffleArray(array);
    return array;
}

/**
 * Attach drag and drop event handlers to the supplied DOM element.
 */
function assignEventHandlers(element) {
    element.addEventListener("dragstart", drag);
    element.addEventListener("dragover", allowDrop);
    element.addEventListener("drop", drop);
}

/**
 * Disable interactions with the supplied DOM element, for use when the game is in its completed state.
 */
function clearEventHandlers(element) {
    element.removeEventListener("dragstart", drag);
    element.removeEventListener("dragover", allowDrop);
    element.removeEventListener("drop", drop);
    element.ondragstart = function () { return false; }
}

/**
 * Callback for start of drag event, when box it picked up.
 */
function drag(event) {
    event.dataTransfer.setData("dragStartId", event.target.id);
    event.dataTransfer.setData("dragStartIndex", Array.prototype.indexOf.call(GAME_WRAPPER.children, event.target));
}

/**
 * Callback for drag over event (to disable default behaviours).
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Callback for drop event, when box is released.
 */
function drop(event) {
    event.preventDefault();
    const dragStartId = event.dataTransfer.getData("dragStartId");
    const startIndex = event.dataTransfer.getData("dragStartIndex");
    const endIndex = Array.prototype.indexOf.call(GAME_WRAPPER.children, event.target);
    if (endIndex == boxCount) {
        GAME_WRAPPER.append(document.getElementById(dragStartId));
    } else if (startIndex < endIndex) {
        GAME_WRAPPER.insertBefore(document.getElementById(dragStartId), event.target.nextSibling);
    } else {
        GAME_WRAPPER.insertBefore(document.getElementById(dragStartId), event.target);
    }
    onBoxesUpdated(dragStartId);
}

/**
 * Entry Point for generating the game board.
 * @param {DOM Element} gameWrapper to contain the board
 * @param {int} count number of shades per hue 
 */
function populateBoxes(gameWrapper, count) {
    const hue = generateHue();
    const colours = generateOrderedShadesForHue(hue, count);
    const boxIndices = generateShuffledIndexesArray(count);
    const boxSize = gameWrapper.scrollWidth / count;
    for (var i = 0; i < count; i++) {
        const boxOrder = boxIndices[i];
        const colour = colours[boxOrder];
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.backgroundColor = colour;
        box.draggable = true;
        box.id = boxOrder;
        box.style.height = `${boxSize}px`;

        assignEventHandlers(box);
        gameWrapper.appendChild(box);
    }
}

/**
 * Supply parameters to define grid dimensions.
 * @param {DOM Element} gameWrapper to contain the board
 * @param {int} rowCount
 * @param {int} columnCount 
 */
function updateCssDimensions(gameWrapper, rowCount, columnCount) {
    gameWrapper.style.gridTemplateRows = "1fr ".repeat(rowCount);
    gameWrapper.style.gridTemplateColumns = "1fr ".repeat(columnCount);
}

/**
 * Remove all nodes from supplied DOM node.
 * @param {DOM Node} node 
 */
function clearElements(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

/**
 * Invoked on window resize to ensure box heights adjust to match new box widths.
 */
function updateBoxHeights() {
    const boxes = GAME_WRAPPER.children;
    const boxSize = Math.min(150, gameWrapper.scrollWidth / boxes.length);
    for (var i = 0; i < boxes.length; i++) {
        if (boxes.hasOwnProperty(i)) {
            const box = boxes[i];
            box.style.height = `${boxSize}px`;
        }
    }
}

/**
 * Invoked by a ui button to reset the game with one additional box.
 */
function increaseBoxCount() {
    boxCount++;
    updateCssDimensions(GAME_WRAPPER, 1, boxCount);
    resetGame();
}

/**
 * Invoked by a ui button to reset the game with one fewer boxes.
 */
function decreaseBoxCount() {
    if (boxCount > 3) {
        boxCount--;
        updateCssDimensions(GAME_WRAPPER, 1, boxCount);
        resetGame();
    }
}

/**
 * Resets and regenerates the board.
 */
function resetGame() {
    gameWrapper.classList.remove("complete");
    clearElements(GAME_WRAPPER);
    populateBoxes(GAME_WRAPPER, boxCount);
    TITLE.innerText = "Saturation Sorter!";
    SUBTITLE.innerText = "Drag the colours into a gradient!";
}

/**
 * Called after modifying a given row to verify if order is correct.
 */
function onBoxesUpdated() {
    const boxes = GAME_WRAPPER.children;
    var lastId;
    var isAscending;
    for (var i = 0; i < boxes.length; i++) {
        const boxId = parseInt(boxes[i].id);
        if (i == 0) {
            if (boxId != 0 && boxId != boxes.length - 1) {
                return;
            } else {
                lastId = boxId;
                isAscending = boxId === 0;
            }
        } else {
            if (isAscending && boxId != lastId + 1) {
                return;
            } else if (!isAscending && boxId != lastId - 1) {
                return;
            }
            lastId = boxId;
        }
    }
    gameComplete();
}

/**
 * Update game to display a completed state.
 */
function gameComplete() {
    TITLE.innerText = "Success!";
    SUBTITLE.innerText = "mmm gradients";

    const boxes = GAME_WRAPPER.childNodes;
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        box.classList.add("complete");
        clearEventHandlers(box);
    }
    gameWrapper.classList.add("complete");
}

window.addEventListener('resize', updateBoxHeights);
updateCssDimensions(GAME_WRAPPER, 1, boxCount);
resetGame();
