<template>
  <div class="m-header">
    <div class="logo"></div>
    <h1 class="text">Wolverine Music Player</h1>
    <router-link to="/user" tag="div" class="mine">
      <i class="icon-mine"></i>
    </router-link>
    <router-link to="/search" tag="div" class="search">
      <i class="icon-search"></i>
    </router-link>
  </div>
</template>

<script>

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .logo
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      left: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
    .search
      position: absolute
      top: 0
      right: 0
      .icon-search
        display: block
        padding: 10px
        font-size: 25px
        color: $color-theme

</style>
