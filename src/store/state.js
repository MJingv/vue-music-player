import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'
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
  searchHistory:loadSearch()//用本地存储数据去初始化
}
export default state
