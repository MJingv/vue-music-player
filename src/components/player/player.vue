<template>
  <div class="player" v-show="playlist.length>0">
    <transition name='normal' @enter='enter' @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref='middleL'>
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="bar" :class="cdCls">
                <img class="image" src="./bar.png">
              </div>
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref='lyricLine' class="text" :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">

          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition naem='mini'>
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 固定在底部的迷你播放器 -->
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>

        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" @click.stop="togglePlaying" class="icon-mini"></i>
          </progress-circle>

        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import Lyric from 'lyric-parser'
  import animations from 'create-keyframe-animation'
  import {
    prefixStyle
  } from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {
    playMode
  } from 'common/js/config'
  import {
    shuffle
  } from 'common/js/util'
  import Scroll from 'base/scroll/scroll'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Playlist from 'components/playlist/playlist'
  import {
    playerMixin
  } from 'common/js/mixin'


  const transform = prefixStyle("transform")
  const transitionDuration = prefixStyle("transitionDuration")

  export default {
    mixins: [playerMixin,],
    components: {
      Scroll,
      ProgressBar,
      ProgressCircle,
      Playlist,
    },
    data() {
      return {
        //与dom有映射 可得到getter、setter
        playingLyric: '',
        currentLineNum: 0,
        currentLyric: null,
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentShow: 'cd',
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      showPlaylist() {
        this.$refs.playlist.show()
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            //异步获取歌词可能会导致一个歌曲多个歌词，如果当前歌曲歌词！==获得的歌词，则说明不同步，直接return
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          //如果获取歌词失败
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({
                    lineNum,
                    txt
                  }) {
        // this hanlder called when lineNum change
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          //保持高亮歌词在屏幕中间
          let lineEl = this.$refs.lyricLine[lineNum - 5] //歌词p标签
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt //当前歌词的展示
      },
      end() {
        if (this.mode === playMode.loop) {
          //直接修改当前时间为0再播放实现单曲循环
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        } else {
          this.next()
        }
      },
      onProgressBarChange(percent) {
        const currentTime = percent * this.currentSong.duration
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          //使暂停拉动之后默认开启播放模式
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      format(interval) {
        interval = interval | 0
        let minute = interval / 60 | 0
        let second = (interval % 60 + '').padStart(2, '0')
        return `${minute}:${second}`
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      error() {
        //如果歌曲出现错误，直接赋值以免影响之后操作
        this.songReady = true
      },
      ready() {
        //避免快速点击触发dom异常
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }

          this.songReady = false
        }
      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      enter(el, done) {
        //从mini进入播放全屏的放大+移动效果动画
        const {
          x,
          y,
          scale
        } = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          },
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear',
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        //从全屏到mini播放器的移动效果动画
        this.$refs.cdWrapper.style.transition = "all 0.4s"
        const {
          x,
          y,
          scale
        } = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)

      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''

      },
      _getPosAndScale() {
        const targetWidth = 40 //mini-player的img宽度
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8 //cd宽度
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = (window.innerHeight / 2 - paddingTop - width / 2 - paddingBottom)
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
      }),
      ...mapActions(['savePlayHistory'])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (oldSong.id === newSong.id) {
          return
        }
        if (this.currentLyric) {
          //切换歌曲时清除定时器
          this.currentLyric.stop()
        }
        //微信后台调用bug修复
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          //dom完成后的回调
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      ...mapGetters([
        'currentIndex',
        'fullScreen',
        'playing'
      ])
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-background
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-background
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .bar
              position: absolute
              top: 0
              right: 0
              z-index 5
              transform-origin:100% 0%;
              &.play
                animation:1s movein  ease-in-out forwards
              &.pause
                animation:1s moveout  ease-in-out forwards
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 40px solid rgba(0, 0, 0, 0.2)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          vertical-align: top
          width: 100%
          height: 200px
          overflow: hidden
          margin 30px 0
          background-color: $color-highlight-background
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-theme
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

  @keyframes moveout
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(-30deg)
  @keyframes movein
    0%
        transform: rotate(-30deg)
    100%
       transform: rotate(0deg)

</style>
