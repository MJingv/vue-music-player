<template>
<ul class="switches">
  <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}" @click="switchItem(index)">
    <span>{{item.name}}</span>
  </li>
</ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)

    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      span
        padding 5px
      &.active span
        border-bottom 2px solid $color-theme
        color: $color-background
</style>
