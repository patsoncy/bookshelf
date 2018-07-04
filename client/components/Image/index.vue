<template>
  <img :src="inViewport ? link : defaultSrc" alt="" ref="img"/>
</template>

<script>
export default {
  data() {
    return {
      defaultSrc: 'https://img1.doubanio.com/f/shire/5522dd1f5b742d1e1394a17f44d590646b63871d/pics/book-default-lpic.gif',
      inViewport: false,
      containerX: null,
      containerY: null
    };
  },
  props: {
    link: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateViewport(dom){
      let rect = dom.getBoundingClientRect();
      let inViewport = (
        rect.top    >= (0 - rect.height)
        && rect.left   >= (0 - rect.width)
        && rect.top    <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.left   <= (window.innerWidth  || document.documentElement.clientWidth)
      );
      if(inViewport && !this.inViewport){
        this.inViewport = true;
      }
    },
    findContainer(dom, dir){
      let NODE_TYPE = {
        DOCUMENT: 9
      };
      let container = window;
      while (dom.nodeType != NODE_TYPE.DOCUMENT) {
        let style = window.getComputedStyle(dom);
        if(style['overflow' + dir.toUpperCase() ] == 'scroll'){
          container = dom;
          break;
        }
        dom = dom.parentNode;
      }
      return container;
    }
  },
  mounted() {
    let dom = this.$refs.img;
    this.containerX = this.findContainer(dom, 'X');
    this.containerY = this.findContainer(dom, 'Y');

    this.handler = () => {
      this.updateViewport(dom);
    };

    this.containerX.addEventListener('scroll', this.handler, false);
    if(this.containerX != this.containerY){
      this.containerY.addEventListener('scroll', this.handler, false);
    }
    this.updateViewport(dom);
  },
  beforeDestroy() {
    this.containerX.removeEventListener('scroll', this.handler);
    this.containerY.removeEventListener('scroll', this.handler);
  }
};
</script>

<style>

</style>