console.log("ClickIsTrusted: loading contentscript (and here is the debug link).");

function makeModifiersInteger(e) {
    let res = 0;
    if (e.getModifierState("Alt"))
        res += 1;
    if (e.getModifierState("Control"))
        res += 2;
    if (e.getModifierState("Meta"))
        res += 4;
    if (e.getModifierState("Shift"))
        res += 8;
    return res;
}

function convertMouseType(type) {
    if (type.startsWith("mousedown"))
        return "mousePressed";
    if (type.startsWith("mouseup"))
        return "mouseReleased";
    if (type.startsWith("mousemove"))
        return "mouseMoved";
    if (type.startsWith("wheel"))
        return "mouseWheel";
    throw new Error(`The ${type} event cannot be replicated by the ClickIsTrusted extension.`);
}

function convertButton(button) {
    if (button === 0)
        return "left";
    if (button === 1)
        return "middle";
    if (button === 2)
        return "right";
    if (button === 3)
        return "back";
    if (button === 4)
        return "forward";
}

function convertMouseEvent(e) {
    return {
        type: convertMouseType(e.type),
        modifiers: makeModifiersInteger(e),
        buttons: e.buttons,
        button: convertButton(e.button),
        x: e.clientX,
        y: e.clientY,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        clickCount: 1, // needed to make composed `click` events
        // deltaMode: e.deltaMode, //isn't active in the interface.
        // timeStamp: e.timeStamp //todo include this one??
        // pointerType: "mouse" || "pen" //todo enable this one??
    };
}

function convertTouchType(type) {
    if (type.startsWith("touchstart"))
        return "touchStart";
    if (type.startsWith("touchmove"))
        return "touchMove";
    if (type.startsWith("touchend"))
        return "touchEnd";
    if (type.startsWith("touchcancel"))
        return "touchcancel";
    throw new Error(`The ${type} event cannot be replicated by the ClickIsTrusted extension.`);
}

//todo this is untested and probably doesn't work. see eventToObject.js
function convertTouchPoint(t) {
    return {
        x: t.clientX,
        y: t.clientY,
        radiusX: t.radiusX,
        radiusY: t.radiusY,
        rotationAngle: t.rotationAngle,
        force: t.force,
        id: t.identifier
    };
}

function convertTouchEvent(e) {
    return {
        type: convertTouchType(e.type),
        modifiers: makeModifiersInteger(e),
        touchPoints: e.touches.map(convertTouchPoint),
        // timeStamp: e.timeStamp //todo include this one??
    }
}

function convertKeyType(type) {
    if (type === "keydown-is-trusted")
        return "keyDown";
    if (type === "keyup-is-trusted")
        return "keyUp";
    if (type === "rawkeydown-is-trusted")
        return "rawKeyDown";
    if (type === "char-is-trusted")
        return "char";
    throw new Error(`The ${e.type} event cannot be replicated by the ClickIsTrusted extension.`);
}

function convertKeyEvent(e) {
    return {
        type: convertKeyType(e.type),
        modifiers: makeModifiersInteger(e),
        key: e.key,
        code: e.code,
        location: e.location,
        autoRepeat: e.repeat,

        text: e.text,
        keyIdentifier: e.keyIdentifier,
        unmodifiedText: e.unmodifiedText,
        isKeyPad: e.isKeyPad,
        isSystemKey: e.isSystemKey,
        nativeVirtualKeyCode: e.nativeVirtualKeyCode,
        windowsVirtualKeyCode: e.windowsVirtualKeyCode,

        // timeStamp: e.timeStamp //todo include this one??
    };
}

function convertInputEvent(e) {
    if (!e.type.startsWith("beforeinput"))
        throw new Error(`The ${e.type} event cannot be replicated by the ClickIsTrusted extension.`);
    return {
        type: e.type,
        text: e.data,
        // timeStamp: e.timeStamp //todo include this one??
    };
}

