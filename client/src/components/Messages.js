import React from 'react';
import './Messages.css';

const Messenger = (props) => (
  <div className="messages">
    {props.messages.map((message, index) => (
      <div className="messages__message" key={index}>
        <span className="messages__name">User #{message.user}: </span>
        <span className="messages__body">{message.text}</span>
      </div>
    ))}
  </div>
)

export default Messenger;