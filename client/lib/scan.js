// Deprecated
class Scan {
  constructor() {
    if(!(this instanceof Scan)) {
      return new Scan();
    }
    this.decoder = null;
    this.canvas = null;
    this.ctx = null;
    this.active = false;
  }

  init(videoElement) {
    let canvas = document.createElement('canvas');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.decoder = new Worker('/vendor/decoder.min.js');
    this.videoEl = videoElement;
    return this;
  }

  startCapture() {
    // return navigator.mediaDevices.getUserMedia({
    //   audio: false,
    //   video: {
    //     width: { ideal: 1280 },
    //     height: { ideal: 1280 },
    //     facingMode: 'user'
    //   }
    // })
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: {
          exact: 'environment'
        }
      }
    })
      .then((stream) => {
      // 关闭声音
      // stream.getAudioTracks()[0].stop();
        this.videoEl.srcObject = stream;
      // return;
      }).catch((err) => {
      /* 处理error */
        console.log(err);
      });
  }

  async begin(callback) {
    this.active = true;
    this.canvas.style.width = '300px';
    this.canvas.style.height = '400px';
    this.canvas.width = 600;
    this.canvas.height = 800;
    document.body.appendChild(this.canvas);
    await this.startCapture();

    const newDecoderFrame = () => {
      try {
        this.ctx.drawImage(this.videoEl, 0, 0, this.canvas.width, this.canvas.height);
        let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if (imgData.data) {
          this.decoder.postMessage(imgData);
        }
      } catch(err) {
        console.error('newDecoderFrame exception ', err);
      }
    };
    newDecoderFrame();

    const onDecoderMessage = event => {
      console.log('in decoder message ', event.data);
      if (event.data.length > 0) {
        let qrid = event.data[0][2];
        this.active = false;
        callback(qrid);
      }
      if(this.active) {
        setTimeout(newDecoderFrame, 5000);
      }
    };

    this.decoder.onmessage = onDecoderMessage;
  }
}


export default Scan;