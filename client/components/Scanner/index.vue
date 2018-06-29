<template>
  <div class="scan-box" v-show="showScan">
    <div class="scan-container" ref="scanner"></div>
    <p class="isbn-text">{{ isbn }}</p>
  </div>
</template>

<script>
import Scanner from '../../lib/quaggaScanner';
export default {
  data() {
    return {
      isbn: '等待扫描结果...',
      scanner: null
    };
  },
  props: {
    showScan: {
      type: Boolean,
      default: false,
    },
    recieveISBN: {
      type: Function
    }
  },
  watch: {
    showScan(val/*, oldVal */) {
      if(val) {
        this.isbn = '等待扫描结果...';
        this.scanner = new Scanner(this.$refs.scanner, (isbn, failed = false) => {
          this.isbn = isbn;
          this.scanner.off();
          // 未获取摄像头权限 failed == true
          if (!failed) {
            this.recieveISBN(isbn);
          }
        });
      } else {
        setTimeout(() => this.scanner.stop(), 1000);
      }
    }
  },
  methods: {
    rescan(){
      this.isbn = '等待扫描结果...';
      this.scanner.restart();
    }
  },
  mounted() {

  }
};
</script>

<style>
  .scan-box{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .scan-container{
      background: #000;
      overflow: hidden;
      font-size: 0;

      video {
        display: block;
        margin: 0 auto;
        width: 280px;
      }

      canvas {
        display: none;
      }
    }
    .isbn-text{
      color: cyan;
      font-size: 1.6rem;
    }
  }
</style>