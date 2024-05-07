import State from './state';
import View from './view';

export default {
  audioContext: new (window.AudioContext || window.webkitAudioContext)(),
  audios: {},
  preloadAudio(key, url, createAudioContext=false) {
    return new Promise((resolve, reject)=>{
      let audio = {volume: 1, audioBuffer: null, audioContext: createAudioContext,}
      
      let ajax = new XMLHttpRequest();
      ajax.open("GET", url, true);
      ajax.responseType = "arraybuffer"
      ajax.onload = () => {
        this.audioContext.decodeAudioData(
          ajax.response,
          (buffer) => {
            audio.audioBuffer = buffer;
            this.audios[key] = audio;
            resolve (audio);
          },
          (error) => { debugger }
        )
      }
  
      ajax.onerror = () => { debugger }
  
      ajax.send()
 
    });
  },
  play(key, loop=false, onAudioEndCallBack=null) {
    if (!this.audios[key]) return;
    let audio = this.audios[key];
    if (!audio.audioBuffer) return false;
    let audioContext = (audio.audioContext) ? (new (window.AudioContext || window.webkitAudioContext)()) : this.audioContext;
    let source = audioContext.createBufferSource()
    if (!source) return false;
    source.buffer = audio.audioBuffer;
    source.loop = loop;
    if(!source.start) source.start = source.noteOn;
    if(!source.start) return false
    let gainNode = audioContext.createGain()
    gainNode.gain.value = audio.volume
    source.connect(gainNode)
    gainNode.connect(audioContext.destination);
    source.start(0);
    if (onAudioEndCallBack) {
      setTimeout(()=>onAudioEndCallBack(), audio.audioBuffer.duration * 1000);
    };
    audio.gainNode = gainNode
    return true
    
    /*if (this.audios[key] && this.audios[key].readyState>2) {
      this.stop(key);
      if (force) this.audios[key].currentTime = 0;
      this.audios[key].play();
    }*/
  },
  stop(key) {
    if (!this.audios[key]) return;
    let audio = this.audios[key];
    if(audio.gainNode) audio.gainNode.gain.value = 0;
  },
  pause(key) {
    if (!this.audios[key]) return;
    let audio = this.audios[key];
    if (audio.gainNode && audio.gainNode.context) audio.gainNode.context.suspend();
  },
  resume(key) {
    if (!this.audios[key]) return;
    let audio = this.audios[key];
    if (audio.gainNode && audio.gainNode.context) {
      audio.gainNode.gain.value = 1;
      audio.gainNode.context.resume();
    }
  },
  /*function setSoundVolume(sound, volume) {
  sound.volume = volume
  
  if(sound.gainNode)
    sound.gainNode.gain.value = volume
  }*/
  // How to use:
  //var mySound = loadSound("myFile.wav")
  // Then later after audio is unlocked and the sound is loaded:
  //playSound(mySound)
  // How to unlock all sounds:
  //var emptySound = loadSound("https://touchbasic.app/nothing.wav")
  //document.body.addEventListener('touchstart', function(){playSound(emptySound)}, false)

  //-----------------------------------------------------------------------------------------------
  preloadAudio_old(key, url, loop=false) {
    console.log('in preloadAudio(' + key + ')');
    return new Promise((resolve, reject)=>{
      let audio = new Audio(url);
      audio.preload = "auto";
      audio.loop = loop;
      audio.oncanplaythrough = ()=>{
        console.log('audio(' + key + ') loaded.');
        resolve(audio);
      }
      audio.load();
      this.audios[key] = audio;
    });
  },
  //-----------------------------------------------------------------------------------------------
  preloadAudios(paramArray) {
    console.log('in preloadAudios()');
    let pArray = [];
    for (let [key, url, createAudioContext] of paramArray) {
      pArray.push(this.preloadAudio(key, url, createAudioContext));
    }
    return Promise.all(pArray);
  },
  //-----------------------------------------------------------------------------------------------
  play_old(key, force) {
    if (this.audios[key] && this.audios[key].readyState>2) {
      this.stop(key);
      if (force) this.audios[key].currentTime = 0;
      this.audios[key].play();
    }
  },
  //-----------------------------------------------------------------------------------------------
  stop_old(key) {
    if (this.audios[key] && this.audios[key].readyState>2) this.audios[key].pause();
  },
  //-----------------------------------------------------------------------------------------------
  stopAll(except=[]) {
    for (let key in this.audios) if (!except.includes(key)) this.stop(key);
  },
  //-----------------------------------------------------------------------------------------------
  playConclusion(index) {
    this.stopAll();

    //View.setPlayConclusionBtnVisible(false);
    this.play('conclusion_' + index, false, ()=>{
      //if (State.isSoundOn) View.setPlayConclusionBtnVisible(true);
    });
  }
  //-----------------------------------------------------------------------------------------------

}
