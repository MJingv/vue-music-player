<template>
<scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
  <slot>
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="i in group.items" class="list-group-item">
            <img v-lazy="i.avatar" class="avatar" />
            <span class="name">{{i.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutlist" class="item" :data-index="index" :class="{'current':currentIndex === index }">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </slot>
<div v-show = "!data.length" class="loading-container">
  <loading></loading>
</div>
</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {
  getData
} from 'common/js/dom'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30


export default {
  created() {
    //不需要观测变化的值
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3 //当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
  },
  mounted() {
    // console.log(this.listHeight);
  },

  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    }

  },
  props: {
    data: {
      type: Array,
      default: []
    },

  },
  computed: {
    shortcutlist() {
      return this.data.map((i) => { //只取第一个字
        return i.title.substring(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }

  },
  methods: {
    onShortcutTouchStart(e) {
      // console.log(e.target.getAttribute('data-index'));
      let anchorIndex = getData(e.target, 'index')
      //获取第一个手势的位置
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      //滑动扫过的item个数
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 //向下取整
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)

    },
    scroll(pos) {
      //实时获取y轴位置
      this.scrollY = pos.y

    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        //如果index为nullor0
        return
      } else if (index > this.listHeight.length - 2) {
        //超出最大则手动设置为listhight最大值
        index = this.listHeight.length - 2
      }
      //高亮定位到对应位置
      this.scrollY = -this.listHeight[index]
      //点击右边shortcut定位到listGroup对应到位置
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) //缓存动画时间为0
    },
    _calculateHeight() {
      //保存每个listgroup的高度
      const list = this.$refs.listGroup

      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },

  },
  watch: {
    data() {
      //确保dom已经渲染完
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      //传入pos
      const listHeight = this.listHeight
      //当滚动到顶部 nowY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      //当nowy在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && (-newY) < height2) {
          //在2个item之间，返回位置是i
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      //当nowy滚到底部,>最后元素的上限
      this.currentIndex = listHeight.length - 2

    },
    diff(newVal) {
      let fixedTop =  (newVal && newVal < TITLE_HEIGHT) ?
        newVal - TITLE_HEIGHT :
        0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      //开启3d gpu加速


    },
  },
  components: {
    Scroll,
    Loading,
  },
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
