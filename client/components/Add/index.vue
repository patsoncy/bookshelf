<template>
  <div :class="[ 'add-book', { mask: showScan } ]">
    <!-- <div
      :class="[ 'btn', 'check', 'center', { scaning: showScan, scale: touchCheck } ]"
      @click="confirm"
      @touchstart="touchCheck = true"
      @touchend="touchCheck = false"
      >
      <i class="iconfont icon-enter"></i>
    </div> -->
    <!-- <div
      :class="[ 'btn', 'redo', 'center', { scaning: showScan, scale: touchRedo } ]"
      @click="rescan"
      @touchstart="touchRedo = true"
      @touchend="touchRedo = false"
    >
      <i class="iconfont icon-redo"></i>
    </div> -->
    <div
      :class="[ 'btn', 'add', 'center', { scaning: showScan, scale: touchAdd } ]"
      @click="addBook"
      @touchstart="touchAdd = true"
      @touchend="touchAdd = false"
      >
      <i :class="[ 'iconfont', { 'icon-scan': !showScan, 'icon-close': showScan } ]"></i>
    </div>
    <div
      :class="[ 'btn', 'switch', 'center', { scale: touchSwitch } ]"
      v-show="!showScan"
      @click="switchMe"
      @touchstart="touchSwitch = true"
      @touchend="touchSwitch = false"
      >
      <i :class="[ 'iconfont', { 'icon-unorderedlist': !listType, 'icon-appstore': listType } ]"></i>
    </div>
    <Scanner :showScan="showScan" :recieveISBN="recieveISBN" ref="scanner"/>
  </div>
</template>

<script>
import Scanner from '../Scanner';
import { debounce } from 'lodash';

export default {
  components: {
    Scanner,
  },
  props: {
    bookdataCB: {
      type: Function
    },
    listType: {
      type: Boolean
    },
    switchType: {
      type: Function
    }
  },
  data() {
    return {
      showScan: false,
      touchAdd: false,
      touchSwitch: false,
      // touchRedo: false,
      // touchCheck: false,
      apiActive: false,
      isbn: 0,
      bookdata: {}
    };
  },
  methods: {
    switchMe(){
      this.switchType();
    },
    addBook(){
      this.showScan = !this.showScan;
    },
    confirm: debounce(function (){
      if (!this.apiActive) {
        this.apiActive = true;
        this.$axios.get('/api/book/scan/' + this.isbn)
          .then(res => {
            this.bookdataCB(res.data);
            this.apiActive = false;
          })
          .catch(err => {
            this.$message({
              message: err.message,
              type: 'error',
              showClose: true,
            });
            this.apiActive = false;
          });
      }
    }, 3000),
    rescan() {
      this.$refs.scanner.rescan();
    },
    recieveISBN(isbn) {
      this.isbn = isbn;
      this.confirm();
    }
  }
};
</script>

<style lang="less">
  .add-book.mask{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(255,255,255, 1);
  }
  .btn{
    width: 50px;
    height: 50px;
    background-color: transparent;
    margin-left: -25px;
    position: fixed;
    left: 50%;
    bottom: 70px;
    border: none;
    color: black;
    transition: all .3s ease-out;

    &.scale{
      transform: scale(1.2);
    }

    .iconfont{
      font-size: 2.4rem;
    }
  }

  .add{
    /*border: 1px dashed #F19483;*/
    /*border-radius: 50%;*/
    margin-left: 20px;
    .iconfont{
      font-size: 4rem;
      color: #F19483;
    }
    &.scaning{
      margin-left: -25px;
      border: none;
      .iconfont{
        font-size: 2.4rem;
        color: black;
      }
      /*margin-left: -60px;*/
      /*transform: rotate(225deg);*/
    }
  }

  .switch{
    .iconfont{
      font-size: 4rem;
      color: #F19483;
    }
    margin-left: -70px;
  }

  .redo{
    opacity: 0;
    margin-left: 10px;
    &.scaning{
      opacity: 1;
    }
  }

  .check{
    opacity: 0;
    &.scaning{
      opacity: 1;
      margin-left: 60px;
    }
  }
</style>