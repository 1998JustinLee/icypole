var x1 = 300, y1 = 200 // Resting position of objects

var numStags = 30 // Number of stalagtites

var textT = setTimeout(textTime, 3000) // Text timeout variable

var blinkT = setTimeout(blinkTime, 5000) // Blink timeout variable

var flakeY, flakeSpeedArr // Flake Y var, flake fall speed array
var numFlakes = 30 // Number of snowflakes
var snowInt // Snow interval
var ifsnow = false // True to show snow

// Speed
// 1 - 20: 20 is slowest
var tongueSpeed = 10 // Tongue retraction speed
// 1 - 10: 10 is slowest
var snowSpeed = 5 // Overall snow fall interval speed
// 1 - 20: 1 is slowest
var stagSpeed = 10 // Stalagtite fall speed
// 1 -20: 20 is slowest
var stagWobbleSpeed = 1 // Stalagtite wobble speed

// Possible phrases
var phrases = [
    "owie",
    "ouch",
    "help me",
    "this really hurts",
    "i'm pretty stuck",
    "sure is cold",
    "how's it look?"
]

// Hat positioning variables
var hatNum = 0
var hats = [
    ["beanie", 7, -35], 
    ["cap", -27, -20], 
    ["sunvisor", -35, 20],
    ["tophat", 5, -95],
    ["sombrero", -45, -40],
    ["chefhat", -18, -82]
]

// Glasses positioning variables
var glassNum = 0
var glasses = [
    ["glasses", 3, 38],
    ["monocle", 28, 35],
    ["sunglasses", 3, 38],
    ["mask", 6, 40]
]

// Initial function calls
dragEverything()
initStags()
showSnow()

// Refresh stalagtites on 'r' keypress
document.addEventListener('keypress', keyPress)
function keyPress(e) {
    if(e.key=='r' || e.key=='R') {
        initStags()
    }

    if(e.key=='s' || e.key=="S") {
        snowSwitch()
    }
}

// Initialise dragElement for all drag-able elements
function dragEverything() {
    // Drag-able elements
    var elements = [
        "pupil", 
        "svgFace",
        "lid1",
        "lid2",
        "lid3",
        "lid4",
        "beanie",
        "cap",
        "sunvisor",
        "tophat",
        "sombrero",
        "chefhat",
        "glasses",
        "monocle",
        "sunglasses",
        "mask"
    ]

    var i;
    for(i=0; i<elements.length; i++) {
        dragElement(document.getElementById(elements[i]));
    }
}

// Change value when dragging slider
function updateSlider(slideVar, slideId) {
    var value = document.getElementById(slideId)
    value.innerText = slideVar
    if(slideId=="tongueSpeed") {
        tongueSpeed = 21 - slideVar
    }else if(slideId=="snowSpeed") {
        snowSpeed = 11 - slideVar
    }else if(slideId=="stagSpeed") {
        stagSpeed = parseInt(slideVar)
    }else if(slideId=="stagWobbleSpeed") {
        stagWobbleSpeed = 21 - slideVar
    } 
}

// Reset elements on slider release
function resetSpeed(slideVar, slideId) {
    if(slideId=="snowSpeed") {
        if(ifsnow==true) {
            removeSnow()
            initSnow()
        }else{
            initSnow()
            ifsnow = true
        }
    }else if(slideId=="stagSpeed") {
        initStags()
    }
}

// Initialise stalagtites
function initStags() {
    var stag, stagDiv, i, posVal, hVal;
    stagDiv = document.getElementById("stalagtites")
    stagDiv.parentNode.removeChild(stagDiv)
    stagDiv = document.createElement("div")
    stagDiv.id = "stalagtites"

    for(i=0; i<numStags; i++) {
        posVal = parseInt(Math.random() * 100)
        hVal = 40 + parseInt(Math.random() * 100)

        stag = document.createElement("img")
        stag.className = "stalagtite"
        stag.style.zIndex = "80"
        stag.style.position = "absolute"
        stag.style.height = hVal+"px"
        stag.style.top = "-1px"
        stag.src = "images/stalagtite.svg"
        stag.style.left = posVal+"%"
        stag.onclick = function() {stagDrop(this)}
        stag.onmouseover = function() {stagWobble(this)}
        stagDiv.appendChild(stag)
    }

    var body = document.getElementsByTagName("body")[0]
    body.appendChild(stagDiv)
}

