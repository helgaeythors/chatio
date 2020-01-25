// Chat room
import React from 'react';
import Chat from '../Chat/Chat';
import ChatWindow from '../ChatWindow/ChatWindow';
import PropTypes from 'prop-types';

class ChatRoom extends React.Component {
    componentDidMount() {
        const { socket } = this.props;
        
        let populate = this._populateUserList.bind(this);
        let updateMsg = this._updateMsg.bind(this);
        let updateKicked = this._updateKicked.bind(this);
        let updateBanned = this._updateBanned.bind(this);
        
        socket.on("updateusers", function(room, userList, opsList) {
            populate(room, userList, opsList);
        });
        socket.on("updatechat", function(room, messagesHistory) {
            updateMsg(room, messagesHistory);
        });
        socket.on("kicked", function(room, user) {
            updateKicked(room, user);
        });
        socket.on("banned", function(room, user) {
            updateBanned(room, user);
        });
    }
    _populateUserList(room, userList, opsList) {
        if (room === this.props.roomName) {
            this.setState({ users: userList, ops: opsList });
            if (Object.keys(opsList).length > 0) {
                if (Object.values(opsList).includes(this.props.userName)) {
                    this.setState({ isOp: true });
                }
            }
        }
    }
    _updateMsg(room, msgHistory) {
        if (room === this.props.roomName) {
            this.setState({ messages: msgHistory });
        }
    }
    _updateKicked(room, user) {
        if (room === this.props.roomName) {
            if (user === this.props.userName) {
                alert(user + ": op has kicked you from the room.");
                this.setState({ leave: true });
            }
        }
    }
    _updateBanned(room, user) {
        if (room === this.props.roomName) {
            if (user === this.props.userName) {
                alert(user + ": op has banned you from the room.");
                this.setState({ leave: true });
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            users: [],
            ops: [],
            leave: false,
            isOp: false,
            manageUser: ""
        }
    }
    setLeave(leaving) {
        this.setState({ leave: leaving });
    }
    handleKick(user) {
        // op cannot kick another op
        if (!Object.keys(this.state.ops).includes(user) && Object.keys(this.state.users).includes(user)) {
            const { roomName, socket } = this.props;
            socket.emit("kick", { room: roomName, user: user }, fn => {
                console.log("User kicked");
            })
        } else {
            console.log("Cannot kick");
        }
        this.setState({ manageUser: "" });
    }
    handleBan(user) {
        // op cannot ban another op and the user is in the room
        if (!Object.keys(this.state.ops).includes(user) && Object.keys(this.state.users).includes(user)) {
            const { roomName, socket } = this.props;
            socket.emit("ban", { room: roomName, user: user }, function(confirmation) {
                if (confirmation) {
                    console.log("User banned");
                }
            });
        } else {
            console.log("Cannot ban");
        }
        this.setState({ manageUser: "" });
    }
    handleOp(user) {
        if (Object.keys(this.state.users).includes(user)) {
            const { roomName, socket } = this.props;
            socket.emit("op", { room: roomName, user: user }, function(confirmation) {
                if (confirmation) {
                    console.log("User opped");
                }
            });
        } else {
            console.log("Cannot op");
        }
        this.setState({ manageUser: "" });
    }
    render() {
        const { socket, roomName, userName } = this.props;
        const { ops, users, messages, leave, isOp, manageUser } = this.state;
        return (
            <> {
                    !leave ?
                        <>
                            <ChatWindow socket={ socket } roomName={ roomName } userName={ userName } ops={ ops } users={ users } 
                            messages={ messages } setLeave={ this.setLeave.bind(this) } />
                            {
                                isOp ?
                                    <>
                                        <div className="mange-chat">
                                            <h4>Manage chat room</h4>
                                            <input type="text" value={ manageUser } onChange={ e => this.setState({ manageUser: e.target.value }) }
                                                placeholder="Enter name of user..."></input>
                                            <button type="button" onClick={ () => this.handleKick(manageUser) } className="btn btn-primary">Kick user</button>
                                            <button type="button" onClick={ () => this.handleBan(manageUser) } className="btn btn-primary">Ban user</button>
                                            <button type="button" onClick={ () => this.handleOp(manageUser) } className="btn btn-primary">Op user</button>
                                        </div>
                                    </>
                                :
                                <></>
                            }
                        </>
                    :
                    <Chat socket={ socket } userName={ userName } />
                }
            </>
        );
    }
}

ChatRoom.propTypes = {
    // socket context
    socket: PropTypes.object.isRequired,
    // name of chat room
    roomName: PropTypes.string.isRequired,
    // username
    userName: PropTypes.string.isRequired
}

export default ChatRoom;