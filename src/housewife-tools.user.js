// ==UserScript==
// @name         HouseWife Tools
// @namespace    https://www.0chan.pl/userjs/
// @version      1.0.0
// @description  UX extension for 314n.org
// @updateURL    https://github.com/juribiyan/0chan-utilities/raw/master/src/housewife-tools.meta.js
// @author       Snivy
// @include      https://314n.org/*
// @include      https://314n.ru/*
// @grant        GM_getResourceText
// @icon         https://raw.githubusercontent.com/juribiyan/housewife-tools/master/icon.png
// @resource     baseCSS https://raw.githubusercontent.com/Juribiyan/housewife-tools/master/css/hwt.css
// ==/UserScript==


/*-------------------------------- Routing ---------------------------------*/
const MO = new MutationObserver(observe)
function observe(mutationList, observer) {
  for (const mutation of mutationList) {
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
  setBlur(0)
  if (queuedCommand) {
    runCommand(...queuedCommand)
  }

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
    runCommand(`BOARDS`, {skipHistory: true})
  }
  else if(!isNaN(+board)) {
    if (!isNaN(+topic)) {
      runCommand(`TOPIC -n ${topic}${!isNaN(+topicPage) ? ` -p ${topicPage}` : ''}`, {skipHistory: true})
    }
    else {
      runCommand(`BOARD -n ${board}${!isNaN(+boardPage) ? ` -p ${boardPage}` : ''}`, {skipHistory: true})
    }
  }
}
window.addEventListener('hashchange', ev => {
  let hash = new URL(ev.newURL)?.hash
  if (hash) {
    handleHash(hash)
  }
})

handleIndex()

if (document.location.hash) {
  handleHash(document.location.hash)
}

var historySkip = 0 // runCommand() increments this in cases when a command is initiated by a hashchange or concatenated command;
function pushHistoryState(state, url) {                  // this prevents pushing a state when unnecessary, preserving navigation.
  if (historySkip > 0) {
    historySkip--
  }
  else {
    window.history.pushState(state, '', url)
  }
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
      <button class="hwt-btn hwt-action hwt-guests-only" data-action="register" >register</button>
      <button class="hwt-btn hwt-cmdlink" data-command="HELP" data-noload="true">help</button>
      <button class="hwt-btn hwt-cmdlink hwt-members-only" data-command="LOGOUT" data-noload="true">logout</button>
    </div>`)
}

function handleBoardList() {
  window.history.replaceState({screen: 'board-list'}, '', '#/boards')
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
  let [page, lastPage] = pagination(content)
  pushHistoryState({screen: 'board-page', board: boardID, page: page, lastPage: lastPage}, `#/${boardID}:${page}`)
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', `
    <button class="hwt-cmdlink hwt-btn" data-command="BOARDS">^</button>`)
  content.querySelectorAll('.postsnumber').forEach(p => {
    let n = p.textContent.match(/\[(.+)\]/)?.[1]
    if (n) {
      p.nextElementSibling?.querySelector('.pm')?.insertAdjacentHTML('beforebegin', `<button class="hwt-btn hwt-cmdlink" data-command="TOPIC -n ${n} && LAST" title="Last page">&gt;&gt;</button>`)
      makeClickable(p, `TOPIC -n ${n}`)
    }
  })
  content.insertAdjacentHTML('beforeend',
    `<div class="show-topic-form">
      <button class="hwt-action hwt-btn" data-action="newtopicform">new topic</button>
    </div>`)
}

function handleTopic(content, boardID, boardName, topicID) {
  let [page, lastPage] = pagination(content)
  pushHistoryState({screen: 'topic', board: boardID, topic: topicID, page: page, lastPage: lastPage}, `#/${boardID}/${topicID}:${page}`)
  let headLine = getHeadLine(content)
  let html = `<span class="hwt-backlink">
    <button class="hwt-btn hwt-cmdlink" data-command="BOARD -n ${boardID}">^ [${boardID}] ${boardName}</button>
    [${topicID}]
  </span>`
  headLine[0].replaceWith(createElementFromHTML(html))
  // let allPosts = document.querySelectorAll('.posts')
  makePostingForm()
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

function repeatString(char, times) {
  if (times <= 0) return "";
  return new Array(times+1).join(char)
}

function randomIntBetween(min = 0, max = 100) {
  // find diff
  let difference = max - min;
  // generate random number 
  let rand = Math.random();
  // multiply with difference 
  rand = Math.floor(rand * difference);
  // add with min value 
  rand = rand + min;
  return rand;
}


/*------------------------- App-specific utilities -------------------------*/
// Turns a text node into a "link"
function makeClickable(node, command) {
  node.replaceWith(createElementFromHTML(`<button class="hwt-cmdlink" data-command="${command}">${node.textContent}</button>`))
}
// Auto-inputting commands
document.body.delegateEventListener(['click', 'input'], '.hwt-cmdlink', async function() {
  let command = this.dataset.command
  , noLoad = this.dataset.noload=="true"
  , skipHistory = this.dataset.skiphistory=='true'
  if (command) {
    command = command.split('&&')
    if (command.length > 1) {
      let last = command.pop()
      command = [command.join('&&'), last]
    }
    runCommand(command, {load: !noLoad, skipHistory: skipHistory})
  }
})

var queuedCommand = null;
async function runCommand(command, {load = true, skipHistory = false} = {}) {
  let cmdLine = document.querySelector('#cmd')
  if (!cmdLine) return;
  let [thisCommand, nextCommand] = (command instanceof Array) ? command : [command]
  if (nextCommand) {
    queuedCommand = [nextCommand, {load: load, skipHistory: skipHistory}]
    skipHistory = true
  }
  else {
    queuedCommand = null
  }
  if (skipHistory) {
    historySkip++
  }
  cmdLine.value = thisCommand
  cmdLine.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13})) // Simulatie pressing Enter
  if (load)
    setBlur(true)
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
            runCommand(`${action} -u ${login.value} -p ${password.value}`, {load: false})
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
  if (found) { // Copy pagination to bottom
    content.insertAdjacentHTML('beforeend', html)
    return [current, total]
  }
}

