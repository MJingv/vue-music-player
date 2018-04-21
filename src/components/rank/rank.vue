<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist">
      <div class="item" v-for="item in topList" @click="selectItem(item)">
        <div class="icon">
          <img width="100" height="100" v-lazy="item.picUrl"/>
        </div>
      </div>
      <div class="loading-container" v-if="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {
    playlistMixin
  } from 'common/js/mixin'
  import {
    ERR_OK
  } from 'api/config'

  import {
    mapMutations
  } from 'vuex'
  import {
    getTopList
  } from 'api/rank'

  export default {
    mixins: [playlistMixin],
    components: {
      Scroll,
      Loading,
    },
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`,
        })
        this.setTopList(item)
      },
      _getTopList() {
        getTopList().then((res) => {

          if (res.code === ERR_OK) {
            this.topList = res.data.topList

          }
        })

      },
      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        //dom组件变化了，手动调用刷新scroll组件
        this.$refs.toplist.refresh()
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      background-color: $color-highlight-background
      height: 100%
      overflow: hidden
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top:20px
      :nth-child(3n+1)
        .icon img
          width:200px
          height:200px
      .item .icon img
        border-radius:50%
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
