<template>
<transition name="slide">
  <div class="user-center">

    <div class="back">
      <i class="icon-back" @click='back'></i>
    </div>

    <div class="switches-wrapper">
      <switches @switch="selectItem" :switches="switches" :currentIndex="currentIndex"></switches>
    </div>

    <div class="play-btn" ref="playBtn">
      <i class="icon-play"></i>
      <span class="text" @click="random">随机播放全部</span>
    </div>

    <div class="list-wrapper" ref="listWrapper">
      <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0"  :data="favoriteList">
        <div class="list-inner">
          <song-list @select="selectSong" :songs="favoriteList"></song-list>
        </div>
      </scroll>

      <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
        <div class="list-inner">
          <song-list @select="selectSong" :songs="playHistory"></song-list>
        </div>
      </scroll>
    </div>

    <div class="no-result-wrapper" v-if="noResult">
      <no-result :title="noResultDesc"></no-result>
    </div>

  </div>
</transition>
</template>
<script>
import Switches from 'base/switches/switches.vue'
import SongList from 'base/song-list/song-list.vue'
import Scroll from 'base/scroll/scroll.vue'
import Song from 'common/js/song'
import NoResult from 'base/no-result/no-result.vue'
import {
  mapGetters,
  mapActions
} from 'vuex'
import {
  playlistMixin
} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [{
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ],
    }
  },
  computed: {
    noResultDesc() {
      return this.currentIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲'
    },

    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    ...mapGetters([
      'favoriteList', 'playHistory'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult,
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.listWrapper.style.bottom = bottom

      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    random() {
      //获取当前switch下的list
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      //给歌曲列表map实例化
      if (!list.length) {
        return
      }
      list = list.map((item) => {
        return new Song(item)
      })
      this.randomPlay({
        list
      })
    },
    back() {
      this.$router.back()
    },
    selectSong(item) {
      this.insertSong(new Song(item))
    },
    selectItem(index) {
      this.currentIndex = index
    },
    ...mapActions(['insertSong', 'randomPlay'])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
