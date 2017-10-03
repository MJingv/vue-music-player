//异步操作||对mutation封装(需要多个mutations的复杂操作)
//commit a mutation
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    //找到这首歌在random-list中的索引
    return item.id === song.id
  })
}

export const selectPlay = function({
  commit,
  state
}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function({
  commit
}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}
export const insertSong = function({
  commit,
  state
}, song) {
  //插入一首歌曲，需要改变playlist、currentindex、sequencelist
  let playlist = state.playlist.slice()//不直接修改playlist，修改副本
  let sequenceList = state.sequenceList.slice()//不直接修改playlist，修改副本
  let currentIndex = state.currentIndex
  //记录当前播放的歌曲
  let currentSong = playlist[currentIndex]
  //检查要插入的歌曲是不是在playlist中

  //---修改playlist---
  let fpIndex = findIndex(playlist, song)
  //插入歌曲，索引++
  currentIndex++
  //将这首歌插入到列表
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    //如果已经包含了这首歌,就要删除重复的歌曲
    if (fpIndex < currentIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  //---修改sequenceList---
  let currentSIndex = findIndex(sequenceList,currentSong)+1

  let fsIndex = findIndex(sequenceList,song)

  sequenceList.splice(currentSIndex,0,song)

  if(fsIndex>-1){
    if(currentSIndex>fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex+1,1)
    }
  }

  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)

}

export const saveSearchHistory =function ({commit},query){

  commit(types.SET_SEARCH_HISTORY,saveSearch(query))

}

export const deleteSearchHistory =function({commit},query){

  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))

}

export const clearSearchHistory =function({commit}){
  
  commit(types.SET_SEARCH_HISTORY,clearSearch())

}
