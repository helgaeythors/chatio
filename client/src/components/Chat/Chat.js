// Chat
import React from 'react';
import NewChatForm from '../NewChatForm/NewChatForm';
import ChatRoom from '../ChatRoom/ChatRoom';
import PropTypes from 'prop-types';

class Chat extends React.Component {
    componentDidMount() {
        const { socket } = this.props;
        let update = this._updateChatRooms.bind(this);
        socket.emit("rooms");
        socket.on("roomlist", function(roomList)  {
            update(roomList);
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            chatRoom: "",
            roomPassword: ""
        }
    }
    _updateChatRooms(roomList) {
        this.setState({ rooms: roomList });
    }
    setChatRoom (chatroom, password) {
        this.setState({ chatRoom: chatroom });
        this.setState({ roomPassword: password });
    }
    handleClick(e) {
        const { socket } = this.props;
        let password = prompt("Enter the password (nothing if there is no password)");
        let  setChatState = this.setChatState.bind(this);
        let chat = e.currentTarget.dataset.id;

        socket.emit("joinroom", { room: chat, pass: password }, function(confirmation) {
            if (confirmation) {
                setChatState(chat);
            } else {
                alert("Could not join room");
            }
        });
    }
    setChatState(chatState) {
        this.setState({ chatRoom: chatState });
    }
    render() {
        const { rooms, chatRoom } = this.state;
        const { socket, userName } = this.props;
        return(
            <>
                {
                    !chatRoom ?
                        <>
                            <h1>Chat.io</h1>
                            <div className="available-rooms">
                                <h3>Available chat rooms</h3>
                                <ul>
                                    { Object.keys(rooms).map(r => <li onClick={ e => this.handleClick(e) } data-id={ r } key={ r }><a href="#">{ r }</a></li>) }
                                </ul>
                            </div>
                            <NewChatForm socket={ socket } setChatRoom={ this.setChatRoom.bind(this) } />
                        </>
                    :
                        <ChatRoom  socket={ socket } roomName={ chatRoom } userName={ userName } />
                }
            </>
        );
    }
}

Chat.propTypes = {
    // socket context
    socket: PropTypes.object.isRequired,
    // username
    userName: PropTypes.string.isRequired
}

export default Chat;