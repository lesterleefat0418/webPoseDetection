import * as posedetection from '@tensorflow-models/pose-detection';
import Camera from './camera';
import {RendererCanvas2d} from './renderer';
import Util from './util';
import View from './view';
import State from './state';
import Sound from './sound';
import Photo from './photo';

let detector
let rafId;
let renderer = null;

async function createDetector() {
  const runtime = 'mediapipe';
  return posedetection.createDetector('BlazePose', {
    runtime,
    modelType: 'lite',
    solutionPath: `@mediapipe/pose@0.4.1633558788`
    //solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
  });
}

async function checkGuiUpdate() {
  window.cancelAnimationFrame(rafId);

  if (detector != null) {
    detector.dispose();
  }

  try {
    detector = await createDetector();
  } catch (error) {
    detector = null;
    alert(error);
  }

}

async function renderResult() {
  if (Camera.video.readyState < 2) {
    await new Promise((resolve) => {
      Camera.video.onloadeddata = () => {
        resolve(video);
      };
    });
  }

  let poses = null;

  // Detector can be null if initialization failed (for example when loading
  // from a URL that does not exist).
  if (detector != null) {
    try {
      poses = await detector.estimatePoses(Camera.video, {maxPoses: 1, flipHorizontal: false});
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }
  }
  
  renderer.draw([Camera.video, poses, false]);
}

async function renderPrediction() {
  if (!detector) await checkGuiUpdate();

  if (!State.isSwitchingCam) await renderResult();

  rafId = requestAnimationFrame(renderPrediction);
};

function init() {
  console.log('in init()');

  //因應iPad及手機browser的nav bar會扣掉高度，在這裡將hv用innerHiehgt重新計算
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const clickHandler = ('ontouchstart' in document.documentElement ? "touchend" : "click");

  View.startBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    State.changeState('prepare');
  });
  
  View.exitBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    State.changeState('pause');
  });

  View.switchCamBtn.addEventListener(clickHandler, ()=>{
    Camera.switchCam();
  });

  /*View.musicBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    toggleSound();
  });*/
  
  /*View.backHomeBtnOfFinished.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    State.changeState('instruction');
  });

  View.backHomeBtnOfDownload.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    State.changeState('instruction');
  });*/

  View.capBtn.addEventListener(clickHandler, ()=>{
    Photo.takePhoto();
  });
  
  View.savePhotoBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.hideFinished();
    View.showDownload();
  });

  View.leftBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    Photo.displayPrevious();
  });
  
  View.rightBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    Photo.displayNext();
  });

  View.saveBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    Photo.downloadPhoto();
  });

  View.backHomeBtnOfExit.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.hideExit();
    State.changeState('instruction');
  });

  View.continuebtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.hideExit();
    State.changeState('prepare');
  });

  /*View.conclusionGoNextPageBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.setConclusionPage(2);
  });

  View.conclusionGoPreviousPageBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.setConclusionPage(1);
  });*/

  View.conclusionBackHomeBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    View.hideConclusion();
    State.changeState('instruction');
  });

  View.conclusionPlayAgainBtn.addEventListener(clickHandler, ()=>{
    if (State.isSoundOn) Sound.play('btnClick');
    State.changeState('prepare');
  });

  View.goConclusionBtns.forEach(btn=>{
    btn.addEventListener(clickHandler, ()=>{
      if (State.isSoundOn) Sound.play('btnClick');
      View.hideDownload();
      State.changeState('conclusion');
    });
  });

  /*View.playConclusionBtn.addEventListener(clickHandler, ()=>{
    View.setPlayConclusionBtnVisible(false)
    Sound.playConclusion();
  });*/

  return Promise.all([
    Sound.preloadAudios([
      ['bgm', require('./audio/bgm.mp3')],
      ['btnClick', require('./audio/btnClick.wav')],
      ['countDown', require('./audio/countDown.wav')],
      ['instruction', require('./audio/instruction.mp3')],
      ['prepare', require('./audio/prepare.mp3')],
      ['start', require('./audio/start.mp3')],
      ['dontMove', require('./audio/dontMove.mp3')],
      //['anthem', require('./audio/instruction.mp3'), true],//ForTest
      ['anthem', require('./audio/anthem.mp3'), true],
      ['finished', require('./audio/finished.mp3')],
      ['finishedWithPhoto', require('./audio/finishedWithPhoto.mp3')],
      ['downloadPhoto', require('./audio/downloadPhoto.mp3')],
      ['outBox', require('./audio/outBox.mp3')],
      ['hand', require('./audio/hand.mp3')],
      ['sit', require('./audio/sit.mp3')],
      ['face', require('./audio/face.mp3')],
      ['takePhoto', require('./audio/takePhoto.mp3')],
      ['poseValid', require('./audio/poseValid.mp3')],
      ['conclusion_0', require('./audio/conclusion/conclusion_0.mp3')],
      ['conclusion_1', require('./audio/conclusion/conclusion_1.mp3')],
      ['conclusion_10', require('./audio/conclusion/conclusion_10.mp3')],
      ['conclusion_11', require('./audio/conclusion/conclusion_11.mp3')],
      ['conclusion_12', require('./audio/conclusion/conclusion_12.mp3')],
      ['conclusion_2', require('./audio/conclusion/conclusion_2.mp3')],
      ['conclusion_3', require('./audio/conclusion/conclusion_3.mp3')],
      ['conclusion_4', require('./audio/conclusion/conclusion_4.mp3')],
      ['conclusion_5', require('./audio/conclusion/conclusion_5.mp3')],
      ['conclusion_6', require('./audio/conclusion/conclusion_6.mp3')],
      ['conclusion_7', require('./audio/conclusion/conclusion_7.mp3')],
      ['conclusion_8', require('./audio/conclusion/conclusion_8.mp3')],
      ['conclusion_9', require('./audio/conclusion/conclusion_9.mp3')]
    ]),
    Camera.getVideo()
  ]);
}

async function app() {
  console.log('in app()');
  if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
  init().then(()=>{
    Util.loadingStart();
    setTimeout(()=>{
      Camera.setup();
      createDetector().then((detector)=>{
        //const canvas = document.getElementById('output');
        renderer = new RendererCanvas2d(View.canvas);
      
        renderPrediction().then(()=>{
          Util.loadingComplete().then(()=>{
            State.changeState('instruction');
            //State.changeState('conclusion');
          });
        })
      });
    }, 2000);
  });

};

//-------------------------------------------------------------------------------------------------
function toggleSound() {
  State.isSoundOn = !State.isSoundOn;
  console.log('State.isSoundOn: ' + State.isSoundOn);
  if (State.isSoundOn) {
    Sound.play('bgm', true);
  } else {
    Sound.stopAll();
  }
}
//-------------------------------------------------------------------------------------------------
app();
//-------------------------------------------------------------------------------------------------