import React, { Component } from 'react';
import './App.css';
import Toolbar from './Components/Toolbar.js'
import Messages from './Components/Messages.js'


class App extends Component {

  constructor() {
    super()
    this.state = {
      messageList: []
    }
  }

  fetch() {
    return fetch('http://localhost:8082/api/messages')
    .then(response => response.json())
    .then(data => {
      this.setState({
        messageList: data
      })
    })
  }

  componentDidMount(){
    this.fetch()
    .catch(err => console.error(err))
  }


  render() {
    return (
      <div className="App">
        <Toolbar/>
        <Messages
          messages={this.state.messageList}/>
      </div>
    );
  }
}

export default App;
