<template>
<transition>
  <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到列表</h1>
      <div class="close" @click='hide'>
        <i class="icon-close"></i>
      </div>
    </div>
    <div class="search-box-wrapper">
      <search-box ref="searchBox" placehold="搜索歌曲" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut" v-show="!query">
      <switches :switches="switches" @switch="switchItem" :currentIndex="currentIndex"></switches>
      <div class="list-wrapper">
        <scroll :refreshDelay="refreshDelay" ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="playHistory"></song-list>
          </div>
        </scroll>
        <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
          <div class="list-inner">
            <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></search-list>
          </div>
        </scroll>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest @select="selectSuggest" :query="query" :showSinger="showSinger" @listScroll="blurInput"></suggest>
    </div>
    <top-tip ref='topTip'>
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">一首歌曲已经添加到播放列表</span>
      </div>
    </top-tip>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list.vue'
import Suggest from 'components/suggest/suggest.vue'
import TopTip from 'base/top-tip/top-tip.vue'
import {
  searchMixin
} from 'common/js/mixin'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list.vue'
import {
  mapGetters,
  mapActions
} from 'vuex'
import Song from 'common/js/song'
export default {
  mixins: [searchMixin],
  components: {
    SearchList,
    TopTip,
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
  },
  computed: {
    ...mapGetters([
      'playHistory', 'searchHistory'
    ])
  },
  data() {
    return {
      currentIndex: 0,
      switches: [{
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ],
      showFlag: false,
      showSinger: false,
    }
  },
  methods: {
    selectSuggest() {
      this.saveSearch()
      this.showTip()
    },
    showTip() {
      this.$refs.topTip.show()
    },
    selectSong(song, index) {
      //将当前歌曲实例化并插入到当前播放列表中
      if (index !== 0) {
        //把不是当前播放的歌曲插入
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    switchItem(index) {
      this.currentIndex = index
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        //debug滚动时机
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.songList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    ...mapActions([
      'insertSong',
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
