<template>
<transition name="slide">
  <music-list :bgImage="bgImage" :title="title" :songs="songs" rank="rank" ></music-list>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {
  ERR_OK
} from 'api/config'
import {
  mapGetters
} from 'vuex'
import {
  getMusicList
} from 'api/rank'
import {
  createSong
} from 'common/js/song'

export default {
  computed: {
    bgImage() {
      if (this.songs.length) {
        //让列表先渲染完毕再判断！！！！
        return this.songs[0].image
      } else {
        return ''
      }

    },
    title() {
      return this.topList.topTitle
    },
    ...mapGetters([
      'topList'
    ])

  },
  data() {
    return {
      songs: [],
      rank:true,
    }
  },
  created() {
    this._getMusicList()
  },

  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code == ERR_OK) {
          console.log(res.songlist);
          this.songs = this._normalizeSongs(res.songlist)

        }
      })

    },
    _normalizeSongs(list) {
      let ret = []
      list.map((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }

  },

  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
