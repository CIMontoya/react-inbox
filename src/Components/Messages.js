import React, { Component } from 'react';
import '../App.css';
import Message from './Message.js'

class Toolbar extends Component {
  render() {
    return(
      <div>
      {this.props.messages.map(item => {
        return (
          <Message
            text = {item.body}
            subject = {item.subject}
            read = {item.read}
            starred = {item.starred}
            labels = {item.labels}
            id = {item.id}/>
        )
      })}
      </div>
    )
  }
}

export default Toolbar
