import React, { Component } from 'react';
import '../App.css';


class Toolbar extends Component {

  render() {
    let icon
    let selectStyle
    if(this.props.selectedAmount > 0 && this.props.selectedAmount < this.props.messageList.length) {
      icon= "minus"
      selectStyle= `fa fa-${icon}-square-o`
    } else if(this.props.selectedAmount === this.props.messageList.length && this.props.selectedAmount !== 0) {
      icon= "check"
      selectStyle= `fa fa-${icon}-square-o`
    } else {
      selectStyle= `fa fa-square-o`
    }
    return (
      <div className="row toolbar">
  <div className="col-md-12">
    <p className="pull-right">
      <span className="badge badge">{this.props.unreadCount}</span>
      unread messages
    </p>

    <a className="btn btn-danger" onClick={this.props.composeMessage}>
      <i className="fa fa-plus"></i>
    </a>

    <button className="btn btn-default" onClick={this.props.selectAllToggle}>
      <i className={selectStyle}></i>
    </button>

    <button className="btn btn-default" onClick={this.props.markAsRead} disabled={this.props.selectedAmount === 0 ? "disabled" : ""}>Mark As Read</button>

    <button className="btn btn-default" onClick={this.props.markAsUnread} disabled={this.props.selectedAmount === 0 ? "disabled" : ""}>Mark As Unread</button>

    <select className="form-control label-select" onChange={this.props.updateLabels} disabled={this.props.selectedAmount === 0 ? "disabled" : ""}>
      <option>Apply label</option>
      <option value="dev">dev</option>
      <option value="personal">personal</option>
      <option value="gschool">gschool</option>
    </select>

    <select className="form-control label-select" onChange={this.props.removeLabels} disabled={this.props.selectedAmount === 0 ? "disabled" : ""}>
      <option>Remove label</option>
      <option value="dev">dev</option>
      <option value="personal">personal</option>
      <option value="gschool">gschool</option>
    </select>

    <button className="btn btn-default" onClick={this.props.delete} disabled={this.props.selectedAmount === 0 ? "disabled" : ""}>
      <i className="fa fa-trash-o"></i>
    </button>
  </div>
</div>
    )
  }
}

export default Toolbar
