<template>
  <transition name="slide">
<div class="singer" ref = 'singer'>
  <div class="back">
    <i class="icon-right" @click='back'></i>
  </div>
  <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
  <router-view></router-view>
</div>
  </transition>
</template>

<script >
import {
  getSingerList
} from 'api/singer'
import {
  ERR_OK
} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {
  mapMutations
} from 'vuex'
import {
  playlistMixin
} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10


export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    back() {
      this.$router.back()
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.singerId}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)

        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((i, index) => {

        if (index < HOT_SINGER_LEN) {
          //热门歌手列表渲染

          map.hot.items.push(new Singer({
            name: i.Fsinger_name,
            id: i.Fsinger_mid,
            singerId: i.Fsinger_id,
          }))
        }

        const key = i.Findex
        if (!map[key]) {
          //如果没有findex则初始化一个新key
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          name: i.Fsinger_name,
          id: i.Fsinger_mid,
          singerId: i.Fsinger_id,
        }))
      })

      //处理map得到有序列表
      let hot = []
      let ret = []

      for (let key in map) {
        let val = map[key]

        if (val.title === HOT_NAME) {
          hot.push(val)
        } else if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret);

    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  },
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer
    position: fixed
    top: 0px
    bottom: 0
    height: 100%;
    width: 100%
    z-index: 200
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      right: 6px
      z-index: 50
      .icon-right
        display: block
        padding: 5px
        font-size: $font-size-large-x
        color: $color-theme
</style>