// Animating stalagtite dropping
function stagDrop(index) {
    var docHeight = document.getElementById("pole").clientHeight
    var hConst = -1
    var interval = setInterval(drop, 1)
    function drop() {
        console.log(stagSpeed)
        hConst = hConst + stagSpeed
        index.style.top = hConst + "px"
        if(hConst>docHeight) {
            clearInterval(interval)
            index.style.display = "none"
        }
    }
}

// Animating staglatite wobble
function stagWobble(index) {
    var interval = setInterval(wobble, stagWobbleSpeed)
    var angle = 0
    var inc = 2
    var count = 0 // So stalagtite only wobbles 4 times

    function wobble() {
        angle = angle + inc
        index.style.transform = "rotate("+angle+"deg)"
        if(angle>6) {
            inc = -2
            count++
        }
        if(angle<-6) {
            inc = 2
            count++
        }
        if(count==4 && angle==0) {
            clearInterval(interval)
        }
    }
}

// Only show snow if ifsnow true
function showSnow() {
    if(ifsnow==true) {
        initSnow()
    }
}

// Initialise snow
function initSnow() {
    var snow = document.getElementById("snow")
    var i, flake
    flakeSpeedArr = new Array(numFlakes)
    flakeY = new Array(numFlakes)
    // Creating flakes
    for(i=0; i<numFlakes; i++) {
        flake = document.createElement("div")
        flake.className = "flake"
        var xVal = Math.floor(Math.random() * 101)
        flakeSpeedArr[i] = Math.floor(Math.random() * 4) + 1
        var flakeSize = Math.floor(Math.random() * 14) + 5
        flake.style.height = flakeSize+"px"
        flake.style.width = flakeSize+"px"
        flake.style.left = xVal+"%"
        // Randomise initial starting Y
        flakeY[i] = 0 - Math.floor(Math.random() * 1000)

        snow.appendChild(flake)
    }
    
    // Initialising animations
    snowInt = setInterval(flakeFall, 5*snowSpeed)
    function flakeFall() {
        var docHeight = document.getElementById("pole").clientHeight
        var flakes = document.getElementsByClassName("flake")
        var i;
        for(i=0; i<numFlakes; i++) {
            flakeY[i] = flakeY[i] + flakeSpeedArr[i]
            flakes[i].style.top = flakeY[i]+"px"
            // When flake is off the screen
            if(flakeY[i]>docHeight) {
                // Reset height
                flakeY[i] = 0
                // Randomise x value
                var xVal = Math.floor(Math.random() * 101)
                flakes[i].style.left = xVal+"%"
                // Randomise speed
                flakeSpeedArr[i] = Math.floor(Math.random() * 4) + 1
            }
        }
    }
}

// Removes flake divs
function removeSnow() {
    clearInterval(snowInt)
    var snow = document.getElementById("snow")
    snow.parentNode.removeChild(snow)
    snow = document.createElement("div")
    snow.id = "snow"
    var body = document.getElementsByTagName("body")[0]
    body.appendChild(snow)   
}

// Switches snow on/off
function snowSwitch() {
    if(ifsnow==true) {
        removeSnow()
        ifsnow = false
    }else{
        initSnow()
        ifsnow = true
    }
}

// Text timeout function
// Makes text appear/disappear
function textTime() {
    var text = document.getElementById("text")
    var textSel = phrases[Math.floor(Math.random() * phrases.length)]
    text.innerText = textSel // Set random phrase
    text.style.display = "block"

    // Text will be shown for 3 seconds
    var shownT = setTimeout(shownTF, 3000)
    function shownTF() {
        text.style.display = "none"
    }

    // Set next time appearance
    var nextTime = Math.floor(Math.random() * 11)
    nextTime = 4000 + (1000 * nextTime)
    textT = setTimeout(textTime, nextTime)
}

