<template>
<transition name="slide">
  <music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
</transition>
</template>
<script >
import {
  ERR_OK
} from 'api/config'
import {
  mapGetters
} from 'vuex'
import {
  getSongList
} from 'api/recommend'
import MusicList from 'components/music-list/music-list'
import {
  createRecomSong
} from 'common/js/song'

export default {
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList()

  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        //回退到singer路由
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code == ERR_OK) {

           console.log(res);
          // this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {

        if (musicData.id && musicData.album.id) {
          ret.push(createRecomSong(musicData))
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
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
