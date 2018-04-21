import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong (musicData) {
  console.log(musicData)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/C400000Fc2iQ4eBEei.m4a?guid=8892713360&vkey=541E1E16A42EE7FD88406A8B098E8100CBE9EC6AAA838C74AB908BD6FD0A834E23454ADA29EBF8424A24221B92D105ACF2BC6BE6AC0D0484&uin=0&fromtag=38`
    url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=8892713360&vkey=53A36627BD596AF3181AD194F8F7D18952C32DEAAE2143556F55EC33BC7DFDC996F09D76CD21BFF952C36BDB4288E99C43770C88260D3041&uin=0&fromtag=38`

    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=8892713360&vkey=541E1E16A42EE7FD88406A8B098E8100CBE9EC6AAA838C74AB908BD6FD0A834E23454ADA29EBF8424A24221B92D105ACF2BC6BE6AC0D0484&uin=0&fromtag=40`
  })
}

export function createRecomSong (musicData) {
  console.log(musicData)
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.id}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/C400000Fc2iQ4eBEei.m4a?guid=8892713360&vkey=541E1E16A42EE7FD88406A8B098E8100CBE9EC6AAA838C74AB908BD6FD0A834E23454ADA29EBF8424A24221B92D105ACF2BC6BE6AC0D0484&uin=0&fromtag=38`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.mid}.m4a?guid=8892713360&vkey=541E1E16A42EE7FD88406A8B098E8100CBE9EC6AAA838C74AB908BD6FD0A834E23454ADA29EBF8424A24221B92D105ACF2BC6BE6AC0D0484&uin=0&fromtag=40`
    url:`http://dl.stream.qqmusic.qq.com/C400${musicData.mid}.m4a?guid=8892713360&vkey=53A36627BD596AF3181AD194F8F7D18952C32DEAAE2143556F55EC33BC7DFDC996F09D76CD21BFF952C36BDB4288E99C43770C88260D3041&uin=0&fromtag=38`

  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
