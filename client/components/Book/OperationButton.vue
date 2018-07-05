<template>
  <div
    :class="[ 'operation', icon ]"
    @click="cb"
    v-show="show"
  >
    <i :class="[ 'iconfont', `icon-${icon}` ]"></i>
    <!-- <span class="text">{{ text }}</span> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false
    };
  },
  props: [ 'icon', 'cb', 'show', 'text' ],
  methods: {
  }
};
</script>

<style lang="less" scoped>
  .operation{
    width: 60px;
    height: 60px;
    background: rgba(0,0,0,.8);
    position: absolute;
    color: #F596AA;
    display: flex;
    justify-content: center;
    align-items: center;
    /*padding-left: 10px;*/
    /*right: -55px;*/
    right: 0;
    /*transition: right .5s;*/

    .iconfont{
      /*margin-right: 5px;*/
      font-size: 4rem;
    }

    .text {
      font-size: 2rem;
    }
   /* &:hover{
      right: 0;
    };*/
  }

  .close{
    top: 220px;
  }

  .save, .delete{
    top: 140px;
  }

</style>