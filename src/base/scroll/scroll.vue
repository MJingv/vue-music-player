<template>
<div ref="wrapper">
  <slot>

  </slot>

</div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1

    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {

    setTimeout(() => {
      //确保dom已经渲染
      this._initScroll()

    }, 20)

  },

  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if(this.listenScroll){
        let me = this //vue实例的this
        this.scroll.on('scroll',(pos)=>{
          me.$emit('scroll',pos)
        })

      }
    },
    enabled() {
      this.scroll && this.scroll.enabled()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      //调用apply传入参数
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)

    },


  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }

}
</script>
