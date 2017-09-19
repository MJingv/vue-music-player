export const commonParams = {
  g_tk: 2039973851,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp',
}

export const options = {
  param: 'jsonpCallback'
}

export const options1 = {
  //修复bug：歌单推荐jsonp的要指定特定prefix
  param: 'jsonpCallback',
  prefix: 'playlistinfoCallback'
}

export const ERR_OK = 0
