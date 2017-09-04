import {
  mapGetters
} from 'vuex'

export const playlistMixin = {
  //修复mini播放器影响list的滚动高度bug
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    //dom ready时触发
    this.handlePlaylist(this.playlist)
  },
  activated() {
    //keep-alive切换时触发
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }

  },


}
