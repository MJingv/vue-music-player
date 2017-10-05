import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'
const state = {
  singer: {},
  playing:false,
  fullScreen:false,
  playlist:[],
  sequenceList:[],
  mode:playMode.sequence,
  currentIndex:-1,
  disc:{},
  topList:{},
  searchHistory:loadSearch(),//用本地存储数据去初始化
  playHistory:loadPlay(),//用本地存储数据去初始化
  favoriteList:loadPlay(),
}
export default state