// Blink timeout function
function blinkTime() {
    // Blink
    var blink = document.getElementById("lid4")
    blink.style.display = "block"

    // Blink will be shown for 150 ms
    var next = setTimeout(nextB, 150)
    function nextB() {
        blink.style.display = "none"
    }

    // Set next blink
    var nextTime = Math.floor(Math.random() * 11)
    nextTime = 500 + (1000 * nextTime)
    blinkT = setTimeout(blinkTime, nextTime)
}

// Hat selection function
function hat(hatSel) {
    // Set visible hat to invisible
    var hat = document.getElementById(hats[hatNum][0])

    // Select/deselect visible hat
    if(hatNum == hatSel-1) {
        if(hat.style.display!="block") {
            hat.style.display = "block"
            return
        }else{
            hat.style.display = "none"
            return
        }
    }

    hat.style.display = "none"

    // Set selected hat to visible
    hat = document.getElementById(hats[hatSel-1][0])
    hat.style.display = "block"
    hatNum = hatSel-1 
}

// Glasses selection function
function glassesF(glssSel) {    
    // Set visible glasses to invisible
    var glss = document.getElementById(glasses[glassNum][0])
    
    // Select/deselect visible glasses
    if(glassNum == glssSel-1) {
        if(glss.style.display!="block") {
            glss.style.display = "block"
            return
        }else{
            glss.style.display = "none"
            return
        }
    }

    glss.style.display = "none"

    // Unselect visible glasses
    if(glassNum != glssSel-1) {
        // Set selected glasses to visible
        glss = document.getElementById(glasses[glssSel-1][0])
        glss.style.display = "block"
        glassNum = glssSel-1   
    }
}

// Changing when eyelids appear
function eyeLids() {
    var lid1 = document.getElementById("lid1")
    if(x1>600) {
        lid1.style.display = "block"
    }else{
        lid1.style.display = "none"
    }

    var lid2 = document.getElementById("lid2")
    if(x1>900) {
        lid2.style.display = "block"
    }else{
        lid2.style.display = "none"
    }

    var lid3 = document.getElementById("lid3")
    var tear = document.getElementById("tear")
    if(x1>1100) {
        lid3.style.display = "block"
        tear.style.display = "block"
    }else{
        lid3.style.display = "none"
        tear.style.display = "none"
    }
}

