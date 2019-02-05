import React, {Component} from 'react';
import './App.css';
import Messages from './components/Messages';
import Users from './components/Users';
import Sender from './components/Sender';
import Loading from './components/Loading';
import openSocket from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      users: [],
      message: '',
      messages: [],
      socket: openSocket('https://localhost:1337'),
      connected: false
    }

    this.state.socket.on('connected', (data) => {
      this.setState({
        id: data.id,
        users: data.users,
        connected: true
      });
    });

    this.state.socket.on('users:add', (id) => {
      if(!this.state.users.includes(id)) {
        const users = this.state.users.slice();    
        users.push(id);

        this.setState({users});
      }
    });

    this.state.socket.on('users:remove', (id) => {
      if(this.state.users.includes(id)) {
        const users = this.state.users.filter((i) => (i !== id));

        this.setState({users});
      }
    });

    this.state.socket.on('message:new', (message) => {
      const messages = this.state.messages.slice();    
      messages.unshift(message);

      this.setState({messages});
    });
  }

  handleSendMessage = (event) => {
    event.preventDefault();

    this.state.socket.emit('message:new', event.target.elements.message.value);
    this.setState({message: ''});
  }

  handleChangeMessage = (event) => {
    this.setState({message: event.target.value});
  }

  render() {
    const users = this.state.users.filter((id) => (id !== this.state.id));

    return (
      <div className="app">
        { this.state.connected ?
          <div className="messenger">
            <Users user={this.state.id} users={users}/>
            <Sender user={this.state.id} message={this.state.message} onSendMessage={this.handleSendMessage} onChangeMessage={this.handleChangeMessage} />
            <Messages messages={this.state.messages}/>
          </div>
          :
          <Loading />
        }
      </div>
    )
  }
}

export default App
