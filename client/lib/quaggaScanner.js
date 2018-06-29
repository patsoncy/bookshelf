import Quagga from 'Quagga';

function detectedCb(cb) {
  return function (data) {
    const isbn = data.codeResult.code || '';
    if (isbn.startsWith('978') && isbn.length === 13){
      cb(isbn);
    }
  };
}

export default class Scan {
  constructor(quaggaElement, cb) {
    this.ready = false;
    this.quagga = Quagga;
    this.onDetectedHandler = null;
    this.quagga.init({
      inputStream : {
        name : 'Live',
        type : 'LiveStream',
        target: quaggaElement
      },
      area: {
        top: '0%',
        right: '0%',
        left: '0%',
        bottom: '0%'
      },
      decoder : {
        readers : ['ean_reader']
      }
    }, err => {
      if (err) {
        cb('Scanner init failed');
        return;
      }
      this.onDetectedHandler = detectedCb(cb);
      this.quagga.start();
      this.quagga.onDetected(this.onDetectedHandler);
    });
  }

  off() {
    this.quagga.offDetected(this.onDetectedHandler);
  }

  restart() {
    this.quagga.onDetected(this.onDetectedHandler);
  }

  stop() {
    this.quagga.stop();
  }

}