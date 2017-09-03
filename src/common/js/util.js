function getRandomInt(min, max) {
  //获得(min,max]随机数
  return Math.floor(min + (max - min + 1) * Math.random())
}

export function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    //交换arr[i]与打乱的arr[j]
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}
