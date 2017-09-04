import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = "/api/lyric"

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    pcachetime :+ new Date(),
    songmid: mid,
    g_tk: 611494022,
    hostUin: 0,
    format: 'json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
