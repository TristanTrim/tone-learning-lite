

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


