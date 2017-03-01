
// Audio stuff
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var is_tone = false;
var oscillator;
function tone_init(pitch){
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = pitch; // value in hertz
  oscillator.connect(audioCtx.destination);
}

var tone_play_time = 150;

function play_tone(pitch){
  if (! is_tone) {
    tone_init(pitch);
    oscillator.start();
    is_tone = true;
    setTimeout(stop_tone, tone_play_time);
  }
}
function stop_tone(){
  oscillator.stop();
  is_tone = false;
}

// The game canvas
var container = document.querySelector("#contentContainer");
container.addEventListener("click", canvasClickEvent, false);

function info_log(text){
    ctx.fillStyle="#F2F2F2";
    ctx.fillRect(20,130,200,148); 
    ctx.font = 12 + "px serif";
    ctx.fillStyle="#000000";
    ctx.fillText(text, 20, 140);
}
  
var ctx=container.getContext("2d");
ctx.font = 12 + "px serif";
ctx.fillStyle="#000000";
ctx.fillText("Repeat", 230, 140);
var input_width = 490;//Why is this a thing? Ack!
var scale_start = 128;
var scale_end = 524;
var scale_buf = 5;
var scale_duration = scale_end - scale_start + (2*scale_buf);
function frequency2position(frequency){
  return ((frequency-scale_start)/scale_duration)*ctx.canvas.width;
}
function position2frequency(position){
  return (position/input_width)*scale_duration
                +scale_start;//-scale_buf;
}
var scale_segment = [];
var scale_segment_keys = [];
// drawing the scale
var frequency;
var note_vertical_offset_count=0;
for (var note in scale) {
  frequency = scale[note];
  if (scale_start <= frequency && frequency <= scale_end){
    scale_segment[note]=frequency;
    scale_segment_keys.push(note);
    var position = frequency2position(frequency);
    ctx.beginPath();
    ctx.moveTo(position,0);
    ctx.lineTo(position,30);
    ctx.stroke();
    //if (note.startsWith("C")&& !note.endsWith("#")) {
      ctx.font = 12 + "px serif";
      ctx.fillText(note, position, 42+15*(note_vertical_offset_count%5));
    //}
  }
  note_vertical_offset_count++;
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


// The clicking on the canvas event
var click_score = 0;
var win_score = 0;
function canvasClickEvent(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x;
    var yPosition = e.clientY - parentPosition.y;
    var tone = position2frequency(xPosition);
    
    if (yPosition>150 && xPosition>350){
      repeat_tone();
      return;
    }
    if (is_tone){ // check if a note is already sounding, and stop it.
      stop_tone();
    }
    play_tone(tone); 

    click_score += 1;
    if (proximal(tone, scale_segment[current_note])){
      win_score += 1;
      setTimeout(start_round, tone_play_time*4.5);
    }
    setTimeout(repeat_tone, tone_play_time*1.5);

    score_percent = (100*win_score/click_score).toFixed(1);;
    info_log("Score: "+win_score+"/"+click_score+" : "+score_percent+"%");
}
function proximal(frequency, guessed_frequency){
    proximity_buffer = 6;
    if (frequency+proximity_buffer >= guessed_frequency &&
        frequency-proximity_buffer <= guessed_frequency){
          return true;
    }
    return false;
}
   
// game stuff
var current_note;
function repeat_tone() {
  play_tone(scale_segment[current_note]);
}
function start_round() {
  current_note =
     scale_segment_keys[
       scale_segment_keys.length * Math.random() << 0
     ];
  play_tone(scale_segment[current_note]);
}
info_log("Score: 0/0 : 0.0%");
start_round();
