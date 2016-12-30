

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var is_tone = false;
var oscillator;

function tone_init(pitch){
// create Oscillator node
oscillator = audioCtx.createOscillator();

oscillator.type = 'sine';
oscillator.frequency.value = pitch; // value in hertz
oscillator.connect(audioCtx.destination);
}

function play_tone(pitch){
  if (! is_tone) {
    tone_init(pitch);
    oscillator.start();
    is_tone = true;
  }
}
function stop_tone(){
  oscillator.stop();
  is_tone = false;
}



var theThing = document.querySelector("#thing");
var container = document.querySelector("#contentContainer");
 
container.addEventListener("click", getClickPosition, false);
 
function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x;// - (theThing.clientWidth / 2);
    var yPosition = e.clientY - parentPosition.y;// - (theThing.clientHeight / 2);
    if (is_tone){
      stop_tone();
    }
    play_tone(xPosition); 
    //alert(xPosition);
    //theThing.style.left = xPosition + "px";
    //theThing.style.top = yPosition + "px";
}
 
// Helper function to get an element's exact position
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
