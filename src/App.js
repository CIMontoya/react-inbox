import React, { Component } from 'react';
import './App.css';
import Toolbar from './Components/Toolbar.js'
import Messages from './Components/Messages.js'
import NoMessage from './Components/noMessage.js'


class App extends Component {

  constructor() {
    super()
    this.state = {
      messageList: [],
      unreadCount: 0,
      selectedAmount: 0,
      composeMessage: <div className="noMessage"></div>,
      noMessage: false
    }
  }

  updates = async (message) => {
    await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  updateLabels = (event) => {
    if(event.target.value !== "Apply label") {
      let messageIDs = []
      let newMessageList = [...this.state.messageList]
      let selectedMessage = newMessageList.filter(message => message.selected)
      selectedMessage.map(message => {
        if(!message.labels.includes(event.target.value)){
          message.labels.push(event.target.value)
          this.setState({
            messageList: newMessageList
          })
          messageIDs.push(message.id)
        }
        return message
      })
      let message = {
        messageIds: messageIDs,
        command: "addLabel",
        label: event.target.value
      }
      this.updates(message)
    }
    event.target.value = "Apply label"
  }

  updateSelect = async (id) => {

    let newMessageList = [...this.state.messageList]
    newMessageList.map(message => {
      console.log(message.id, id)
      if(message.id === id) {
        message.selected = !message.selected
      }
      return message
    })
    let selectedAmount = [...this.state.messageList].filter(message => message.selected).length

    this.setState({
      messageList: newMessageList,
      selectedAmount: selectedAmount
    })
  }

  fetch() {
    return fetch('http://localhost:8082/api/messages')
    .then(response => response.json())
    .then(data => {
      let unReadCount = 0
      let newMessageList = [...data]
      if(newMessageList.length === 0) {
        this.setState({
          noMessage: true,
          selectedAmount: 0
        })
      }
      let readStates = newMessageList.filter(message => !message.read)
      newMessageList.map(message => message.selected = false)
      let selectedAmount = newMessageList.filter(message => message.selected)
      unReadCount = readStates.length
      this.setState({
        messageList: data,
        unreadCount: unReadCount,
        selectedAmount: selectedAmount.length
      })
    })
  }


  componentDidMount(){
    this.fetch()
    .catch(err => console.error(err))
  }

  markAsRead = (event) => {
    let read = true
    let messageIDs = []
    let newMessageList = [...this.state.messageList]
    let selectedMessage = newMessageList.filter(message => message.selected === true)
    let correctMessage = selectedMessage.filter(message => message.read === false)
    correctMessage.map(message => {
      messageIDs.push(message.id)
       return message.read = read
    })
    let readStates = newMessageList.filter(message => !message.read)
    let unReadCount = readStates.length
    this.setState({
      messageList: newMessageList,
      unreadCount: unReadCount
    })
    let message = {
      messageIds: messageIDs,
      command: "read",
      read: true
    }
    this.updates(message)
  }

  markAsUnread = (event) => {
    let read = false
    let messageIDs = []
    let newMessageList = [...this.state.messageList]
    let selectedMessage = newMessageList.filter(message => message.selected === true)
    let correctMessage = selectedMessage.filter(message => message.read === true)
    correctMessage.map(message =>{
      messageIDs.push(message.id)
      return message.read = read
    })
    let readStates = newMessageList.filter(message => !message.read)
    let unReadCount = readStates.length
    this.setState({
      messageList: newMessageList,
      unreadCount: unReadCount
    })
    let message = {
      messageIds: messageIDs,
      command: "read",
      read: false
    }
    this.updates(message)
  }

  delete = (event) => {
    let newMessageList = [...this.state.messageList]
    let messageIDs = []
    let selectedMessages = newMessageList.filter(message => message.selected)
    selectedMessages.map(message => {
      if(newMessageList.includes(message)) {
        messageIDs.push(message.id)
        delete newMessageList[newMessageList.indexOf(message)]
        newMessageList.map(message => message.selected = false)
      }
      return message
    })
    newMessageList= newMessageList.filter(message => message)

    if(newMessageList.length === 0) {
      this.setState({
        noMessage: true
      })
    }
    let readStates = newMessageList.filter(message => !message.read)
    let unReadCount = readStates.length
    this.setState({
      messageList: newMessageList,
      unreadCount: unReadCount,
      selectedAmount: 0
    })
    let message = {
      messageIds: messageIDs,
      command: "delete"
    }
    console.log(message)
    this.updates(message)
  }

  readMessage = (event) => {
    let messageIDs = []
    const textBody = event.target.parentNode.parentNode.nextSibling
    const parentDiv = event.target.parentNode.parentNode
    let subject = event.target.innerText
    let newMessageList = [...this.state.messageList]
    let correctMessage = newMessageList.filter(message => message.subject === subject)
    messageIDs.push(correctMessage[0].id)
    if(textBody.className === "text") {
      textBody.innerHTML =
        `<div className="col-xs-11 col-xs-offset-1">
          ${correctMessage[0].body}
        </div>`
      textBody.className = "row message-body"
      if(/(unread)/.test(parentDiv.className)){
        let noRead = parentDiv.className.replace(/(unread)/, "read")
        parentDiv.className = noRead
        correctMessage[0].read = true
        if(this.state.unreadCount > 0) {
          this.setState({
            unreadCount: this.state.unreadCount - 1,
            messageList: newMessageList
          })
        }
        let message = {
          messageIds: messageIDs,
          command: "read",
          read: true
        }
        this.updates(message)
      }
    } else {
      textBody.innerHTML = ""
      textBody.className = "text"
    }

  }

  selectAllToggle = (event) => {
    let newMessageList = [...this.state.messageList]
    let selectedAmount = newMessageList.filter(message => message.selected)
    if(selectedAmount.length < newMessageList.length) {
      newMessageList.map(message => message.selected = true)
      selectedAmount = newMessageList.length
    } else {
      newMessageList.map(message => message.selected = false)
      selectedAmount = 0
    }
    this.setState({
      messageList: newMessageList,
      selectedAmount: selectedAmount
    })
  }

  addMessage = (event) => {
    event.preventDefault()
    let message = {
      subject: event.target[0].value,
      body: event.target[1].value
    }
    console.log(this.state.messageList)
    let newMessage

    if(this.state.messageList.length === 0) {
      newMessage = {
        subject: event.target[0].value,
        read: false,
        starred: false,
        selected: false,
        labels: [],
        body: event.target[1].value,
        id: 1
      }
    } else {
      newMessage = {
        subject: event.target[0].value,
        read: false,
        starred: false,
        selected: false,
        labels: [],
        body: event.target[1].value,
        id: this.state.messageList[this.state.messageList.length - 1].id + 1
      }
    }
    let newMessageList = [...this.state.messageList, newMessage]
    let unReadCount = [...newMessageList].filter(message => !message.read).length
    let select = [...newMessageList].filter(message => message.selected).length
    fetch('http://localhost:8082/api/messages', {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    this.setState({
      composeMessage: <div className="noMessage"></div>,
      noMessage: false,
      messageList: newMessageList,
      selectedAmount: select,
      unreadCount: unReadCount
    })
  }

  composeMessage = (event) => {
    let nextDiv = this.state.composeMessage
    if(nextDiv.props.className === "noMessage") {
      nextDiv= <div className="composeMessage">
      <form className="form-horizontal well" onSubmit={this.addMessage}>
        <div className="form-group">
          <div className="col-sm-8 col-sm-offset-2">
            <h4>Compose Message</h4>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="subject" className="col-sm-2 control-label">Subject</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" id="subject" placeholder="Enter a subject" name="subject" autoComplete="off"/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="body" className="col-sm-2 control-label">Body</label>
          <div className="col-sm-8">
            <textarea name="body" id="body" className="form-control"></textarea>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-8 col-sm-offset-2">
            <input type="submit" value="Send" className="btn btn-primary"/>
          </div>
        </div>
      </form>
      </div>
    }
    else {
      nextDiv = <div className="noMessage"></div>
    }
    this.setState({
      composeMessage: nextDiv
    })
  }

  removeLabels = (event) => {
    if(event.target.value !== "Remove label") {
      let messageIDs = []
    let val = new RegExp((event.target.value));
    let replace
    let newMessageList = [...this.state.messageList]
    let selectedMessage = newMessageList.filter(message => message.selected)
    selectedMessage.map(message => {
      if(message.labels.includes(event.target.value)){
        messageIDs.push(message.id)
        replace = message.labels.join("-").replace(val, "").split("-")
        message.labels = replace
        this.setState({
          messageList: newMessageList
        })
      }
      return message
    })
    let message = {
      messageIds: messageIDs,
      command: "removeLabel",
      label: event.target.value
    }
    this.updates(message)
  }
  event.target.value = "Remove label"
  }

  starToggle = (event) => {
    let message = {}
    let newMessageList = [...this.state.messageList]
    let subject = event.target.parentNode.parentNode.parentNode.parentNode.children[1].children[0].innerText
    let correctMessage = newMessageList.filter(message => message.subject === subject)
    if(correctMessage[0].starred === false) {
      correctMessage[0].starred = true
    } else {
      correctMessage[0].starred = false
    }
    this.setState({
      messageList: newMessageList
    })
    message = {
      messageIds: [correctMessage[0].id],
      command: "star"
    }
    this.updates(message)
  }

  render() {
    return (
      <div className="App">
        <Toolbar
          updateLabels={this.updateLabels}
          markAsRead={this.markAsRead}
          markAsUnread={this.markAsUnread}
          delete={this.delete}
          unreadCount={this.state.unreadCount}
          selectAllToggle={this.selectAllToggle}
          selectedAmount={this.state.selectedAmount}
          messageList={this.state.messageList}
          composeMessage={this.composeMessage}
          removeLabels={this.removeLabels}/>
          {this.state.composeMessage}
          {!this.state.noMessage ?
            <Messages
            messages={this.state.messageList}
            updateSelect={this.updateSelect}
            readMessage={this.readMessage}
            starToggle={this.starToggle}/>
            : <NoMessage/>
          }
      </div>
    );
  }
}

export default App;
