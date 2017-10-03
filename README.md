# vue-test-project

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

```

> 各种插件

v-lazy  ---  vue图片懒加载
v-router  ---  vue路由
vuex  ---  vue数据管理


axios  ---  抓取数据
better-scroll  ---  优化移动端滚动事件
create-keyframe-animation  ---  利用js钩子实现动画，用js实现css3的效果
js-base64  ---  解析base64歌词编码
lyric-parser  ---  将歌词数据转换成被解析的类
good-storage  ---  封装localStorage
```


```
基础组件
  ...


业务组件
music-list  ---  封装css3各浏览器等prefixStyle 
                 优化歌手歌曲列表的bg-img的scale放大缩小、blur动态高斯模糊、动态旋转隐藏信息等交互操作

                 
  
  
页面实现：

recommend-page  ---  自定义首页轮播图、复用music-list组件展示热门歌单推荐、实现对应路由跳转
                     

player-page ---  有全屏播放器和mini播放器
            播放、暂停、前进、后退、播放模式选择等功能
            
            增加各种炫酷动画交互效果：大小屏飞入弹出、切换渐变移动等
            vue-transtion动画钩子
            create-keyframe-animation（js钩子实现css3动画）
            css3 animation和transition
            
            歌词部分：解析歌词为正确格式并使歌词跟随音乐播放实时滚动
            

            修复连续切换出现无法显示的bug（url没有ready）
        
rank-page  ---   复用music-list组件，从props传值，增加rank独有样式

search-page  ---  包含 search-box & suggest
                  suggeset优化 
                    1.没有搜索结果时显示no-result
                    2.连续请求使用节流函数debounce
                    3.输入完搜索调用scrolllist，继续滑动时关闭键盘，使输入框失去焦点

基础组件

no-result  ---   如果没有搜索结果，显示相应提示，提高用验


```
