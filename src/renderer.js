import * as posedetection from '@tensorflow-models/pose-detection';
import State from './state';
import View from './view';
import Sound from './sound';
import Camera from './camera';

export class RendererCanvas2d {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.videoWidth = canvas.width;
    this.videoHeight = canvas.height;
    this.lastPoseValidValue = false;
  }

  draw(rendererParams) {
    const [video, poses, isModelChanged] = rendererParams;
    this.videoWidth = video.width;
    this.videoHeight = video.height;
    this.ctx.canvas.width = this.videoWidth;
    this.ctx.canvas.height = this.videoHeight;

    this.redBoxX = this.videoWidth / 12 * 7;
    this.redBoxY = this.videoHeight / 10 * 1.5;
    this.redBoxWidth = this.videoWidth / 6 * 2;
    this.redBoxHeight = this.videoHeight / 10 * 8;

    this.drawCtx(video);
    if (['prepare', 'counting3', 'counting2', 'counting1', 'counting0', 'playing', 'outBox'].includes(State.state)) {
      if (poses && poses.length > 0 && !isModelChanged) {
        this.drawResults(poses, video.width / video.videoWidth);
        //this.isPoseValid(poses, video.width / video.videoWidth);
        State.isCurPoseValid = this.isPoseValid(poses, video.width / video.videoWidth);
        if (State.isCurPoseValid && State.bodyInsideRedBox.value==true && !State.bodyHandsUp.value && State.bodyFaceCam.value && !State.bodySit.value) {
          if (State.state=='prepare') {
            State.changeState('counting3');
          } else if (State.state=='counting3' && State.getStateLastFor()>1000) {
            State.changeState('counting2');
          } else if (State.state=='counting2' && State.getStateLastFor()>1000) {
            State.changeState('counting1');
          } else if (State.state=='counting1' && State.getStateLastFor()>1000) {
            State.changeState('counting0');
          } else if (State.state=='counting0' && State.getStateLastFor()>2000) {
            State.changeState('playing');
          }

          if (
            State.state=='outBox' &&
            State.bodyInsideRedBox.lastFor>3000 &&
            State.bodyHandsUp.lastFor>3000 &&
            State.bodyFaceCam.lastFor>3000 &&
            State.bodySit.lastFor>3000
          ) {
            State.changeState('playing');
          }
        }
      }

      if (State.state=='playing') {
        /*if (State.bodyInsideRedBox.value==false && !State.isTakingPhoto) {
          State.changeState('outBox', 'outBox');
        } else if (State.bodyHandsUp.value==true) {
          State.changeState('outBox', 'hand');
        } else if (State.bodyFaceCam.value==false) {
          State.changeState('outBox', 'face');
        } else if (State.bodySit.value==true) {
          State.changeState('outBox', 'sit');
        } else {*/
          if (Sound.audios.anthem.gainNode.context.currentTime>=Sound.audios.anthem.audioBuffer.duration) {
            State.changeState('finished');
          }
        //}
      }

      if (!State.isTakingPhoto) this.drawBox(State.isCurPoseValid);
    }
    //國旗只在遊戲其間出現
    if (['playing', 'outBox'].includes(State.state)) {
      this.drawFlag();
      if (!State.isCurPoseValid) this.drawCross();
    }
  }

  isPoseValid(poses) {
    if (!poses[0]) return false;
    let pose = poses[0];
    let passScore = 0.65;

    if (pose.keypoints != null) {
      //我建議膊頭兩點，腰兩點，膝頭兩點，手肘兩點，手腕兩點入框就可以玩
      //nose, left_eye_inner, left_eye, left_eye_outer, right_eye_inner, right_eye, right_eye_outer, left_ear, right_ear, mouth_left, mouth_right, left_shoulder, right_shoulder, left_elbow, right_elbow, left_wrist, right_wrist, left_pinky, right_pinky, left_index, right_index, left_thumb, right_thumb, left_hip, right_hip, left_knee, right_knee, left_ankle, right_ankle, left_heel, right_heel, left_foot_index, right_foot_index
      //let checkKeypoints = pose.keypoints.filter(k=>['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_knee', 'right_knee'].includes(k.name) && k.score>0.65);
      //Debug用
      //let checkKeypoints = pose.keypoints.filter(k=>k.name=='nose' && k.score>passScore);
      //半身都可以玩
      let checkKeypoints = pose.keypoints.filter(k=>['nose', 'left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'].includes(k.name) && k.score>passScore);

      let isBodyOutBox = (
        checkKeypoints.find(keypoint=>(
          keypoint.x<this.redBoxX ||
          keypoint.x>(this.redBoxX+this.redBoxWidth) ||
          keypoint.y<this.redBoxY ||
          keypoint.y>(this.redBoxY+this.redBoxHeight)
        )) ? true : false
      );
      State.setPoseState('bodyInsideRedBox', !isBodyOutBox);
      if (isBodyOutBox && State.bodyInsideRedBox.lastFor>3000) {
        if (State.state=='playing') State.changeState('outBox', 'outBox');
        return false;
      }

      let getValidPoint = key=>{
        return pose.keypoints.find(k=>k.name==key && k.score>passScore);
      }

      //檢查有沒有面向鏡頭
      let nose = pose.keypoints.find(k=>k.name=='nose' && k.score>passScore); //鼻尖
      let left_ear = pose.keypoints.find(k=>k.name=='left_ear' && k.score>passScore); //左耳
      let right_ear = pose.keypoints.find(k=>k.name=='right_ear' && k.score>passScore); //右耳
      let left_eye = pose.keypoints.find(k=>k.name=='left_eye' && k.score>passScore); //左眼
      let right_eye = pose.keypoints.find(k=>k.name=='right_eye' && k.score>passScore); //右眼
      let left_shoulder = pose.keypoints.find(k=>k.name=='left_shoulder' && k.score>passScore); //膊頭
      let right_shoulder = pose.keypoints.find(k=>k.name=='right_shoulder' && k.score>passScore); //膊頭
      let left_eye_outer = getValidPoint('left_eye_outer');
      let right_eye_outer = getValidPoint('right_eye_outer');
      //老師想學生面必需正面向，所以改為以外眼及耳的位置來判斷
      let isBodyNotFaceCam = (
        Camera.constraints.video.facingMode=='user' ? (
          (left_eye_outer && left_ear && left_ear.x > left_eye_outer.x) || //面部左轉
          (right_eye_outer && right_ear && right_ear.x < right_eye_outer.x) || //面部右轉
          (left_eye && right_eye && right_eye.x < left_eye.x) || //面部背向鏡頭
          (left_shoulder && right_shoulder && right_shoulder.x < left_shoulder.x) //膊頭背向鏡頭
        ) : (
          (left_eye_outer && left_ear && left_ear.x < left_eye_outer.x) || //面部左轉
          (right_eye_outer && right_ear && right_ear.x > right_eye_outer.x) || //面部右轉
          (left_eye && right_eye && right_eye.x > left_eye.x) ||
          (left_shoulder && right_shoulder && right_shoulder.x > left_shoulder.x)
        )
      );
      /*let isBodyNotFaceCam = (
        Camera.constraints.video.facingMode=='user' ? (
          (nose && left_ear && left_ear.x > nose.x) || //面部左轉
          (nose && right_ear && right_ear.x < nose.x) || //面部右轉
          (left_eye && right_eye && right_eye.x < left_eye.x) || //面部背向鏡頭
          (left_shoulder && right_shoulder && right_shoulder.x < left_shoulder.x) //膊頭背向鏡頭
        ) : (
          (nose && left_ear && left_ear.x < nose.x) || //面部左轉
          (nose && right_ear && right_ear.x > nose.x) || //面部右轉
          (left_eye && right_eye && right_eye.x > left_eye.x) ||
          (left_shoulder && right_shoulder && right_shoulder.x > left_shoulder.x)
        )
      );*/
      State.setPoseState('bodyFaceCam', !isBodyNotFaceCam);
      if (isBodyNotFaceCam && State.bodyFaceCam.lastFor>3000) {
        if (State.state=='playing') State.changeState('outBox', 'face');
        //console.log('outBox', 'face');
        return false;
      }

      //檢查有沒有舉高手及交叉手
      let left_elbow = pose.keypoints.find(k=>k.name=='left_elbow' && k.score>passScore); //手踭
      let left_wrist = pose.keypoints.find(k=>k.name=='left_wrist' && k.score>passScore); //手腕
      let right_elbow = pose.keypoints.find(k=>k.name=='right_elbow' && k.score>passScore); //手踭
      let right_wrist = pose.keypoints.find(k=>k.name=='right_wrist' && k.score>passScore); //手腕
      let isBodyHandsUp = (
        (left_elbow && left_wrist && left_wrist.y < left_elbow.y) || //手腕高過手踭
        (right_elbow && right_wrist && right_wrist.y < right_elbow.y) ||
        (left_elbow && left_shoulder && left_shoulder.y > left_elbow.y) || //手踭高過膊頭
        (right_elbow && right_shoulder && right_shoulder.y > right_elbow.y)
      );
      //手要在腰外。
      let left_hip = getValidPoint('left_hip'); //左腰
      let right_hip = getValidPoint('right_hip'); //右腰
      let isHandsCross = (
        (left_wrist && left_hip && left_wrist.x > left_hip.x) ||
        (right_wrist && right_hip && right_wrist.x < right_hip.x)
      );
      State.setPoseState('bodyHandsUp', isBodyHandsUp || isHandsCross);
      if ((isBodyHandsUp || isHandsCross) && State.bodyHandsUp.lastFor>3000) {
        if (State.state=='playing') State.changeState('outBox', 'hand');
        return false;
      }
      
      //檢查是否踎低
      //因為老師想學生可半身玩，如沒有腳就當半身
      //半身就不用檢查是否踎低
      let left_ankle = getValidPoint('left_ankle');
      let right_ankle = getValidPoint('right_ankle');
      if (left_ankle && right_ankle) {
        let left_knee = pose.keypoints.find(k=>k.name=='left_knee' && k.score>passScore); //膝頭
        let right_knee = pose.keypoints.find(k=>k.name=='right_knee' && k.score>passScore); //膝頭
        let isBodySit = (
          (left_shoulder && left_hip && left_knee && ((left_knee.y - left_hip.y) < ((left_hip.y - left_shoulder.y) * 0.5))) ||
          (right_shoulder && right_hip && right_knee && ((right_knee.y - right_hip.y) < ((right_hip.y - right_shoulder.y) * 0.5)))
        );
        State.setPoseState('bodySit', isBodySit);
        if (isBodySit && State.bodySit.lastFor>3000) {
          if (State.state=='playing') State.changeState('outBox', 'sit');
          //console.log('outBox', 'sit');
          return false;
        }
      } else {
        if (State.state=='playing') State.setPoseState('bodySit', false);
      }

      return true;
    } else {
      return false;
    }
  }

  drawBox(isCurPoseValid) {
    //this.ctx.translate(this.videoWidth, 0);
    //this.ctx.scale(-1, 1);
    this.ctx.beginPath();
    this.ctx.lineWidth = Math.max(10, this.videoHeight * 0.01);
    //this.ctx.roundRect(this.redBoxX, this.redBoxY, this.redBoxWidth, this.redBoxHeight, [this.videoHeight * 0.02]);
    this.ctx.rect(this.redBoxX, this.redBoxY, this.redBoxWidth, this.redBoxHeight);
    this.ctx.strokeStyle = isCurPoseValid ? '#00ff00' : '#ff0000';
    this.ctx.stroke();
    if (!this.lastPoseValidValue && isCurPoseValid && State.isSoundOn) Sound.play('poseValid');
    this.lastPoseValidValue = isCurPoseValid;
  }

  drawCross() {
    if (!View || !View.redCross) return;
    
    this.ctx.drawImage(View.redCross, 0, 0, View.redCross.width, View.redCross.height, this.redBoxX, this.redBoxY + ((this.redBoxHeight - this.redBoxWidth) / 2), this.redBoxWidth,  this.redBoxWidth);
  }

  drawFlag() {
    if (!View || !View.poleImg || !View.flagImg) return;
    
    //加透明白底
    /*this.ctx.fillStyle  = "#FFFFFF66";
    this.ctx.beginPath();
    this.ctx.rect(this.videoWidth * 0.07, this.redBoxY, this.videoWidth  * 0.4, this.redBoxHeight);
    this.ctx.fill();*/

    //let ratio = this.videoHeight / View.poleImg.height * 80 / 100;
    let poleHeight = this.redBoxHeight;//View.poleImg.height * ratio
    let ratio = this.redBoxHeight / View.poleImg.height;
    let flatMaxTop = this.redBoxY + (poleHeight * 0.55);
    let flatMinTop = this.redBoxY + (poleHeight * 0.03);
    let flatTop = flatMaxTop;
    //如果不是以下state，旗應該是在未升的狀態
    if (!State.isGameStarted) {
      flatTop = flatMaxTop;
    } else if (Sound.audios && Sound.audios.anthem && Sound.audios.anthem.audioBuffer && Sound.audios.anthem.gainNode) {
      flatTop = ((Sound.audios.anthem.audioBuffer.duration - Sound.audios.anthem.gainNode.context.currentTime) / Sound.audios.anthem.audioBuffer.duration) * (flatMaxTop - flatMinTop) + flatMinTop;
    }
    flatTop = Math.max(flatTop, flatMinTop);
    this.ctx.drawImage(View.poleImg, 0, 0, View.poleImg.width, View.poleImg.height, this.videoWidth  * 0.1 , this.redBoxY, View.poleImg.width * ratio, poleHeight);
    this.ctx.drawImage(View.flagImg, 0, 0, View.flagImg.width, View.flagImg.height, this.videoWidth  * 0.165 , flatTop, View.flagImg.width * ratio, View.flagImg.height * ratio);
  }

  drawCtx(video) {
    if (Camera.constraints.video.facingMode=='user') {
      this.ctx.translate(this.videoWidth, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
    if (Camera.constraints.video.facingMode=='user') {
      this.ctx.translate(this.videoWidth, 0);
      this.ctx.scale(-1, 1);
    }
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
  }

  drawResults(poses, ratio) {
    for (const pose of poses) {
      this.drawResult(pose, ratio);
    }
  }

  drawResult(pose, ratio) {
    if (pose.keypoints != null) {
      this.keypointsFitRatio(pose.keypoints, ratio);
      if (!State.isTakingPhoto) {
        this.drawKeypoints(pose.keypoints);
        this.drawSkeleton(pose.keypoints, pose.id);
      }
    }
  }

  drawKeypoints(keypoints) {
    const keypointInd = posedetection.util.getKeypointIndexBySide('BlazePose');
    this.ctx.fillStyle = 'Red';
    this.ctx.strokeStyle = 'White';
    this.ctx.lineWidth = 2;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = 'Green';
    for (const i of keypointInd.left) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = 'Orange';
    for (const i of keypointInd.right) {
      this.drawKeypoint(keypoints[i]);
    }
  }

  keypointsFitRatio(keypoints, ratio) {
    for (let keypoint of keypoints) {
      keypoint.x = (Camera.constraints.video.facingMode=='user') ? this.videoWidth - (keypoint.x * ratio) : (keypoint.x * ratio);
      keypoint.y = keypoint.y * ratio;
    }
  }

  drawKeypoint(keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    //const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

    if (score >= 0.65) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }

  drawSkeleton(keypoints, poseId) {
    const color = 'White';
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    posedetection.util.getAdjacentPairs('BlazePose').forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = 0.65;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    });
  }

}
