import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15


function insertArray(arr, val, compare, maxLen) {
  //将最新数据放在第一位，删除重复数据，保持有限个数据
  const index = arr.findIndex(compare)
  if (index === 0) {
    //如果只有一个数据，且在第一位
    return
  }
  if (index > 0) {
    //如果有重复数据
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    //保持有限个数据，删除旧数据pop
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  //将数据插入到列表中
  storage.set(SEARCH_KEY, searches)
  return searches
}
