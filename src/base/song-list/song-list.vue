<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">
        <div class="rank only" v-show="rank">
          <span :class="getRankCls(index)">{{index+1}}</span>
        </div>
        <div class="rank" v-show="!rank">
          <span>{{index+1}}</span>
        </div>
        <div class="content">
          <div>
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">
              {{getDesc(song)}}
            </p>
          </div>
          <i class="icon-play-mini"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      },

    },
    methods: {
      getRankCls(index) {
        if (index < 3) {
          // 前三名显示奖杯图片
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      getDesc(song) {
        return `${song.singer} - ${song.album}`
      }
    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 10px
        text-align: center
        color: $color-text-ll
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0, &.icon1, &.icon2
            color: $color-theme
            font-size: $font-size-large
        .text
          color: $color-text
          font-size: $font-size-large
      .content
        font-size: $font-size-small-x
        display: flex
        flex: 1
        line-height: 20px
        overflow: hidden
        justify-content: space-between;
        align-items: center;
        :first-child
          max-width: 85%;
        .icon-play-mini
          font-size: $font-size-large-x
          color: $color-theme
        .name
          no-wrap()
          color: $color-text-d
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text
          font-size: $font-size-small
</style>
