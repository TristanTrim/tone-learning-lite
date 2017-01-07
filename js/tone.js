
// Audio stuff
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


// The game canvas

var container = document.querySelector("#contentContainer");
container.addEventListener("click", getClickPosition, false);
//var myGamePiece = new component(30, 30, "red", 10, 20);

var container_value_start = 0;
var container_value_end = 500;
var scale_start = 128;
var scale_end = 523;
var scale_buf = 5;
var scale_duration = scale_end - scale_start + 2*scale_buf; 
function frequency2position(frequency){
  return ((frequency-scale_start)/scale_duration)*container_value_end;
}
function position2frequency(position){
  return (position/container_value_end)*scale_duration
                +scale_start;//-scale_buf;

}
// drawing the scale
var ctx=container.getContext("2d");
var frequency;
var note_vertical_offset_count=0;
for (var note in scale) {
  frequency = scale[note];
  if (scale_start <= frequency && frequency <= scale_end){
    var position = frequency2position(frequency);
    ctx.beginPath();
    ctx.moveTo(position,0);
    ctx.lineTo(position,30);
    ctx.stroke();
    //if (note.startsWith("C")&& !note.endsWith("#")) {
      ctx.font = "12px serif";
      ctx.fillText(note, position, 42+20*(note_vertical_offset_count%3));
    //}
  }
  note_vertical_offset_count++;
}

// The clicking on the canvas event
function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x;// - (theThing.clientWidth / 2);
    var yPosition = e.clientY - parentPosition.y;// - (theThing.clientHeight / 2);
    var tone = position2frequency(xPosition);
    if (is_tone){
      stop_tone();
    }
    play_tone(tone); 
    //alert(tone);
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
