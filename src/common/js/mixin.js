import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
export const playlistMixin = {
  //修复mini播放器影响list的滚动高度bug
  computed: {
    ...mapGetters(['playlist'])
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
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },
    ...mapGetters([

      'playlist',
      'currentSong',

      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        console.log(list + 'old');
        list = shuffle(this.sequenceList)
        console.log(list + 'new');
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)

      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      //保证切换播放模式不变当前播放的歌曲
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({setPlayingState: 'SET_PLAYING_STATE', setCurrentIndex: 'SET_CURRENT_INDEX', setPlayMode: 'SET_PLAY_MODE', setPlaylist: 'SET_PLAYLIST'})
  }
}

export const searchMixin = {
  data() {
    return {query: ''}
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}
