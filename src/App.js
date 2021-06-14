import React, { Component } from 'react';
import io from 'socket.io-client'
import axios from 'axios'
import { Alert, Button, Input, Table } from 'reactstrap';

const API_URL = 'http://localhost:2021'

// untuk memberikan trigger koneksi socket ke BE
const socket = io(API_URL)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: null,
      messages: []
    }
  }

  joinChat = () => {
    // mengirimkan even dan data ke socket server
    socket.emit("JoinChat", { name: this.inName.value })
    socket.on('notif', notif => this.setState({ notif }))
    socket.on("updateMessage", msgs => this.setState({ messages: msgs }))
  }

  onBtSend = () => {
    socket.emit("chatMessage", { name: this.inName.value, message: this.inMessage.value })
  }

  renderMessages = () => {
    return this.state.messages.map((item, index) => <tr key={index}>
      <td colSpan="3" style={{ textAlign: this.inName.value == item.name ? "right" : "left" }}>
        <h3>{item.name}</h3>
        <p >{item.message}</p>
      </td>
    </tr>)
  }

  render() {
    console.log("Pesan masuk", this.state.messages)
    return (
      <div className="container">
        <h2 className="text-center">Welcome to Purwadhika Chat</h2>
        <Alert isOpen={this.state.notif ? true : false}
          toggle={() => this.setState({ notif: null })}>
          {this.state.notif}
        </Alert>
        <div className="row">
          <span className="col-8">
            <Input type="text" placeholder="Input Name" innerRef={el => this.inName = el} />
          </span>
          <Button className="col-3" onClick={this.joinChat}>Join Chat</Button>
        </div>
        <Table>
          <thead>
            <th>Name</th>
            <th>Message</th>
            <th><Button outline color="warning">Clear</Button></th>
          </thead>
          <tbody>
            {/* isi chat */}
            {this.renderMessages()}
          </tbody>
          <tfoot>
            <td colSpan="2">
              <Input type="textarea" placeholder="Type message..." innerRef={el => this.inMessage = el} />
            </td>
            <td>
              <Button outline color="success" onClick={this.onBtSend}>Send</Button>
            </td>
          </tfoot>
        </Table>
      </div>
    );
  }
}

export default App;