function allElementsMove(varX, varY) {
    // Tongue
    var tongue = document.getElementById("tongue")
    var tx1 = varX + 45;
    var ty1 = varY + 120;
    var tx2 = varX + 45;
    var ty2 = varY + 135;
    tongue.style.clipPath = "polygon(27px 320px, "+tx1+"px "+ty1+"px , "+tx2+"px "+ty2+"px, 27px 335px)"

    // Pupil
    var pupil = document.getElementById("pupil")
    var px1 = varX + 45;
    var py1 = varY + 60;
    pupil.style.clipPath = "circle(5px at "+px1+"px "+py1+"px)"

    // Face
    var face = document.getElementById("svgFace")
    var fx1 = varX - 8
    var fy1 = varY - 6
    face.style.left = ""+fx1+"px"
    face.style.top = ""+fy1+"px"

    var lid1 = document.getElementById("lid1")
    var l1x1 = varX+35, l1x2 = varX+70, l1x3 = varX+70, l1x4 = varX+35
    var l1y1 = varY+68, l1y2 = varY+68, l1y3 = varY+80, l1y4 = varY+80
    lid1.style.clipPath = "polygon( "+l1x1+"px "+l1y1+"px, "+l1x2+"px "+l1y2+"px, "+l1x3+"px "+l1y3+"px, "+l1x4+"px "+l1y4+"px)"

    var lid2 = document.getElementById("lid2")
    var l2x1 = varX+35, l2x2 = varX+70, l2x3 = varX+70, l2x4 = varX+35
    var l2y1 = varY+62, l2y2 = varY+62, l2y3 = varY+80, l2y4 = varY+80
    lid2.style.clipPath = "polygon( "+l2x1+"px "+l2y1+"px, "+l2x2+"px "+l2y2+"px, "+l2x3+"px "+l2y3+"px, "+l2x4+"px "+l2y4+"px)"

    var lid3 = document.getElementById("lid3")
    var l3x1 = varX+35, l3x2 = varX+70, l3x3 = varX+70, l3x4 = varX+35
    var l3y1 = varY+40, l3y2 = varY+40, l3y3 = varY+62, l3y4 = varY+45
    lid3.style.clipPath = "polygon( "+l3x1+"px "+l3y1+"px, "+l3x2+"px "+l3y2+"px, "+l3x3+"px "+l3y3+"px, "+l3x4+"px "+l3y4+"px)"

    var lid4 = document.getElementById("lid4")
    var l4x1 = varX+35, l4x2 = varX+70, l4x3 = varX+70, l4x4 = varX+35
    var l4y1 = varY+40, l4y2 = varY+40, l4y3 = varY+80, l4y4 = varY+80
    lid4.style.clipPath = "polygon( "+l4x1+"px "+l4y1+"px, "+l4x2+"px "+l4y2+"px, "+l4x3+"px "+l4y3+"px, "+l4x4+"px "+l4y4+"px)"

    var tear = document.getElementById("tear")
    var tearx1 = varX+67
    var teary1 = varY+62
    tear.style.clipPath = "circle(5px at "+tearx1+"px "+teary1+"px)"

    // Hat selection
    var hat = document.getElementById(hats[hatNum][0])
    var hatx = varX + hats[hatNum][1]
    var haty = varY + hats[hatNum][2]
    hat.style.left = hatx+"px"
    hat.style.top = haty+"px"

    // Glasses selection
    var glss = document.getElementById(glasses[glassNum][0])
    var glssX = varX + glasses[glassNum][1]
    var glssY = varY + glasses[glassNum][2]
    glss.style.left = glssX+"px"
    glss.style.top = glssY+"px"

    // Text
    var text = document.getElementById("text")
    var teX1 = varX - 90 
    var teY1 = varY - 30
    text.style.left = teX1+"px"
    text.style.top = teY1+"px"
}

// Functions to drag elements taken from:
// https://www.w3schools.com/howto/howto_js_draggable.asp
// Make the DIV element draggable:
function dragElement(elmnt) {
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    if(x1-pos1 > 300) {
        x1 = x1 - pos1;
    }

    y1 = y1 - pos2;

    eyeLids()

    allElementsMove(x1, y1);
  }

  // Moving head back on mouse up
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    
    // Dragging Down
    if(y1>200) {
        var xInt = (x1 - 300) / (5 * tongueSpeed);
        var yInt = (y1 - 200) / (5 * tongueSpeed);
        var interval = setInterval(frameBelow, 1);
        function frameBelow() {
            if(x1<=300 && y1<=200) {
                clearInterval(interval);
            }else{
                if(x1>300) {
                    if(x1-xInt<300) {
                        x1 = 300;
                    }else{
                        x1 = x1-xInt;
                    }
                }
                if(y1>200) {
                    if(y1-yInt<200) {
                        y1 = 200;
                    }else{
                        y1 = y1-yInt;
                    }
                }
                eyeLids()
                allElementsMove(x1, y1);
            }
        }
    // Dragging Up
    }else{
        var xInt = (x1 - 300) / (5 * tongueSpeed);
        var yInt = (y1 - 200) / (5 * tongueSpeed);
        var interval = setInterval(frameBelow, 1);
        function frameBelow() {
            if(x1<=300 && y1>=200) {
                clearInterval(interval);
            }else{
                if(x1>300) {
                    if(x1-xInt<300) {
                        x1 = 300
                    }else{
                        x1 = x1-xInt;
                    }
                }
                if(y1<200) {
                    if(y1-yInt>200) {
                        y1 = 200
                    }else{
                        y1 = y1-yInt;
                    }
                }
                eyeLids()
                allElementsMove(x1, y1);
            }
        } 
    }

  }
}

