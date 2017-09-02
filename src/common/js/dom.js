export function addClass(el, className) {

  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  //是否已有存在的class
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el,name,val){
  //获取属性的具体值
  const prefix = 'data-'
  name = prefix +name
  if(val){
    return el.setAttribute(name ,val)
  }else{
    return el.getAttribute(name)
  }
}
