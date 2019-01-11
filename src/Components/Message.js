import React, { Component } from 'react';
import '../App.css';

class Message extends Component {

  render() {
    let read = `row message ${this.props.read ? "read" : "unread"}`
    let selected = ` ${this.props.selected ? "selected" : ""}`
    let parentClassName = read + selected
    return (
      <div>
        <div className={parentClassName}>
          <div className="col-xs-1">
            <div className="row">
              <div className="col-xs-2">
                <input type="checkbox" checked={this.props.selected} onChange={() => this.props.updateSelect(this.props.messageId)}/>
              </div>
              <div className="col-xs-2">
                <i className={this.props.starred ? "star fa fa-star" : "star fa fa-star-o"} onClick={this.props.starToggle}></i>
              </div>
            </div>
          </div>
          <div className="col-xs-11">
            {this.props.labels.map((label, idx) => <span className="label label-warning" key={idx}>{label}</span>)}
            <a href="#" onClick={this.props.readMessage}>
              {this.props.subject}
            </a>
          </div>
        </div>
        <div className="text">
        </div>
      </div>
    )
  }
}

export default Message
