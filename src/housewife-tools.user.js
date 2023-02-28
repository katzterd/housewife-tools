// ==UserScript==
// @name         HouseWife Tools
// @namespace    https://www.0chan.pl/userjs/
// @version      1.1.1
// @description  UX extension for 314n.org
// @updateURL    https://github.com/juribiyan/housewife-tools/raw/master/es5/housewife-tools.meta.js
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
          messageBroker.handle(msg.className, msg.textContent)
        }
      }
    }
  }
}
function reObserve() {
  MO.observe(document.querySelector('#content'), {subtree: true, childList: true})
}


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
  let hl = getHeadLine(content)
  let [m, boardID, boardName, topicID] = parseHeadLine(hl)
  if (m) {
    if (boardName && topicID) {
      handleTopic(content, boardID, boardName, topicID)
    }
    else {
      handleBoardPage(content, boardID)
    }
  }
  else {
    let title = hl?.[0]?.textContent
    if (title == 'The list of existing boards:') {
      handleBoardList(content)
    }
    if (title == 'Revent viewed topics') {
      handleRVT(content)
    }
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

var actions = {}

actions.home = async function(pushHistory=true) {
  setBlur(1)
  let res = await fetch(`/`)
  if (! res.ok) return;
  let htm = await res.text()
  if (!htm) return;
  let dom = document.createRange().createContextualFragment(htm)
  let c = dom.querySelector('#content')
  document.querySelector('#content').replaceWith(c)
  if (pushHistory)
    pushHistoryState({screen: 'index'}, '#/')
  handleIndex()
  setBlur(0)
  reObserve()
}

function handleHash(hash) {
  if (!hash) {
    actions.home(false)
    return;
  }
  let [board, boardPage, topic, topicPage] = hash.match(/^#(?:\/([0-9]+|[^\/\:\s]*))?(?:\:([0-9]+|))?(?:\/([0-9]+|))?(?:\:([0-9]+|))?/).slice(1)
  if (board == '') {
    actions.home(false)
  }
  else if(!isNaN(+board)) {
    if (!isNaN(+topic)) {
      runCommand(`TOPIC -n ${topic}${!isNaN(+topicPage) ? ` -p ${topicPage}` : ''}`, {skipHistory: true})
    }
    else {
      runCommand(`BOARD -n ${board}${!isNaN(+boardPage) ? ` -p ${boardPage}` : ''}`, {skipHistory: true})
    }
  }
  else if (board == 'boards') {
    runCommand(`BOARDS`, {skipHistory: true})
  }
  else if (board == 'rvt') {
    runCommand(`RVT`, {skipHistory: true})
  }
  else {
    console.error('Unhandled hash:', hash)
  }
}
window.addEventListener('hashchange', ev => {
  handleHash(new URL(ev.newURL)?.hash)
})

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
      <button class="hwt-btn hwt-cmdlink hwt-members-only" data-command="RVT" title="Recent viewed topics">recent</button>
      <button class="hwt-btn hwt-cmdlink hwt-members-only" data-command="INVITES" data-noload="true">invites</button>
      <button class="hwt-btn hwt-cmdlink" data-command="DONATE" data-noload="true">donate</button>
      <button class="hwt-btn hwt-action" data-action="hwtinfo" title="About this UserScript">hwt</button>
    </div><br>`)
}

function handleBoardList(content) {
  pushHistoryState({screen: 'board-list'}, '#/boards')
  content.querySelectorAll('.pendant').forEach(p => {
    let b = p.previousSibling
    if (b.nodeName!='#text') return;
    let n = b.textContent.match(/^\[([0-9]+)\]/)?.[1]
    if (n) {
      makeClickable(b, `BOARD -n ${n}`)
    }
  })
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', `
    <button class="hwt-action hwt-btn" data-action="home" title="Home">⌂</button> `)
}

function handleRVT(content) {
  let [page, lastPage] = pagination(content)
  pushHistoryState({screen: 'rvt', page: page, lastPage: lastPage}, '#/rvt')
  content.querySelectorAll('.postsnumber').forEach(p => {
    let n = p.textContent.match(/\[(.+)\]/)?.[1]
    if (n) {
      p.nextElementSibling?.querySelector('.pm')?.insertAdjacentHTML('beforebegin', 
        `<button class="hwt-btn hwt-cmdlink" data-command="TOPIC -n ${n} && LAST" title="Last page">&gt;&gt;</button>`)
      makeClickable(p, `TOPIC -n ${n}`, "First page")
    }
  })
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', `
    <button class="hwt-action hwt-btn" data-action="home" title="Home">⌂</button> `)
}

function handleBoardPage(content, boardID) {
  let [page, lastPage] = pagination(content)
  pushHistoryState({screen: 'board-page', board: boardID, page: page, lastPage: lastPage}, `#/${boardID}:${page}`)
  getHeadLine(content)[0].previousElementSibling.insertAdjacentHTML('afterend', `
    <button class="hwt-cmdlink hwt-btn" data-command="BOARDS" title="To board list">^</button>`)
  content.querySelectorAll('.postsnumber').forEach(p => {
    let n = p.textContent.match(/\[(.+)\]/)?.[1]
    if (n) {
      p.nextElementSibling?.querySelector('.pm')?.insertAdjacentHTML('beforebegin', 
        `<button class="hwt-btn hwt-cmdlink" data-command="TOPIC -n ${n} && LAST" title="Last page">&gt;&gt;</button>`)
      makeClickable(p, `TOPIC -n ${n}`, "First page")
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
    <button class="hwt-btn hwt-cmdlink" data-command="BOARD -n ${boardID}" title="To board #${boardID} (${boardName})">^ [${boardID}] ${boardName}</button>
    [${topicID}]
  </span>`
  headLine[0].replaceWith(createElementFromHTML(html))
  postingForm.create()
  interactivePosts.init(content.querySelectorAll('.post'))
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
injector.inject('hwt-monoji', `@import url('https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@300&display=swap');
  #console { font-family: "Courier New", Courier, "Noto Emoji", monospace; } `)


/*--------------------------- General utilities ----------------------------*/
EventTarget.prototype.delegateEventListener = function(types, targetSelectors, listener, options) {
  // if (! (types instanceof Array))
    // types = types.split(' ')
  if (! (targetSelectors instanceof Array))
    targetSelectors = [targetSelectors]
  this.addMultiEventListener(types, ev => {
    targetSelectors.some(selector => {
      if (ev.target.matches(selector)) {
        listener.bind(ev.target)(ev)
        return true
      }
    })
  }, options)
}
EventTarget.prototype.addMultiEventListener = function(types, listener, options) {
  if (! (types instanceof Array))
    types = types.split(' ')
  types.forEach(type => {
    this.addEventListener(type, ev => {
      listener.bind(ev.target)(ev)
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
  if (isNaN(times) || times <= 0) return "";
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

// Returns a promise wrapped in an object that contains resolve() and reject() methods for the promise
function exposedPromise() {
  let promiseResolve, promiseReject
  , promise = new Promise(function(resolve, reject){
    promiseResolve = resolve;
    promiseReject = reject;
  });

  return {
    promise: promise,
    resolve: promiseResolve,
    reject: promiseReject
  }
}


/*------------------------- App-specific utilities -------------------------*/
// Turns a text node into a "link"
function makeClickable(node, command, title='') {
  node.replaceWith(createElementFromHTML(`<button class="hwt-cmdlink" data-command="${command}" title="${title}">${node.textContent}</button>`))
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

  await postingForm.quitEditingContext() // If in editing context prevent a command from being leaked into the post body

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
    setBlur(1)
}

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

document.body.delegateEventListener(['click', 'input'], '.hwt-action', /*async*/ function() {
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
          `<button class="hwt-cmdlink hwt-btn" data-command="FIRST" title="First page">&lt;&lt;</button>
          <button class="hwt-cmdlink hwt-btn" data-command="PREV" title="Previous page">&lt;</button>`
        :''}
        ${node.textContent}
        ${current < total ?
          `<button class="hwt-cmdlink hwt-btn" data-command="NEXT" title="Next page">&gt;</button>
          <button class="hwt-cmdlink hwt-btn" data-command="LAST" title="Last page">&gt;&gt;</button>`
        :''}
      </span>`
      node.replaceWith(createElementFromHTML(html))
      return true
    }
    else return false
  })
  if (found) { // Copy pagination to bottom
    content.insertAdjacentHTML('beforeend', '<br>'+html)
    return [current, total]
  }
}

/*function isPathInView() { // dirty
  return ((document.querySelector('#path').getBoundingClientRect().bottom - document.querySelector('#wrapper').getBoundingClientRect().bottom) < 96)
}*/

const messageBroker = {
  handle: function(type, message) {
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
    // Successful deletion
    if (type == 'message' && message == 'Post has been deleted') {
      this.expected?.resolve()
    }
    // Unsuccessful deletion / edit
    if (type == 'error') {
      this.expected?.reject()
    }
  },
  // expected: {},
  expect: function(/*type*/) {
    let xp = exposedPromise()
    this.expected/*['_'+type]*/ = xp
    return xp.promise
  }
}

// Keyboard navigation
document.addEventListener("keydown", ev => {
  if (ev.ctrlKey) {
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
      if (window.history.state.screen == 'board-list') {
        actions.home()
      }
    }
    if (ev.key == 'Enter' && ~document.activeElement.id.indexOf('hwt-pf')) {
      if(document.querySelector('#hwt-pf-title'))
        actions.newtopic()
      else if (postingForm.context)
        postingForm.submitEdit()
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

actions.reply = () => {
  let msg = postingForm.textarea?.value
  if (msg)
    runCommand([`REPLY -m ${msg}`, `LAST`])
}
actions.newtopic = () => {
  let title = postingForm.title?.value
  , content = postingForm.textarea?.value
  if (title && content)
    runCommand(`NEWTOPIC -t ${title} -c ${content}`)
}
actions.newtopicform = () => {
  document.querySelector('.show-topic-form')?.remove()
  postingForm.create(true)
}
actions.edit = () => {
  let msg = postingForm.textarea?.value
  if (msg)
    runCommand(msg)
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

actions.hwtinfo = () => {
  let r = str => `<span class="reverse">&nbsp;${str}&nbsp;</span>`
  , d2 = str => `<div style="padding:2px">${str}</div>`
  let msg = `<div class="message"><div style="padding-left:10px">
    <br>
    ${r(`HouseWife Tools v.${GM_info.script.version}`)}
    <br><br>
    Keyboard Shortcuts:<br><br>
    ${d2(`${r(`Ctrl + →`)}, ${r(`Ctrl + ←`)} Navigate between pages`)}
    ${d2(`${r(`Ctrl + ↑`)} Move up one layer`)}
    ${d2(`${r(`PageUp`)}, ${r(`PageDown`)} Scroll up and down the page`)}
    ${d2(`${r(`Ctrl + Enter`)} Submit a post`)}
    <br><br>
    ${d2(`<a href="https://github.com/Juribiyan/housewife-tools" target="_blank">Project GitHub</a>`)}
    ${d2(`<a href="#/1/20086:1" target="_blank">HWT Discussion</a>`)}
  </div></div>`
  document.querySelector('#content').insertAdjacentHTML('beforeend', msg)
}

// --------------------- Post interaction ---------------------
const interactivePosts = {
  processPost: function(post) {
    let pn = post.querySelector('.postnumber')
    let id = +(pn?.innerText.match(/[0-9]+/)?.[0])
    if (isNaN(id)) return 0;
    let postCode = post.querySelector('.post-code')
    let pc = postCode?.innerText.match(/[A-Z]+/)?.[0]
    if (!pc) return 0;

    pn.insertAdjacentHTML('beforeend', `<span class="hwt-post-menu">
      <button class="hwt-btn hwt-post-edit">edit</button>
      <button class="hwt-btn hwt-cmdlink hwt-post-delete" data-command="DELETE -p ${id}" data-noload="true">delete</button>
      <button class="hwt-btn hwt-action" data-action="anchor">#</button>
    </span`)

    pn.querySelector('.hwt-post-delete').addMultiEventListener(['click', 'input'], function() {
      messageBroker.expect()
      .then(() => {
        post.classList.add('hwt-deleted')
        pn.querySelector('.hwt-post-menu')?.remove()
      })
      .catch(() => {
        this.remove()
        pn.querySelector('.hwt-post-edit')?.remove()
      })
    })

    pn.querySelector('.hwt-post-edit').addMultiEventListener(['click', 'input'], async function() {
      let json = await softCommand(`EDIT -p ${id}`)
      if (json && json.edit==1) {
        postingForm.enterEditingContext(json.edittext, json.path, id)
      }
      else {
        this.remove()
        pn.querySelector('.hwt-post-delete').remove()
        if (json.message) {
          document.querySelector('#content').insertAdjacentHTML('beforeend', json.message)
        }
      }
    })

    postCode.addEventListener('mouseenter', () => this.highlight(pc/*, post*/))
    postCode.addEventListener('mouseleave', () => this.highlight(false))
    postCode.addEventListener('click', () => postingForm.insert(`2${pc}: `))

    let content = post.querySelector('.post-content')
    if (content) {
      [].filter.call(content.childNodes, node => // Find new line nodes
        (
          node.nodeName=="#text"
          || 
          (
            node.nodeName!='BR' && 
            !node.classList?.contains('postnumber') && 
            !node.querySelector('.pendant')
          )
        )
        &&
        ['BR', 'DIV'].includes(node.previousSibling?.nodeName)
      ).forEach(subNode => { // add interactivity to posts references in text
        let refID = false, ref
        , replacedContent = subNode.textContent.replace(/^2?([A-Z]+)[,\:]?/, (m, g1) => { 
          ref = m
          refID = g1
          return ''
        })
        if (refID) {
          subNode.textContent = replacedContent
          let refLink = createElementFromHTML(`<span class="hwt-reflink">${ref}</span>`)
          refLink.addEventListener('mouseenter', () => this.highlight(refID/*, post*/))
          refLink.addEventListener('mouseleave', () => this.highlight(false))
          if (typeof subNode.innerHTML != 'undefined')
            subNode.prepend(refLink)
          else
            content.insertBefore(refLink, subNode)
        }
      })
      // TODO: multiple references like in https://314n.org/#/1/23:7
    }

    return {
      el: post,
      id: id,
      author: pc
    }
  },
  init: function(posts) {
    this.posts = [].map.call(posts, this.processPost.bind(this)).filter(post => post !== 0)
  },
  posts: [],
  highlight: function(pc, self=null) {
    this.posts.forEach(post => {
      if (pc===false) {
        post.el.classList.remove('hwt-post-highlight')
      }
      else if (post.author == pc /*&& post.el != self*/) {
        post.el.classList.add('hwt-post-highlight')
      }
    })
  }
}

const postingForm = {
  get form() {
    return this._form || (this.update() && this._form)
  },
  get wrapper() {
    return this._wrapper || (this.update() && this._wrapper)
  },
  get textarea() {
    return this._textarea || (this.update() && this._textarea)
  },
  get title() {
    return this._title || (this.update() && this._title)
  },
  update: function() {
    this._form = document.querySelector('#hwt-posting-form')
    this._wrapper = this._form?.querySelector('.hwt-textarea-wrapper')
    this._textarea = this._wrapper?.querySelector('textarea')
    this._title = this._wrapper?.querySelector('input')
  },
  create: function(withTitle = false) {
    let html = `
      <div id="hwt-posting-form" style="visibility:hidden">
        <div class="hwt-textarea-wrapper${withTitle ? ' hwt-tc-with-title' :''}">
          <div class="hwt-textarea-border"></div>
          ${withTitle ? `<input id="hwt-pf-title" type="text" class="hwt-txt-input hwt-title-input" placeholder="Title...">` :''}
          <textarea id="hwt-pf-textarea" style="resize:false" rows="3" class="hwt-txt-input hwt-msg-area"${withTitle ? ` placeholder="Message..."` :''}></textarea>
        </div>
        <div class="hwt-reply-button-wrapper">
          ${withTitle
            ? `<button class="hwt-btn hwt-action" data-action="newtopic" title="Create new topic">post</button>`
            : `<button class="hwt-btn hwt-action hwt-reply-btn" data-action="reply">reply</button>`
          }
        </div>
      </div>`
    document.querySelector('.content').insertAdjacentHTML('afterend', html)

    this.update()

    let debounceTimeout, ro;
    let debouncedResizeHandler = (ev) => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        if (!this.form.parentNode) {
          ro.disconnect()
          return;
        }
        this.updateBorders(withTitle)
      }, 10)
    }
    ro = new ResizeObserver(debouncedResizeHandler)
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        debouncedResizeHandler()
        ro.observe(this.textarea)
        this.form.style.visibility = 'visible'
      })
    }, 200)
    this.textarea.addEventListener("input", ev => {
      this.textarea.rows = Math.max(this.textarea.value.split(/\n/).length, 3)
    })
  },
  updateBorders: function(withTitle) {
    let border = this.wrapper.querySelector('.hwt-textarea-border')
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

    let w = Math.floor(this.wrapper.offsetWidth / charWidth)
    , h = Math.round(this.wrapper.offsetHeight / charHeight)

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
  },
  insert: function(txt) {
    this.textarea.value = txt
  },
  enterEditingContext: function(txt, path, postID) {
    let $path = document.querySelector('#path')
    this.context = {
      path: $path.innerHTML,
      value: this.textarea.value,
      edittext: txt,
      postID: postID
    }
    this.textarea.value = txt
    $path.innerHTML = `${path}&nbsp;&gt;&nbsp;`
    let rb = this.form.querySelector('.hwt-reply-btn')
    rb.style.display = 'none'
    rb.insertAdjacentHTML('afterend', `<div class="hwt-edit-btns">
      <button class="hwt-btn hwt-action" data-action="submitedit">edit</button>
      <button class="hwt-btn hwt-action" data-action="unedit">cancel</button>
    </div>`)
    this.isEditing = true
  },
  // return to normal context by sending an original message
  quitEditingContext: async function(reflectOnly=false) {
    if (!this.context) return false;
    let $path = document.querySelector('#path')
    $path.innerHTML = this.context.path
    this.textarea.value = this.context.value
    this.form.querySelector('.hwt-reply-btn').style.display = ''
    this.form.querySelector('.hwt-edit-btns').remove()
    if (!reflectOnly) {
      await softCommand(this.context.edittext, false)
    }
    delete this.context
    return true
  },
  submitEdit: async function() {
    let res = await softCommand(postingForm.textarea.value, false)
    if (res.message) {
      document.querySelector('#content').insertAdjacentHTML('beforeend', res.message)
      if (~res.message.indexOf("Post has been edited")) {
        let id = this.context?.postID
        if (!id) return;
        let htm = (await softCommand(`REFRESH`))?.message
        if (!htm) return;
        let dom = document.createRange().createContextualFragment(htm)
        let newPost = [].find.call(dom.querySelectorAll('.post'), post => 
          post.querySelector('.postnumber')?.innerText?.match(/[0-9]+/)?.[0] == id)
        if (!newPost) return;
        let oldPost = interactivePosts.posts.find(post => post.id == id)
        if (!oldPost) return;
        oldPost.el.innerHTML = newPost.innerHTML
        oldPost = interactivePosts.processPost.bind(interactivePosts)(oldPost.el)
      }
    }
  }
}

actions.submitedit = postingForm.submitEdit.bind(postingForm)
actions.unedit = () => {
  postingForm.quitEditingContext()
}

async function softCommand(command, quitEditingContext=true) {
  if (quitEditingContext)
    await postingForm.quitEditingContext()
  let fd = new FormData()
  fd.append('input', command)
  let f = await fetch(`/console.php`, {
    method: 'POST',
    body: fd,
    credentials: 'include'
  })
  if (! f.ok) return;
  let res = await f.json()
  return res
}


// ---------------- Starting ----------------
reObserve()

handleIndex()

if (document.location.hash) {
  handleHash(document.location.hash)
}
