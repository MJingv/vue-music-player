<template>
<transition name="slide">
  <music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {ERR_OK} from 'api/config'
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
      return this.topList.picUrl
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
      songs: []
    }
  },
  created() {
    this._getMusicList()
  },

  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then((res) => {
        console.log('dkljfl');
        console.log(res.code);
        if (res.code == ERR_OK) {
          console.log(res + 'jehol');
          // this.songs = this._normalizeSongs(res.data.list)

        }
      })

    },




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