//att 1. calling chrome.runtime cannot be done from inside the event listener. (a different 'this' context?? don't know).
function sendMessage(e) {
    let message;
    if (e instanceof MouseEvent)
        message = convertMouseEvent(e);
    else if (e instanceof TouchEvent)
        message = convertTouchEvent(e);
    else if (e instanceof KeyboardEvent)
        message = convertKeyEvent(e);
    else if (e instanceof InputEvent)
        message = convertInputEvent(e);
    else
        throw new Error("a script has tried to send a bad message: ", e);
    console.log("Passing native event request to background.js: ", message);
    chrome.runtime.sendMessage(message);
}

function manInTheMiddle(event) {
    console.log("received native event request from web page:", event);
    event.stopImmediatePropagation();
    event.preventDefault();
    sendMessage(event);
}

window.addEventListener("mousedown-is-trusted", manInTheMiddle);
window.addEventListener("mousemove-is-trusted", manInTheMiddle);
window.addEventListener("mouseup-is-trusted", manInTheMiddle);
window.addEventListener("wheel-is-trusted", manInTheMiddle);
window.addEventListener("keydown-is-trusted", manInTheMiddle);
window.addEventListener("keyup-is-trusted", manInTheMiddle);
window.addEventListener("rawkeydown-is-trusted", manInTheMiddle);
window.addEventListener("char-is-trusted", manInTheMiddle);
window.addEventListener("beforeinput-is-trusted", manInTheMiddle);


//Arcademics Script Begin
var ANS_1 = null
var ANS_2 = null
var ANS_3 = null

var ANS_4 = null

var QUESTION = null

var arr = [];

var num1 = null

var num2 = null

var answer = null

//find out what the questions and answers are
function findQA() {

    ANS_4 = parseInt(document.querySelector("#gameContainer > iframe").contentDocument.querySelector("#main > g > g > g:nth-child(3) > g:nth-child(4) > g:nth-child(5) > text:nth-child(3)").textContent)
    ANS_3 = parseInt(document.querySelector("#gameContainer > iframe").contentDocument.querySelector("#main > g > g > g:nth-child(3) > g:nth-child(4) > g:nth-child(4) > text:nth-child(3)").textContent)
    ANS_2 = parseInt(document.querySelector("#gameContainer > iframe").contentDocument.querySelector("#main > g > g > g:nth-child(3) > g:nth-child(4) > g:nth-child(3) > text:nth-child(3)").textContent)
    ANS_1 = parseInt(document.querySelector("#gameContainer > iframe").contentDocument.querySelector("#main > g > g > g:nth-child(3) > g:nth-child(4) > g:nth-child(2) > text:nth-child(3)").textContent)

    arr = (document.querySelector("#gameContainer > iframe").contentDocument.querySelector("#main > g > g > g:nth-child(3) > g:nth-child(4) > g:nth-child(1) > text:nth-child(4)").textContent).split('×')

    num1 = parseInt(arr[0])
    num2 = parseInt(arr[arr.length - 1])

    answer = num1 * num2;

    var elem
    if (answer === ANS_4) {
        window.dispatchEvent(new KeyboardEvent("keydown-is-trusted", {
            key: "4",
            code: "Digit4",
        }));

    }
    else if (answer === ANS_3) {
        window.dispatchEvent(new KeyboardEvent("keydown-is-trusted", {
            key: "3",
            code: "Digit3",
        }));

    }
    else if (answer === ANS_2) {
        window.dispatchEvent(new KeyboardEvent("keydown-is-trusted", {
            key: "2",
            code: "Digit2",
        }));

    }
    else if (answer === ANS_1) {
        window.dispatchEvent(new KeyboardEvent("keydown-is-trusted", {
            key: "1",
            code: "Digit1",
        }));

    }
    ANS_1 = null
    ANS_2 = null
    ANS_3 = null
    ANS_4 = null
    arr = []
    num1 = null
    num2 = null
    answer = null
    elem = null
}



//listen for user input
document.querySelector("#gameContainer > iframe").contentDocument.body.addEventListener("keypress", function onEvent(event) {
    setTimeout(findQA(),50);
});
