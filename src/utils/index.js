import { format } from 'date-fns'

const snakeToPascal = (str) => {
  str += ''
  str = str.split('_')

  function upper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length)
  }

  for (var i = 0; i < str.length; i++) {
    var str2 = str[i].split('/')
    for (var j = 0; j < str2.length; j++) {
      str2[j] = upper(str2[j])
    }
    str[i] = str2.join('')
  }
  return str.join('')
}

const formatDate = (d, dateFormat = 'MM/dd/yyyy') => {
  return format(d, dateFormat)
}

const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const kebab = (str) => {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const toggleFullScreen = () => {
  let doc = window.document
  let docEl = doc.documentElement

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl)
  } else {
    cancelFullScreen.call(doc)
  }
}

const getCookie = (name) => {
  return (
    (name = (document.cookie + ';').match(new RegExp(name + '=.*;'))) &&
    name[0].split(/=|;/)[1]
  )
}

const clearCookie = () => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

// getPath()

export {
  randomElement,
  toggleFullScreen,
  formatDate,
  kebab,
  getCookie,
  clearCookie,
  snakeToPascal,
}
