<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div v-if="recommends.length" class=" slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href='item.linkUrl'>
                <img class="needsclick" :src='item.picUrl' @load="loadImage"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="newest-list">
          <h1 class="list-title">最新歌曲</h1>
            <slider v-for="item in topList" class="list-group" interval=3000>
              <li class="song" v-for="(song,index) in item.songList">
                <span>{{` ${song.songname} - ${song.singername}`}}</span>
                <span></span>
              </li>
              <li class="song" v-for="(song,index) in item.songList">
                <span>{{` ${song.songname} - ${song.singername}`}}</span>
                <span></span>
              </li>
            </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">推荐歌单</h1>
          <ul class="item-group">
            <li v-for="item in discList" class="item" @click="selectItem(item)">
              <h2 class="name" v-html=item.creator.name></h2>
              <div class="icon">
                <img v-lazy="item.imgurl" width="100" height="100"/>
              </div>
              <p class=" desc " v-html="item.dissname"></p>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>


<script type="text/ecmascript-6">
  import {
    getRecommend,
    getDiscList
  } from 'api/recommend'
  import {
    ERR_OK
  } from 'api/config'
  import {
    mapMutations
  } from 'vuex'

  import {
    getTopList
  } from 'api/rank'

  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {
    playlistMixin
  } from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: [],
        topList: [],
      }
    },


    created() {
      this._getRecommend()
      this._getDiscList()
      this._getTopList()

    },

    methods: {
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })

      },

      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },

      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {

            this.discList = res.data.list
          }

        })
      },
      loadImage() {
        //知道一张图片就可以

        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      ...mapMutations(
        {setDisc: 'SET_DISC'}
      )

    },

    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .list-title
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
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .newest-list
        .list-group
          color:  $color-text-d
          font-size: $font-size-small
          background: $color-highlight-background
      .recommend-list
        .item-group
          display: flex;
          flex-wrap: wrap;
          .item
            position: relative
            display: flex
            flex-direction: column
            box-sizing: border-box
            align-items: center
            margin: 0 10px 10px 10px
            .name
              position absolute
              right: 0
              color: $color-background
              font-size: $font-size-small-s
            .desc
              color: $color-text-d
              font-size: $font-size-small-s
              overflow: hidden
              max-width: 100px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
