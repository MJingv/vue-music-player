<template>
<div id="app">
  <m-header></m-header>
  <tab></tab>
  <keep-alive>
    <!-- 缓存dom -->
    <router-view></router-view>
  </keep-alive>
  <player ></player>

</div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~@/common/stylus/variable"
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
//   // color:$color-theme
// }
</style>
