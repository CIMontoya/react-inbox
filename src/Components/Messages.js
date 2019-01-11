import React, { Component } from 'react';
import '../App.css';
import Message from './Message.js'

class Messages extends Component {
  render() {
    return(
      <div>
      {this.props.messages.map((item, idx) => {
        return (
          <Message
            key = {idx}
            text = {item.body}
            subject = {item.subject}
            read = {item.read}
            starred = {item.starred}
            labels = {item.labels}
            selected = {item.selected}
            updateSelect = {this.props.updateSelect}
            readMessage={this.props.readMessage}
            starToggle={this.props.starToggle}
            messageId={item.id}/>
        )
      })}
      </div>
    )
  }
}

export default Messages
