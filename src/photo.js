
import State from './state';
import View from './view';
import Sound from './sound';

export default {
  curIndex: 0,
  images: [/*{
    downloaded: false,
    dataUrl: '',
    filename: '20230723_154433.png'
  }*/],
  //-----------------------------------------------------------------------------------------------
  clearImages() {
    this.images = [];
    this.curIndex = 0;
  },
  //-----------------------------------------------------------------------------------------------
  takePhoto() {
    State.isTakingPhoto = true;
    if (State.isSoundOn) Sound.play('takePhoto');
    View.capBtn.classList.add('captured');

    setTimeout(()=>{
      this.images.push({
        isDownloaded: false,
        dataUrl: View.canvas.toDataURL("image/jpeg", 0.9),
        filename: this.getFilename()
      });
      State.isTakingPhoto = false;
    }, 100);
    
    setTimeout(()=>{
      View.capBtn.classList.remove('captured');
    }, 1000);
  },
  //-----------------------------------------------------------------------------------------------
  getFilename() {
    const pad2 = (n)=>(n < 10) ? '0' + n : n;
    const date = new Date();
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + '_' + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds()) + '.jpg';
  },
  //-----------------------------------------------------------------------------------------------
  downloadPhoto(index=this.curIndex) {
    View.saveBtn.classList.add("downloaded");
    //因為在iPad會有顯示不到"downloaded"class的圖的情況，將下載延遲100ms
    setTimeout(()=>{
      let imgObj = this.images[index];
      if (!imgObj) return;
      const link = document.createElement('a');
      link.download = imgObj.filename,
      link.href = imgObj.dataUrl;
      imgObj.isDownloaded = true;
      link.click();
      link.delete;
    }, 100);
  },
  //-----------------------------------------------------------------------------------------------
  displayImage(index) {
    this.curIndex = index;
    let imgObj = this.images[this.curIndex];

    View.display.style.content = "url(" + imgObj.dataUrl + ")";

    if (imgObj.isDownloaded) {
      View.saveBtn.classList.add("downloaded");
    } else {
      View.saveBtn.classList.remove("downloaded");
    }
  },
  //-----------------------------------------------------------------------------------------------
  displayNext() {
    let newIndex = ++this.curIndex;
    if (newIndex >= this.images.length) newIndex = 0;
    this.displayImage(newIndex);
  },
  //-----------------------------------------------------------------------------------------------
  displayPrevious () {
    let newIndex = --this.curIndex;
    if (newIndex < 0) newIndex = this.images.length - 1;
    this.displayImage(newIndex);
  }
  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------

}
