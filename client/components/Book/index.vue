<template>
  <div v-if="book" class="book-box center" @touchmove.prevent>
    <div class="bookinfo">
      <img class="book-cover-l" :src="book.images.large" crossorigin/>
      <div class="mask center">
        <h1>《{{ book.title }}》</h1>
        <h2>{{ book.rating.average }} <small> 分</small></h2>
        <i>作者：{{ book.author.join(',') }}</i>
        <i v-if="book.translator.length">译者：{{ book.translator.join(',') }}</i>
        <i>{{ book.publisher }}，{{ book.pubdate }}</i>
      </div>
      <Button icon="close" :cb="selfCloseBook" :show=true text="关闭" />
      <Button icon="save" :cb="saveBook" :show="isAdd" text="保存" />
      <Button v-loading="loading" icon="delete" :cb="deleteBook" :show="isView" text="删除" />
    </div>
  </div>
</template>

<script>
import Button from './OperationButton';
export default {
  components: {
    Button
  },
  data() {
    return {
      isActive: false,
      loading: false
    };
  },
  props: {
    isAdd: {
      type: Boolean
    },
    isView: {
      type: Boolean
    },
    book: {
      type: Object
    },
    closeBook: {
      type: Function
    }
  },
  methods: {
    selfCloseBook(){
      if(this.isAdd){
        this.$parent.$refs.addbtn.rescan();
      }
      this.closeBook(false);
    },
    doit(method, url, body = {}) {
      if (!this.isActive) {
        this.isActive = true;
        this.loading = true;
        this.$axios[ method ](url, body).then(res => {
          if(res.status != 204) {
            this.$message(res.data.message);
          } else {
            this.closeBook(true);
          }
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          });
        }).then(() => {
          this.loading = false;
          this.isActive = false;
        });
      }
    },
    saveBook() {
      this.doit('post', '/api/book/add', { book: this.book });
    },
    deleteBook() {
      this.doit('delete', '/api/book/' + this.book.isbn13);
    }
  }
};
</script>

<style>
  .book-box{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0, 1);
    color: white;

    .bookinfo{
      overflow: hidden;
      position: relative;
      width: 100%;
      background-color: #ccc;

      .book-cover-l {
        font-size: 0;
        width: 100%;
      }

      .mask{
        flex-direction: column;
        text-align: center;
        position: absolute;
        width: 100%;
        height: 150px;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,.6);

        i{
          margin-bottom: 5px;
        }

        h2{
          margin: 0 0 10px;
          font-size: 2rem;
          color: #69B0AC;
        }
      }
    }

  }
</style>