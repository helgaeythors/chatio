import React from 'react';
import PropTypes from 'prop-types';

class ChatWindow extends React.Component {
    componentDidMount() {
        const { socket } = this.props;
        let updatePrivMsg = this._updatePrivMsg.bind(this);

        socket.on("recv_privatemsg", function(user, privatemessage) {
            updatePrivMsg(user, privatemessage);
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            currentMessage: "",
            privChats: [],
            priv: false,
            subTitle: "",
            newPriv: false,
            canSendPriv: true
        }
    }
    _updatePrivMsg(user, privMsg) {
        let tempPriv = this.state.privChats;
        tempPriv.push({ nick: user, privMsg: privMsg });

        this.setState({ privChats: tempPriv, newPriv: true });

    }
    handleLeave() {
        const { roomName, socket, setLeave } = this.props;
        socket.emit("partroom", roomName);
        setLeave(true);
    }
    sendMessage(message) {
        const { priv, subTitle } = this.state;
        const { roomName, socket, userName } = this.props;
        if (message === "") { return false; }
        
        if (!priv) {
            socket.emit("sendmsg", { roomName: roomName, msg: message });
        } else {
            socket.emit("privatemsg", { nick: subTitle, message: message }, function(confirmation) {
                if (confirmation) {
                    alert("Private message sent");
                } else {
                    alert("Could not send private message");
                }
            });
        }
        this.setState({ currentMessage: "" });
    }
    handlePrivateMsg(e) {
        this.setState({ priv: true, subTitle: e.currentTarget.dataset.id, canSendPriv: true });
    }
    handlePrivateChat(e) {
        this.setState({ priv: true, newPriv: false, canSendPriv: false, subTitle: "Direct messages to you" });
    }
    handleRoomClick() {
        this.setState({ priv: false, canSendPriv: true, subTitle: "" });
    }
    render() {
        const { currentMessage, privChats, priv, newPriv, subTitle, canSendPriv } = this.state;
        const { roomName, ops, users, messages } = this.props;
        return(
            <>
                <button type="button" onClick={ () => this.handleLeave() } className="btn btn-info">Leave room</button>
                { priv ?
                    <button type="button" onClick={ () => this.handleRoomClick() } className="btn btn-basic">Leave direct messages</button>
                    : <></>
                }
                <div className="chat-window">
                    <h3> { roomName } { ": " + subTitle } </h3>
                    <div className="direct-messages">
                        <div>
                            { newPriv ? <p>New message!</p> : <></> }
                            <a href="#" onClick={ e => this.handlePrivateChat(e) }><strong>Direct messages</strong></a>
                        </div>

                    </div>
                    <div className="messages">
                         { !priv ?
                            Object.keys(messages).map(m => <div key={ m } className="messages">
                            <h4><strong>{ messages[m].nick + ": "}</strong>{ messages[m].message }</h4></div>)
                            :
                            Object.keys(privChats).map(m => <div key={ m } className="messages">
                            <h4><strong>{privChats[m].nick + ": "}</strong>{ privChats[m].privMsg }</h4></div>)
                         }
                    </div>
                    <div className="users">
                        <div><strong>Users</strong></div>
                        { Object.keys(ops).map(o => <div key={ o } className="user"><a href="#" data-id={ o } onClick={ e => this.handlePrivateMsg(e) }>{ "@" + o }</a></div>) }
                        { Object.keys(users).map(u => <div key={ u } className="user"><a href="#" data-id={ u } onClick={ e => this.handlePrivateMsg(e) }>{ u }</a></div>) }
                    </div>
                    <div className="input-container">
                         {
                             canSendPriv ?
                                <>
                                    <input type="text" value={ currentMessage } onChange={e => this.setState({ currentMessage: e.target.value })} 
                                    placeholder="Enter your message here..."></input>
                                    <button type="button" onClick={ () => this.sendMessage(currentMessage) } className="btn btn-primary">Send</button>
                                </>
                             : <></>
                         }
                    </div>
                </div>
            </>
        );
    }
}

ChatWindow.propTypes = {
    // socket context
    socket: PropTypes.object.isRequired,
    // name of chat room
    roomName: PropTypes.string.isRequired,
    // list of ops
    ops: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    // list of users
    users: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    // history of messages
    messages: PropTypes.array.isRequired,
    // function to send information back to parent
    setLeave: PropTypes.func.isRequired
}

export default ChatWindow;