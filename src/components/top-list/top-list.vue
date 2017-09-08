<template>
<transition name="slide">
  <music-list :bgImage="bgImage":title="title"></music-list>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {
  mapGetters
} from 'vuex'

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
      
    }
  },

  methods: {

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