/*function isPathInView() { // dirty
  return ((document.querySelector('#path').getBoundingClientRect().bottom - document.querySelector('#wrapper').getBoundingClientRect().bottom) < 96)
}*/

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
    runCommand(`LOGIN -u ${login} -p ${password}`, {load: false})
  }
  // Logout
  if (type == 'message' && message == 'You have been logged out') {
    document.querySelector('.hwt-menu').classList.add('hwt-guest')
  }
}

// Keyboard navigation
document.addEventListener("keydown", ev => {
  if (ev.ctrlKey && ~['board-page','topic'].indexOf(window.history?.state?.screen)) {
    if (ev.key == 'ArrowLeft' && window.history.state.page > 1) {
      runCommand('PREV')
    }
    if (ev.key == 'ArrowRight' && window.history.state.page < window.history.state.lastPage) {
      runCommand('NEXT')
    }
    if (ev.key == 'ArrowUp') {
      ev.preventDefault()
      if (window.history.state.screen == 'board-page') {
        runCommand('BOARDS')
      }
      if (window.history.state.screen == 'topic') {
        runCommand(`BOARD -n ${window.history.state.board}`)
      }
    }
    if (ev.key == 'Enter' && ~document.activeElement.id.indexOf('hwt-pf')) {
      if(document.querySelector('#hwt-pf-title'))
        actions.newtopic()
      else
        actions.reply()
    }
  }
  else {
    let sc = document.querySelector('.scrollcontent')
    if (ev.key == 'PageUp') {
      sc.scrollTop = 0
    }
    if (ev.key == 'PageDown') {
      sc.scrollTop = sc.scrollHeight
    }
  }
})

