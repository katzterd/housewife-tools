// ==UserScript==
// @name         HoseWife Tools
// @namespace    https://www.0chan.pl/userjs/
// @version      0.0.0
// @description  UX extension for 314n.org
// @updateURL    https://github.com/juribiyan/0chan-utilities/raw/master/src/housewife-tools.meta.js
// @author       Snivy
// @include      https://314n.org/*
// @grant        GM_getResourceText
// @icon         https://raw.githubusercontent.com/juribiyan/housewife-tools/master/icon.png
// @resource     baseCSS https://raw.githubusercontent.com/Juribiyan/housewife-tools/master/css/hwt.css
// ==/UserScript==


/*-------------------------------- Routing ---------------------------------*/
const MO = new MutationObserver(observe)
function observe(mutationList, observer) {
  for (const mutation of mutationList) {
    // console.log(mutationList)
    if (mutation.type == 'childList' &&
      mutation.target.id == 'content' &&
      [].find.call(mutation.addedNodes, i => i?.classList?.contains('content'))
    ) {
      determineState()
    }
  }
}
MO.observe(document.querySelector('#content'), {subtree: true, childList: true})

function determineState() {
  let content = document.querySelector('.content')
  if (!content) {
    handleIndex()
    return
  }
  let headLine = getHeadLine(content)
  let [m, boardID, boardName, threadID] = headLine[0].textContent.match(/\[([0-9]+)\](?:\s*(.+?)[\s]{2,}\[([0-9]+)\])?/m) || [0,0,0,0]
  if (m) {
    if (boardName && threadID) {
      handleRoute('topic', content)
    }
    else {
      handleBoardPage()
    }
  }
  else {
    handleBoardList()
  }
}

function handleRoute(type) {
  console.log('route=', type)
}

function getHeadLine(content=document.querySelector('.content')) {
  let index = 0, ret = []
  for (let node of content.childNodes) {
    if (node.nodeName == 'BR') {
      if (index==0) continue;
      else break;
    }
    ret.push(node)
    index++
  }
  return ret
}

determineState() // initial routing


/*-------------------------- App state handlers ----------------------------*/
function handleIndex() {
  let c = document.querySelector('#content')
  , lastBr = c.querySelector('br:last-of-type')
  lastBr.insertAdjacentHTML('afterend', `
    <div class="hwt-menu">
      <span class="hwt-cmdlink hwt-btn" data-command="BOARDS">boards</span>
    </div>
  `)
}
 
function handleBoardList() {
  document.querySelectorAll('.pendant').forEach(p => {
    let b = p.previousSibling
    if (b.nodeName!='#text') return;
    let n = b.textContent.match(/^\[([0-9]+)\]/)?.[1]
    if (n) {
      makeClickable(b, `BOARD -n ${n}`)
    }
  })
}

function handleBoardPage() {
  document.querySelectorAll('.postsnumber').forEach(p => {
    let n = p.textContent.match(/\[(.+)\]/)?.[1]
    if (n)
      makeClickable(p, `TOPIC -n ${n}`)
  })
}


/*---------------------------------- CSS -----------------------------------*/
var injector = {
  inject: function(alias, css, position="beforeend") {
  var id = `injector:${alias}`
  var existing = document.getElementById(id)
  if(existing) {
    existing.innerHTML = css
    return
  }
  var head = document.head || document.getElementsByTagName('head')[0]
  head.insertAdjacentHTML(position, `<style type="text/css" id="${id}">${css}</style>`)
  },
  remove: function(alias) {
  var id = `injector:${alias}`
  var style = document.getElementById(id)
  if (style) {
    var head = document.head || document.getElementsByTagName('head')[0]
    if(head)
      head.removeChild(document.getElementById(id))
    }
  }
}

const baseCSS = GM_getResourceText("baseCSS")
injector.inject('hwt', baseCSS)


/*--------------------------- General utilities ----------------------------*/
EventTarget.prototype.delegateEventListener = function(types, targetSelectors, listener, options) {
  if (! (types instanceof Array))
    types = types.split(' ')
  if (! (targetSelectors instanceof Array))
    targetSelectors = [targetSelectors]
  types.forEach(type => {
    this.addEventListener(type, ev => {
      targetSelectors.some(selector => {
        if (ev.target.matches(selector)) {
          listener.bind(ev.target)(ev)
          return true
        }
      })
    }, options)
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


/*------------------------- App-specific utilities -------------------------*/
// Turns a text node into a "link"
function makeClickable(node, command) {
  let span = document.createElement('span')
  span.dataset.command = command
  span.classList.add('hwt-cmdlink')
  span.textContent = node.textContent
  node.replaceWith(span)
}
// Auto-inputting commands
document.body.delegateEventListener('click', '.hwt-cmdlink', async function() {
  let command = this.dataset.command
  , cmdLine = document.querySelector('#cmd')
  if (command && cmdLine) {
    command = command.split('')
    let ch
    while(ch = command.shift()) {
      await sleep(20).then(() => {
        cmdLine.value += ch
      })
    }
    await sleep(300).then(() => {
      cmdLine.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13})) // Simulatie pressing Enter
    })
  }
})