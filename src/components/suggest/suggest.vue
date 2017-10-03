<template>
<scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref ="suggest" >
  <ul class="suggest-list">
    <li @click= 'selectItem(item)' class="suggest-item" v-for="item in result">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getDisplayName(item)"></p>
      </div>
    </li>
    <loading v-show="hasMore" ></loading>
  </ul>
  <router-view></router-view>
</scroll>

</template>

<script>
import Scroll from 'base/scroll/scroll'
import {
  ERR_OK
} from 'api/config'
import {
  createSong
} from 'common/js/song'
import {
  search
} from 'api/search'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex'

const TYPE_SINGER = 2
const perpage = 20

export default {
  components: {
    Scroll,
    Loading,
  },
  props: {
    query: {
      //检索词
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    query() {
      this.search()
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
    }
  },
  methods: {
    selectItem(item){
      if(item.type === TYPE_SINGER){
        const singer  = new Singer({
          id:item.singermid,
          name:item.singername
        })
        this.$router.push({
          path:`/search/${singer.id}`
        })
        //修改当前singer
        this.setSinger(singer)
      }
    },
    searchMore() {
      if (this._hasMore) {
        return
      }
      this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code == ERR_OK) {

            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)

          }
        })

    },
    getDisplayName(item) {
      if (item.type == TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        //歌手icon
        return 'icon-mine'
      } else {
        //歌曲icon
        return 'icon-music'
      }
    },
    search() {
      this.page=1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0,0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code == ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
        
        }
      })
    },
    _checkMore(data) {
      //是否有更多数据
      const song = data.song
      if (!song.list.length ||
        song.totalnum <= (song.curpage * perpage + song.curnum)) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []

      if (data.zhida && data.zhida.singerId) {
        ret.push({
          ...data.zhida,
          // ...{
          //   type: TYPE_SINGER
          // }
        })

      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  },
  watch: {
    query() {
      //当query值改变时调用seach重新请求数据
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