function setLogo() {
  let ver = 'v.' + GM_info.script.version
  , verSpace = (15 - ver.length)/2
  , verStr = repeatString(' ', Math.ceil(verSpace)) + ver + repeatString(' ', Math.floor(verSpace))
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

function makePostingForm(withTitle = false) {
  let html = `
    <div id="hwt-posting-form" style="visibility:hidden">
      <div class="hwt-textarea-wrapper${withTitle ? ' hwt-tc-with-title' :''}">
        <div class="hwt-textarea-border"></div>
        ${withTitle ? `<input id="hwt-pf-title" type="text" class="hwt-txt-input hwt-title-input" placeholder="Title...">` :''}
        <textarea id="hwt-pf-textarea" style="resize:false" rows="3" class="hwt-txt-input hwt-msg-area"${withTitle ? ` placeholder="Message..."` :''}></textarea>
      </div>
      <div class="hwt-reply-button-wrapper">
        ${withTitle
          ? `<button class="hwt-btn hwt-action" data-action="newtopic">post</button>`
          : `<button class="hwt-btn hwt-action" data-action="reply">reply</button>`
        }
      </div>
    </div>`
  document.querySelector('.content').insertAdjacentHTML('afterend', html)

  let form = document.querySelector('#hwt-posting-form')
  , wr = form.querySelector('.hwt-textarea-wrapper')
  , border = wr.querySelector('.hwt-textarea-border')
  , textarea = wr.querySelector('textarea')
  
  let updateBorders = () => {
    // Determine the character dimensions
    border.textContent = repeatString("-", 10) // for better subpixel precision in Chrome
    let charWidth = border.offsetWidth / 10
    , charHeight = border.offsetHeight

    injector.inject('hwt-postingform-margins', `
      .hwt-textarea-wrapper .hwt-txt-input {
        border-width: ${charHeight}px ${charWidth*2}px
      }
      ${withTitle ? `.hwt-msg-area {
        border-top-width: 0!important;
      }` :''}`
    )

    let w = Math.floor(wr.offsetWidth / charWidth)
    , h = Math.round(wr.offsetHeight / charHeight)

    let head = "," + repeatString("–", w-2) + ".<br>"
    , line = "|" + repeatString("&nbsp;", w-2) + "|<br>"
    , tail = "`" + repeatString("–", w-2) + "'"

    if (!withTitle) {
      border.innerHTML = head + repeatString(line, h-2) + tail
    }
    else {
      let divider = "}" + repeatString("-", w-2) + "{<br>"
      border.innerHTML = head + line + divider + repeatString(line, h-4) + tail
    }
  }
  let debounceTimeout, ro;
  let debouncedResizeHandler = (ev) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      if (!form.parentNode) {
        ro.disconnect()
        return;
      }
      updateBorders()
    }, 10)
  }
  ro = new ResizeObserver(debouncedResizeHandler)
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      debouncedResizeHandler()
      ro.observe(textarea)
      form.style.visibility = 'visible'
    })
  }, 200)
  textarea.addEventListener("input", ev => {
    textarea.rows = Math.max(textarea.value.split(/\n/).length, 3)
  })
}

actions.reply = () => {
  let msg = document.querySelector('#hwt-pf-textarea')?.value
  if (msg)
    runCommand([`REPLY -m ${msg}`, `LAST`])
}
actions.newtopic = () => {
  let title = document.querySelector('#hwt-pf-title')?.value
  , content = document.querySelector('#hwt-pf-textarea')?.value
  if (title && content)
    runCommand(`NEWTOPIC -t ${title} -c ${content}`)
}
actions.newtopicform = () => {
  document.querySelector('.show-topic-form')?.remove()
  makePostingForm(true)
}

var animationRun;

function setBlur(toggle=true) {
  let wr = document.querySelector('#wrapper')
  if (toggle) {
    wr.classList.add('hwt-blurred')
    startAnimation()
  }
  else {
    wr.classList.remove('hwt-blurred')
    setTimeout(() => clearInterval(animationRun), 210)
  }
}

function startAnimation(speed=40, size=6) {
  let loader
  while (!(loader = document.querySelector('.hwt-loading-animation'))) {
    document.querySelector('#wrapper').insertAdjacentHTML('afterbegin', '<div class="hwt-loading-animation"></div>')
  }
  let makeLine = function() {
    let line = ''
    for(let i=0; i<(size*2); i++) {
      line += String.fromCharCode(randomIntBetween(0x2800, 0x28ff)) // Braille block
    }
    return line + '<br>'
  }
  let lines = []
  for(let i=0; i<size; i++) {
    lines.push(makeLine())
  }
  loader.innerHTML = lines.join('')

  animationRun = setInterval(() => {
    lines.shift()
    lines.push(makeLine())
    loader.innerHTML = lines.join('')
  }, speed)
}


