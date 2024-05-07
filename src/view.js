import Photo from './photo';
import Sound from './sound';
import State from './state';

export default {
  //-----------------------------------------------------------------------------------------------
  loadingBarWrapper: document.querySelector('.loadingBarWrapper'),
  instructionWrapper: document.querySelector('.instructionWrapper'),
  canvasWrapper: document.querySelector('.canvasWrapper'),
  canvas: document.querySelector('.canvasWrapper > canvas'),
  gameWrapper: document.querySelector('.gameWrapper'),
  prepareBoard: document.querySelector('.gameWrapper > .prepareBoardWrapper'),
  //outBoxBoard: document.querySelector('.gameWrapper > .outBoxBoardWrapper'),
  countImg: document.querySelector('.gameWrapper > .count'),
  startBtn: document.querySelector('.startBtn'),
  //musicBtn: document.querySelector('.gameWrapper > .topRightControl > .musicBtn'),
  switchCamBtn: document.querySelector('.gameWrapper > .topRightControl > .switchCamBtn'),
  exitBtn: document.querySelector('.gameWrapper > .topRightControl > .exitBtn'),
  tips: document.querySelector('.gameWrapper > .topRightControl > .tips'),
  poleImg: document.querySelector('.gameWrapper > .flagWrapper > .pole'),
  flagImg: document.querySelector('.gameWrapper > .flagWrapper > .flag'),
  redCross: document.querySelector('.gameWrapper > .flagWrapper > .redCross'),
  capBtn: document.querySelector('.gameWrapper > .capBtn'),
  finishedWrapper: document.querySelector('.finishedWrapper'),
  finishedBoardWrapper: document.querySelector('.finishedWrapper > .finishedBoardWrapper'),
  savePhotoBtn: document.querySelector('.finishedWrapper > .finishedBoardWrapper > .finishedBtnWrapper > .savePhotoBtn'),
  downloadWrapper: document.querySelector('.downloadWrapper'),
  backHomeBtnOfFinished: document.querySelector('.finishedWrapper > .finishedBoardWrapper > .finishedBtnWrapper > .backHomeBtn'),
  backHomeBtnOfDownload: document.querySelector('.downloadWrapper > .downloadBoard  > .downloadBtnWrapper > .backHomeBtn'),
  backHomeBtnOfExit: document.querySelector('.exitWrapper > .exitBoard  > .btnWrapper > .backHomeBtn'),
  saveBtn: document.querySelector('.downloadWrapper > .downloadBoard  > .downloadBtnWrapper > .saveBtn'),
  display: document.querySelector('.downloadWrapper > .downloadBoard > .displayWrapper > .display'),
  leftBtn: document.querySelector('.downloadWrapper > .downloadBoard > .displayWrapper > .leftBtn'),
  rightBtn: document.querySelector('.downloadWrapper > .downloadBoard > .displayWrapper > .rightBtn'),
  exitWrapper: document.querySelector('.exitWrapper'),
  continuebtn: document.querySelector('.exitWrapper > .exitBoard  > .btnWrapper > .continueBtn'),
  conclusionWrapper: document.querySelector('.conclusionWrapper'),
  conclusionBoard: document.querySelector('.conclusionWrapper > .conclusionBoard'),
  conclusionMediaWrapper: document.querySelector('.conclusionWrapper > .conclusionBoard > .mediaWrapper'),
  conclusionTextWrapper: document.querySelector('.conclusionWrapper > .conclusionBoard > .textWrapper'),
  conclusionGoNextPageBtn: document.querySelector('.conclusionWrapper > .conclusionBoard  > .btnWrapper > .goNextBtn'),
  conclusionGoPreviousPageBtn: document.querySelector('.conclusionWrapper > .conclusionBoard  > .btnWrapper > .goPreviousBtn'),
  conclusionPlayAgainBtn: document.querySelector('.conclusionWrapper > .conclusionBoard  > .btnWrapper > .playAgainBtn'),
  conclusionBackHomeBtn: document.querySelector('.conclusionWrapper > .conclusionBoard  > .btnWrapper > .backHomeBtn'),
  goConclusionBtns: document.querySelectorAll('.goConclusionBtn'),
  playConclusionBtn: document.querySelector('.conclusionWrapper > .conclusionBoard > .playConclusionBtn'),
  //-----------------------------------------------------------------------------------------------
  showInstruction() {
    this.instructionWrapper.style.top = 0;
  },
  hideInstruction() {
    this.instructionWrapper.style.top = '-100vh';
  },
  //-----------------------------------------------------------------------------------------------
  showCanvas() {
    this.canvasWrapper.style.visibility = "visible";
    this.canvasWrapper.style.opacity = 1;
  },
  hideCanvas() {
    this.canvasWrapper.style.opacity = 0;
    setTimeout(()=>{
      this.canvasWrapper.style.visibility = "visible";
    }, 500);
  },
  //-----------------------------------------------------------------------------------------------
  showGame() {
    this.gameWrapper.style.top = 0;
  },
  hideGame() {
    this.gameWrapper.style.top = '-100vh';
  },
  //-----------------------------------------------------------------------------------------------
  showPrepareBoard() {
    this.prepareBoard.style.opacity = 1;
  },
  hidePrepareBoard() {
    this.prepareBoard.style.opacity = 0;
  },
  //-----------------------------------------------------------------------------------------------
  /*showOutBoxBoard() {
    this.outBoxBoard.style.opacity = 1;
  },
  hideOutBoxBoard() {
    this.outBoxBoard.style.opacity = 0;
  },*/
  //-----------------------------------------------------------------------------------------------
  showCount(num) {
    this.countImg.className ="count c" + num;
    this.countImg.style.opacity = 1;
    this.countImg.style.maxHeight = "calc(min(40vh, 40vw))";
    setTimeout(()=>this.hideCount(), 600);
  },
  hideCount() {
    this.countImg.style.opacity = 0;
    this.countImg.style.maxHeight = "";
  },
  //-----------------------------------------------------------------------------------------------
  showFinished(withPhoto) {
    if (withPhoto) {
      this.finishedBoardWrapper.classList.add("withPhoto");
      Photo.displayImage(0);
    } else {
      this.finishedBoardWrapper.classList.remove("withPhoto");
    }
    this.finishedWrapper.classList.add("show");
  },
  hideFinished() {
    this.finishedWrapper.classList.remove("show");
  },
  //-----------------------------------------------------------------------------------------------
  showCapBtn() {
    this.capBtn.classList.remove('hide');
  },
  hideCapBtn() {
    this.capBtn.classList.add('hide');
  },
  //-----------------------------------------------------------------------------------------------
  showDownload() {
    this.downloadWrapper.classList.add("show");
  },
  hideDownload() {
    this.downloadWrapper.classList.remove("show");
    setTimeout(()=>Photo.clearImages(), 500);
  },
  //-----------------------------------------------------------------------------------------------
  showExit() {
    this.exitWrapper.classList.add("show");
  },
  //-----------------------------------------------------------------------------------------------
  hideExit() {
    this.exitWrapper.classList.remove("show");
  },
  //-----------------------------------------------------------------------------------------------
  showTips(tipsName) {
    this.tips.className = "tips " + tipsName;
    //this.tips.classList.add(tipsName);
  },
  //-----------------------------------------------------------------------------------------------
  hideTips() {
    this.tips.className = "tips";
    //this.tips.classList.remove(tipsName);
  },
  //-----------------------------------------------------------------------------------------------
  showConclusion(index) {    
    this.setConclusionMedia(index);
    Sound.playConclusion(index);
    this.conclusionWrapper.classList.add("show");
  },
  hideConclusion() {
    this.conclusionWrapper.classList.remove("show");
  },
  setConclusionMedia(index) {
    let mediaObj = [
      { type:'img', src:require('./images/conclusionMedia/1.png'), textSrc:require('./images/conclusionText/text0.png') },
      { type:'img', src:require('./images/conclusionMedia/1.png'), textSrc:require('./images/conclusionText/text1.png') },
      { type:'img', src:require('./images/conclusionMedia/2.png'), textSrc:require('./images/conclusionText/text2.png') },
      { type:'img', src:require('./images/conclusionMedia/3.png'), textSrc:require('./images/conclusionText/text3.png') },
      { type:'img', src:require('./images/conclusionMedia/4.png'), textSrc:require('./images/conclusionText/text4.png') },
      { type:'img', src:require('./images/conclusionMedia/5.png'), textSrc:require('./images/conclusionText/text5.png') },
      { type:'video', src:require('./images/conclusionMedia/6_720p.mp4'), textSrc:require('./images/conclusionText/text6.png') },
      { type:'video', src:require('./images/conclusionMedia/7&9_720p.mp4'), textSrc:require('./images/conclusionText/text7.png') },
      { type:'video', src:require('./images/conclusionMedia/8_720.mp4'), textSrc:require('./images/conclusionText/text8.png') },
      { type:'video', src:require('./images/conclusionMedia/7&9_720p.mp4'), textSrc:require('./images/conclusionText/text9.png') },
      { type:'img', src:require('./images/conclusionMedia/10.png'), textSrc:require('./images/conclusionText/text10.png') },
      { type:'video', src:require('./images/conclusionMedia/11_720p.mp4'), textSrc:require('./images/conclusionText/text11.png') },
      { type:'img', src:require('./images/conclusionMedia/12.png'), textSrc:require('./images/conclusionText/text12.png') }
    ][index];

    //Media
    this.conclusionMediaWrapper.innerHTML = "";
    this.conclusionMediaWrapper.style.display = index==0 ? 'none' : 'flex';
    if (index>0) {
      let mediaEle = document.createElement(mediaObj.type);
      mediaEle.src = mediaObj.src;
      if (mediaObj.type=='img') {
        mediaEle.style.width = '100%';
        mediaEle.style.objectFit = 'contain';
      } else if (mediaObj.type=='video') {
        mediaEle.autoplay = true;
        mediaEle.muted = true;
      }
      this.conclusionMediaWrapper.appendChild(mediaEle);
    }

    //Text
    this.conclusionTextWrapper.innerHTML = "";
    this.conclusionTextWrapper.style.top = index==0 ? 'min(32vh, 32vw)' : 'min(56vh, 56vw)';
    this.conclusionTextWrapper.style.height = index==0 ? 'calc(min(16.26vh, 16.26vw))' : 'calc(min(13.01vh, 13.01vw))';
    let textEle = document.createElement('img');
    textEle.src = mediaObj.textSrc;
    textEle.onclick = ()=>Sound.playConclusion(index);
    this.conclusionTextWrapper.appendChild(textEle);

    this.conclusionGoPreviousPageBtn.style.display = 'flex';// (index>0) ? 'flex' : 'none';
    this.conclusionGoPreviousPageBtn.style.visibility = (index>0) ? 'visible' : 'hidden';
    this.conclusionGoNextPageBtn.style.display = (index < 12) ? 'flex' : 'none';

    this.conclusionPlayAgainBtn.style.display = (index==12) ? 'flex' : 'none';
    this.conclusionBackHomeBtn.style.display = (index==12) ? 'flex' : 'none';
    
    /*this.playConclusionBtn.onclick = ()=>{
      Sound.playConclusion(index);
    }*/

    this.conclusionGoPreviousPageBtn.onclick = ()=>{
      if (State.isSoundOn) Sound.play('btnClick');
      this.showConclusion(index - 1);
    };

    this.conclusionGoNextPageBtn.onclick = ()=>{
      if (State.isSoundOn) Sound.play('btnClick');
      this.showConclusion(index + 1);
    };
  },
  //-----------------------------------------------------------------------------------------------
  /*setPlayConclusionBtnVisible(visible) {
    visible ? this.playConclusionBtn.classList.add("show") : this.playConclusionBtn.classList.remove("show");
  }*/
  //-----------------------------------------------------------------------------------------------
};