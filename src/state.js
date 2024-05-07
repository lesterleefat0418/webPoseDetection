import View from './view';
import Sound from './sound';
import Photo from './photo';

export default {
  state: 'load', //load/instruction/prepare/count/play
  lastState: '',
  stateLastAt: +new Date(),
  stateLastFor: 0,
  isSoundOn: true,
  outBoxCount: 0,
  isGameStarted: false,
  isTakingPhoto: false,
  isSwitchingCam: false,
  isCurPoseValid: false,
  bodyInsideRedBox: {
    value: false,
    lastAt: +new Date(),
    lastFor: 0,
    /*setValue: (newValue) => {
      if (!this) return;
      if (this.bodyInsideRedBox.value == newValue) {
        this.bodyInsideRedBox.lastFor = +new Date() - this.bodyInsideRedBox.lastAt;
      } else {
        this.bodyInsideRedBox.value = newValue;
        this.bodyInsideRedBox.lastAt = +new Date();
        this.bodyInsideRedBox.lastFor = 0;
      }
    }*/
  },
  bodyHandsUp: {
    value: false,
    lastAt: +new Date(),
    lastFor: 0
  },
  bodyFaceCam: {
    value: true,
    lastAt: +new Date(),
    lastFor: 0
  },
  bodySit: {
    value: false,
    lastAt: +new Date(),
    lastFor: 0
  },
  setPoseState(stateName, newValue) {
    let state = this[stateName];
    if (state.value == newValue) {
      state.lastFor = +new Date() - state.lastAt;
    } else {
      state.value = newValue;
      state.lastAt = +new Date();
      state.lastFor = 0;
    }
  },
  //-----------------------------------------------------------------------------------------------
  getStateLastFor() {
    this.stateLastFor = +new Date() - this.stateLastAt;
    return this.stateLastFor;
  },
  //-----------------------------------------------------------------------------------------------
  changeState(state, stateType='') {
    if (this.state == state) {
      this.stateLastFor = +new Date() - this.stateLastAt;
      return;
    } else {
      this.lastState = this.state;
      this.state = state;
      this.stateLastAt = +new Date();
      this.stateLastFor = 0;
    }

    if (state=='instruction') {
      View.hideCanvas();
      View.hideGame();
      View.hideFinished();
      View.hideDownload();
      View.showInstruction();
      this.outBoxCount = 0;
      Sound.stopAll();
      if (this.isSoundOn) {
        Sound.play('bgm', true);
        Sound.play('instruction');
      }
    } else if (state=='prepare') {
      View.showCanvas();
      View.hideInstruction();
      View.hideConclusion();
      View.showGame();
      View.showPrepareBoard();
      View.showTips('tipsReady');
      Sound.stopAll('bgm');
      this.isGameStarted = false;
      if (this.isSoundOn) Sound.play('prepare');
    } else if (state=='counting3') {
      View.hidePrepareBoard();
      //View.hideOutBoxBoard();
      View.showCount(3);
      Sound.stopAll('anthem');
      if (this.isSoundOn) setTimeout(()=>Sound.play('countDown'), 500);
    } else if (state=='counting2') {
      View.showCount(2);
      if (this.isSoundOn) setTimeout(()=>Sound.play('countDown'), 500);
    } else if (state=='counting1') {
      View.showCount(1);
      if (this.isSoundOn) setTimeout(()=>Sound.play('countDown'), 500);
    } else if (state=='counting0') {
      View.showCount(0);
      if (this.isSoundOn) Sound.play('start');
    } else if (state=='playing') {
      Sound.stopAll('anthem');
      if (this.isSoundOn) {
        this.isGameStarted ? Sound.resume('anthem') : Sound.play('anthem');
        this.isGameStarted = true;
      }
      //View.hideOutBoxBoard();
      View.showTips('tipsStart');
      View.showCapBtn();
    } else if (state=='pause') {
      Sound.stopAll('bgm');
      Sound.pause('anthem');
      View.hidePrepareBoard();
      View.showExit();
    }else if (state=='outBox') {
      this.outBoxCount++;
      Sound.pause('anthem');
      //View.showOutBoxBoard();
      if (stateType=='outBox') {
        if (this.isSoundOn) Sound.play('outBox');
        View.showTips('tipsOutBox');
      } else if (stateType=='hand') {
        if (this.isSoundOn) Sound.play('hand');
        View.showTips('tipsHand');
      } else if (stateType=='face') {
        if (this.isSoundOn) Sound.play('face');
        View.showTips('tipsFace');
      } else if (stateType=='sit') {
        if (this.isSoundOn) Sound.play('sit');
        View.showTips('tipsSit');
      }
      //View.hideCapBtn();
    } else if (state=='finished') {
      let isWithPhoto = (Photo.images && Photo.images.length>0);
      View.hideCanvas();
      View.hideGame();
      View.hideCapBtn();
      View.showFinished(isWithPhoto);
      Sound.stopAll();
      if (this.isSoundOn) Sound.play(isWithPhoto ? 'finishedWithPhoto' : 'finished');
    } else if (state=='conclusion') {
      View.hideFinished();
      View.hideCanvas();
      View.showConclusion(0);
    }
   

  },
  //-----------------------------------------------------------------------------------------------
};