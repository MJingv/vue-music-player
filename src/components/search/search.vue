<template>
<div class="search">
  <div class="search-box-wrapper">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
  </div>
  <div class="shortcut-wrapper" ref="shortcutWrapper" v-show='!query'>
    <scroll :refreshDelay="refreshDelay" class="shortcut" :data="shortcut" ref='shortcut'>
      <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
        <span class="text">历史记录</span>
        <span class="clear" @click="showConfirm">
          <i class="icon-clear"></i>
        </span>
        </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory">
          </search-list>
        </div>
      </div>
    </scroll>
  </div>
  <div class="search-result" ref="searchResult" v-show='query'>
    <suggest :query="query" @listScroll="blurInput" ref="suggest" @select='saveSearch'></suggest>
  </div>
  <confirm ref='confirm' text="clear all ?" confirmBtnText="clear" @confirm="clearSearchHistory"></confirm>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box.vue'
import {
  getHotKey
} from 'api/search'
import {
  ERR_OK
} from 'api/config'
import {
  mapActions,
  mapGetters
} from 'vuex'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {
  playlistMixin
} from 'common/js/mixin'
import {searchMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin,searchMixin],
  data() {
    return {
      hotKey: [],
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    },

  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  methods: {
    showConfirm() {
      this.$refs.confirm.show()
    },

    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
        //截取前十个数据
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    ...mapActions([
       'clearSearchHistory'
    ])
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .title
      height: 65px
      line-height: 65px
      text-align: left
      font-size: $font-size-medium-x
      color: $color-text
      position: relative;
      padding-left: 9px;
      &::after
        content: " ";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -9px;
        width: 1%;
        height: 16px;
        background-color: $color-theme;
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
