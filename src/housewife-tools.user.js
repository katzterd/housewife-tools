// ==UserScript==
// @name         HouseWife Tools
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
      mutation.target.id == 'content'
    ) {
      if ([].find.call(mutation.addedNodes, i => i?.classList?.contains('content'))) {
        determineState()
      }
      else {
        let msg = [].find.call(mutation.addedNodes, i => i?.classList?.contains('error') || i?.classList?.contains('message'))
        if (msg) {
          handleMessage(msg.className, msg.textContent)
        }
      }
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
  let [m, boardID, boardName, topicID] = parseHeadLine(getHeadLine(content))
  if (m) {
    if (boardName && topicID) {
      handleTopic(content, boardID, boardName, topicID)
    }
    else {
      handleBoardPage(content, boardID)
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

function parseHeadLine(headLine=getHeadLine(content)) {
  let headLinePattern = /\[([0-9]+)\](?:\s*(.+?)[\s]{2,}\[([0-9]+)\])?/m
  return headLine?.[0].textContent.match(headLinePattern) || [0,0,0,0]
}

function handleHash(hash) {
  let [board, boardPage, topic, topicPage] = hash.match(/^#(?:\/([0-9]+|[^\/\:\s]*))?(?:\:([0-9]+|))?(?:\/([0-9]+|))?(?:\:([0-9]+|))?/).slice(1)
  if (board == 'boards') {
    runCommand(`BOARDS`, true, false)
  }
  else if(!isNaN(+board)) {
    if (!isNaN(+topic)) {
      runCommand(`TOPIC -n ${topic}${!isNaN(+topicPage) ? ` -p ${topicPage}` : ''}`, true, false)
    }
    else {
      runCommand(`BOARD -n ${board}${!isNaN(+boardPage) ? ` -p ${boardPage}` : ''}`, true, false)
    }
  }
}
window.addEventListener('hashchange', ev => {
  let hash = new URL(ev.newURL)?.hash
  if (hash) {
    handleHash(hash)
  }
})

if (document.location.hash) {
  handleHash(document.location.hash)
}
else {
  handleIndex()
}

var pushNextState = false // runCommand() sets this to true in cases when a command is initiated by hashchange, this prevents pushing a state when unnecessary, preserving navigation
function pushHistoryState(state, url) {
  if (pushNextState)
    window.history.pushState(state, '', url)
}

/*-------------------------- App state handlers ----------------------------*/
function handleIndex() {
  setLogo()
  let c = document.querySelector('#content')
  , isLoggedIn = [].find.call(content.childNodes, node => (node.nodeName=="#text" && node.textContent.indexOf('You are logged in')==0))
  , lastBr = c.querySelector('br:last-of-type')
  lastBr.insertAdjacentHTML('afterend', `
    <div class="hwt-menu ${!isLoggedIn ? ` hwt-guest` : ''}">
      <button class="hwt-btn hwt-cmdlink hwt-members-only" data-command="BOARDS">boards</button>
      <button class="hwt-btn hwt-action hwt-guests-only" data-action="login">login</button>
      <button class="hwt-btn hwt-action hwt-guests-only" data-action="register">register</button>
      <button class="hwt-cmdlink hwt-btn" data-command="HELP">help</button>
      <button class="hwt-btn hwt-cmdlink hwt-members-only" data-command="LOGOUT">logout</button>
    </div>`)
}

function handleBoardList() {
  window.history.replaceState({page: 'boards'}, '', '#/boards')
  document.querySelectorAll('.pendant').forEach(p => {
    let b = p.previousSibling
    if (b.nodeName!='#text') return;
    let n = b.textContent.match(/^\[([0-9]+)\]/)?.[1]
    if (n) {
      makeClickable(b, `BOARD -n ${n}`)
    }
  })
}

function handleBoardPage(content, boardID) {
  let page = pagination(content)
  pushHistoryState({page: 'board', board: boardID}, `#/${boardID}:${page}`)
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', `
    <button class="hwt-cmdlink hwt-btn" data-command="BOARDS">^</button>`)
  content.querySelectorAll('.postsnumber').forEach(p => {
    let n = p.textContent.match(/\[(.+)\]/)?.[1]
    if (n)
      makeClickable(p, `TOPIC -n ${n}`)
  })
}

function handleTopic(content, boardID, boardName, topicID) {
  let page = pagination(content)
  pushHistoryState({page: 'topic', board: boardID, topic: topicID}, `#/${boardID}/${topicID}:${page}`)
  let headLine = getHeadLine(content)
  let html = `<span class="hwt-backlink">
    <button class="hwt-btn hwt-cmdlink" data-command="BOARD -n ${boardID}">&lt; [${boardID}] ${boardName}</button>
    [${topicID}]
  </span>`
  headLine[0].replaceWith(createElementFromHTML(html))
  // let allPosts = document.querySelectorAll('.posts')
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

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}


/*------------------------- App-specific utilities -------------------------*/
// Turns a text node into a "link"
function makeClickable(node, command) {
  node.replaceWith(createElementFromHTML(`<button tabindex="0" class="hwt-cmdlink" data-command="${command}">${node.textContent}</button>`))
}
// Auto-inputting commands
document.body.delegateEventListener(['click', 'input'], '.hwt-cmdlink', async function() {
  let command = this.dataset.command
  if (command) {
    runCommand(command)
  }
})

async function runCommand(command, noFrills=!isPathInView(), pushHistory=true) {
  let cmdLine = document.querySelector('#cmd')
  if (cmdLine) {
    pushNextState = pushHistory
    let enter = () => cmdLine.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13})) // Simulatie pressing Enter
    if (!noFrills) {
      command = command.split('')
      let ch
      while(ch = command.shift()) {
        await sleep(15).then(() => {
          cmdLine.value += ch
        })
      }
      await sleep(150).then(enter)
    }
    else {
      cmdLine.value = command
      enter()
    }
  }
}

const actions = {}

function makeLoginForm(action='LOGIN') {
  return (() => {
    document.querySelector('.hwt-login-form')?.remove()
    document.querySelector('.hwt-menu').insertAdjacentHTML('afterend', `<br>
      <div class="hwt-login-form">
        <div class="hwt-login-login">
          <label for="hwt-login">Login:</label>
          <input type="text" id="hwt-login">
        </div>
      </div><br>`)
    let login = document.querySelector('#hwt-login')
    login.focus()
    let passwordAdded = false
    login.addEventListener('keypress', function(ev) {
      if (ev.key == 'Enter' && !passwordAdded) {
        login.insertAdjacentHTML('afterend', `<br>
          <div class="hwt-login-password">
            <label for="hwt-password">Password:</label>
            <input type="password" id="hwt-password">
          </div>
        `)
        passwordAdded = true
        let password = document.querySelector('#hwt-password')
        password.focus()
        password.addEventListener('keypress', function(ev) {
          if (ev.key == 'Enter') {
            runCommand(`${action} -u ${login.value} -p ${password.value}`, true)
          }
        })
      }
    })
  })
}

actions.login = makeLoginForm('login')
actions.register = makeLoginForm('register')

document.body.delegateEventListener('click', '.hwt-action', /*async*/ function() {
  let action = this.dataset.action
  actions[action](this)
})

function pagination(content=document.querySelector('.content')) {
  let html, current, total
  let found = [].find.call(content.childNodes, node => {
    let m
    if (node.nodeName == "#text" && (m = node.textContent.match(/Page ([0-9]+)\/([0-9]+)/)?.slice(1))) {
      [current, total] = m.map(n => +n)
      html =
      `<span class="hwt-pagination">
        ${current > 1 ?
          `<button class="hwt-cmdlink hwt-btn" data-command="FIRST">&lt;&lt;</button>
          <button class="hwt-cmdlink hwt-btn" data-command="PREV">&lt;</button>`
        :''}
        ${node.textContent}
        ${current < total ?
          `<button class="hwt-cmdlink hwt-btn" data-command="NEXT">&gt;</button>
          <button class="hwt-cmdlink hwt-btn" data-command="LAST">&gt;&gt;</button>`
        :''}
      </span>`
      node.replaceWith(createElementFromHTML(html))
      return true
    }
    else return false
  })
  if (found) { // Copy bagination to bottom
    return current
    content.insertAdjacentHTML('beforeend', html)
  }
}

function isPathInView() { // dirty
  return ((document.querySelector('#path').getBoundingClientRect().bottom - document.querySelector('#wrapper').getBoundingClientRect().bottom) < 96)
}

function handleMessage(type, message) {
  //successful login
  if (type == 'message' && message == 'you are logged in') {
    document.querySelector('.hwt-login-form').remove()
    document.querySelector('.hwt-menu').classList.remove('hwt-guest')
  }
  //successful registration -> immediate login
  if (type == 'message' && message == 'you are now registered') {
    let login = document.querySelector('#hwt-login').value
    , password = document.querySelector('#hwt-password').value
    runCommand(`LOGIN -u ${login} -p ${password}`, true)
  }
  // Logout
  if (type == 'message' && message == 'You have been logged out') {
    document.querySelector('.hwt-menu').classList.add('hwt-guest')
  }
}function setLogo() {
  let ver = 'v.' + GM_info.script.version
  , verSpace = (15 - ver.length)/2
  , verStr = Array(Math.ceil(verSpace)  +1).join(' ') + ver + Array(Math.floor(verSpace)  +1).join(' ')
  , logo = [
   "        ,---------------.",
   "    |   |   HouseWife   |",
   "  --+-- |     Tools     |",
   "    |   |" +  verStr + "|",
   "        `---------------'"
  ].map(line => line.replace(/ /g, ' '))
  , node = document.querySelector('#content br:nth-of-type(3)')
  for (let i = 0; i < logo.length; ) {
    if (node.nodeName == '#text') {
      node.textContent += logo[i]
      i++
    }
    node = node.nextSibling
  }
}
