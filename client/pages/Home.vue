<template>
  <div>
    <div class="thumbnail" v-show="!listType">
      <div
        class="book"
        v-for="book in books"
        :key="book.id"
        @click.passive="clickBook(book)"
      >
        <img :src="book.image" />
        <div class="mask center">
          <h2 class="single-line">{{ book.title }}</h2>
          <p class="single-line">{{ book.author.join(',') }} | <i>{{ book.rating.average }}</i></p>
        </div>
      </div>
    </div>
    <div class="list" v-show="listType">
      <ul>
        <li
          class="book"
          v-for="(book, index) in books"
          :key="book.id"
          @click.passive="clickBook(book)"
        >
          <p>{{ index + 1 }}. {{ book.title }} | <i>{{ book.rating.average }}</i></p>
        </li>
      </ul>
    </div>
    <div :class="[ 'searchbar', { searching: search, searched: !search } ]" @click.prevent.stop="openSearch">
      <el-input
        ref="search"
        placeholder="名称过滤"
        v-model="title"
        prefix-icon="el-icon-search"
        @blur="search = false"/>
    </div>
    <Add :bookdataCB="fromAddBook" :listType="listType" :switchType="switchType" ref="addbtn" />
    <Book
      :book="bookInfo"
      :isAdd="isAdd"
      :isView="isView"
      :closeBook="closeBook"
      />
  </div>
</template>

<script>
import { debounce } from 'lodash';
import Add from '../components/Add';
import SearchBar from '../components/SearchBar';
import Book from '../components/Book';
export default {
  components: {
    Add,
    SearchBar,
    Book
  },
  data() {
    return {
      books: [],
      bookInfo: null,
      isAdd: false,
      isView: false,
      title: '',
      search: false,
      listType: true
    };
  },
  watch: {
    title(val){
      this.fuzzySearch(val);
    }
  },
  methods: {
    switchType() {
      this.listType = !this.listType;
    },
    openSearch() {
      this.search = true;
      this.$refs.search.focus();
    },
    closeBook(refresh) {
      this.bookInfo = null;
      this.isView = false;
      this.isAdd = false;
      refresh && this.init();
    },
    clickBook(book) {
      this.isView = true;
      this.bookInfo = book;
    },
    fromAddBook(data) {
      this.bookInfo = data;
      this.isAdd = true;
    },
    queryData(params = {}) {
      const url = params.title ? '/api/get' : '/api/getall';
      this.$axios.get(url, { params })
        .then(res => {
          this.books = res.data;
        })
        .catch(err => {
          this.$message({
            message: 'fetch books failed:' + err.message,
            type: 'error'
          });
        });
    },
    init() {
      this.queryData();
    },
    fuzzySearch: debounce(function (title){
      this.queryData({ title });
    }, 1500)
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
  .thumbnail{
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;

    .book{
      width: 50%;
      position: relative;

      img{
        width: 100%;
      }
      .mask{
        flex-direction: column;
        background: rgba(0,0,0, .7);
        height: 80px;
        color: white;
        text-align: center;
        overflow: hidden;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;

        h2,p{
          width: 100%;
        }

        h2{
          margin-bottom: 0;
        }
      }

    }
  }
  .list{
    ul{
      font-size: 1.6rem;
      overflow: hidden;
      list-style: none;
      padding: 0;
      margin: 0;
      li{
        padding: 25px 0 25px 20px;
        border-bottom: 0.5px solid #ccc;

        &:nth-child(even){
          background: #B4F1F1;
        }

        &:nth-child(odd){
          background: #ECFFFB;
        }
        p{
          margin: 0;
        }
      }
    }

  }

  .searchbar{
    position: fixed;
    overflow: hidden;
    right: 0;
    top: 80px;
    transform: translateX(155px);

    &.searching{
      animation: popin .3s ease-in 0s 1 normal forwards;
    }

    &.searched{
      animation: popout .2s linear 0s 1 normal forwards;
    }

  }
  @keyframes popin{
    0%{
      transform: translateX(155px);
    }
    60%{
      transform: translateX(-113px);
    }
    80%{
      transform: translateX(-82px);
    }
    100%{
      transform: translateX(-97px);
    }
  }

  @keyframes popout{
    0%{
      transform: translateX(-97px);
    }
    100%{
      transform: translateX(155px);
    }
  }
</style>