import State from './state';

export default {
  video: document.getElementById('video'),
  constraints: {
    'audio': false,
    'video': {
      facingMode: 'user',
      width: 640,
      height: 480,
      frameRate: {
        ideal: 60,
      }
    }
  },
  //-----------------------------------------------------------------------------------------------
  switchCam() {
    if (State.isSwitchingCam) return;
    State.isSwitchingCam = true;
    this.constraints.video.facingMode = (this.constraints.video.facingMode=='user') ? 'environment' : 'user';
    setTimeout(()=>{
      this.getVideo().then(()=>{
        State.isSwitchingCam = false;
      });
    }, 100);
  },
  //-----------------------------------------------------------------------------------------------
  getVideo() {
    console.log('in getVideo()');

    return new Promise((resolve, reject)=>{
      if (!navigator.mediaDevices.getUserMedia && !navigator.mediaDevices) {
        const errMsg = 'Browser API navigator.mediaDevices.getUserMedia not available';
        console.log(errMsg)
        reject(errMsg);
      } else {
        console.log('start getUserMedia');
        navigator.mediaDevices.getUserMedia(this.constraints).then(stream=>{
          console.log('got stream from getUserMedia');
          this.video.srcObject = stream;
          try { this.video.play() } catch(e){
            console.log(e);
          }
          resolve(this.video);
        }).catch((e)=>{
          console.log(e);
          if (e.message.toLowerCase().indexOf('permission denied') == 0) {
            alert("沒有攝影機使用權限，請於瀏覽器設定此網站的攝影機使用權限");
            reject('permissionDenied');
          } else if (e.message.toLowerCase().indexOf('could not start video source') == 0) {
            alert("請確保您的攝影機尚未被其他軟件/瀏覽器使用");
            reject('couldNotStartVideoSource');
          }else {
            alert("獲取攝影機時發生錯誤");
            reject('errInGetVideo');
          }
        });
      }
    });
  },

  setup() {
    this.resetSize(this.video);
    addEventListener("resize", (event)=>this.resetSize(this.video));
    return this;
  },

  resetSize(video) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const screenRatio = document.body.clientWidth / document.body.clientHeight;

    let videoWidth = 0;
    let videoHeight = 0;
    if (videoRatio > screenRatio) {
      videoWidth = document.body.clientWidth;
      videoHeight = document.body.clientWidth / videoRatio;
    } else {
      videoHeight = document.body.clientHeight;
      videoWidth = document.body.clientHeight * videoRatio;
    }

    video.width = videoWidth;
    video.height = videoHeight;

    const canvasContainer = document.querySelector('.canvas-wrapper');
    if (canvasContainer) {
      canvasContainer.style.width = `${videoWidth}px`;
      canvasContainer.style.height = `${videoHeight}px`;
    }
  }

};
/*
export class Camera {

  video;

  constructor() {
    this.video = document.getElementById('video');
  }

  //-----------------------------------------------------------------------------------------------
  static getVideo() {
    return new Promise((resolve, reject)=>{
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject('Browser API navigator.mediaDevices.getUserMedia not available');
      } else {

      }
  
      const videoConfig = {
        'audio': false,
        'video': {
          facingMode: 'user',
          width: 640,
          height: 480,
          frameRate: {
            ideal: 60,
          }
        }
      };
    
      navigator.mediaDevices.getUserMedia(videoConfig).then(stream=>{
        this.video.srcObject = stream;
        resolve();
      });
    });
  }

  //-----------------------------------------------------------------------------------------------

  static async setup(cameraParam) {
    await this.getVideo();

    this.video.play();

    this.resetSize(this.video);
    addEventListener("resize", (event)=>this.resetSize(this.video));
    return this;
  }

  static resetSize(video) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const screenRatio = document.body.clientWidth / document.body.clientHeight;

    let videoWidth = 0;
    let videoHeight = 0;
    if (videoRatio > screenRatio) {
      videoWidth = document.body.clientWidth;
      videoHeight = document.body.clientWidth / videoRatio;
    } else {
      videoHeight = document.body.clientHeight;
      videoWidth = document.body.clientHeight * videoRatio;
    }

    video.width = videoWidth;
    video.height = videoHeight;

    const canvasContainer = document.querySelector('.canvas-wrapper');
    canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;
  }
}
*/
