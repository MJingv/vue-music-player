function getRandomInt(min, max) {
  //获得(min,max]随机数
  return Math.floor(min + (max - min + 1) * Math.random())
}

export function shuffle(arr) {
  let _arr = arr.slice()//拷贝原数组
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    //交换_arr[i]与打乱的_arr[j]
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
