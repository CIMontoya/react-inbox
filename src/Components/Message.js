import React, { Component } from 'react';
import '../App.css';

class Message extends Component {

  constructor() {
    super()
    this.state = {
      read: "row message unread",
      starred: "star fa fa-star-o",
      labels: [],
      text: "",
      selected: ""
    }
  }

  checks() {
    if(this.props.read === true){
      this.setState({
        read: "row message read"
      })
    }
    if(this.props.starred === true){
      this.setState({
        starred: "star fa fa-star"
      })
    }
    if(this.props.labels.length > 0){
      let labels = this.props.labels.map(label => {
        return <span className="label label-warning">{label}</span>
      })
      this.setState({
        labels: labels
      })
    }
  }

  componentDidMount() {
    this.checks()
  }

  readMessage = (event) => {
    if(this.state.text === ""){
      this.setState({
        text: <div class="row message-body">
          <div class="col-xs-11 col-xs-offset-1">
            {this.props.text}
          </div>
        </div>,
        read: "row message read"
      })
    } else {
      this.setState({
        text: ""
      })
    }
  }

  selectToggle = () => {
    if(this.state.selected === ""){
      this.setState({
        selected: "selected"
      })
    } else {
      this.setState({
        selected: ""
      })
    }
    this.setState({
      read: this.state.read + " " + this.state.selected
    })
  }

  render() {
    return (
      <div>
        <div className={this.state.read} onClick={this.readMessage}>
          <div className="col-xs-1">
            <div className="row">
              <div className="col-xs-2">
                <input type="checkbox" onChange={this.selectToggle}/>
              </div>
              <div className="col-xs-2">
                <i className={this.state.starred}></i>
              </div>
            </div>
          </div>
          <div className="col-xs-11">
            {this.state.labels.map(label => label)}
            <a href="#">
              {this.props.subject}
            </a>
          </div>
        </div>
        {this.state.text}
      </div>
    )
  }
}

export default Message
