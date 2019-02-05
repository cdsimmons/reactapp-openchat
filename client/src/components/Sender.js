import React from 'react';
import './Sender.css';

const Sender = (props) => (
  <div className="sender">
    <form className="sender__form" onSubmit={props.onSendMessage}>
      <input className="sender__message" onChange={props.onChangeMessage} value={props.message} type="text" name="message" autoComplete="off" placeholder={`Type a message`} />
    </form>
  </div>
)

export default Sender;