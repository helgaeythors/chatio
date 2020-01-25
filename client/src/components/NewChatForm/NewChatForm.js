import React from 'react';
import PropTypes from 'prop-types';

class NewChatForm extends React.Component {
    componentDidMount() {
        // TO DO:
    }
    constructor(props) {
        super(props);
        this.state = {
            chatRoom: "",
            error: "",
            roomPassword: ""
        }
    }
    setError() {
        this.setState({ error: "Name not available" });
    }
    addRoom(e) {
        e.preventDefault();
        const { socket } = this.props;
        const { setChatRoom } = this.props;
        const { chatRoom, roomPassword } = this.state;
        let setError = this.setError();

        socket.emit('joinroom', { room: chatRoom, pass: roomPassword }, function(confirmation) { 
            if (confirmation) {
                // send to parent if available
                setChatRoom(chatRoom, roomPassword);
            } else {
                // call set error function defined above
                setError;
            }
        });
    }
    handleRoom(e) {
        this.setState({ chatRoom: e.target.value });
    }
    handlePassword(e) {
        this.setState({ roomPassword: e.target.value });
    }
    render() {
        return(
            <>
                <form onSubmit={ e => this.addRoom(e) }>
                    <h3 style={{ color: "#618685" }}>Create chat room</h3>
                    <label>Name of room:</label>
                    <input onChange={ e => this.handleRoom(e) } type="text"></input>
                    <div style={ {color: "red"} }>{ this.state.error }</div>
                    <label>Password (optional):</label>
                    <input onChange={ e => this.handlePassword(e) } type="password"></input>
                    <button className="btn btn-primary" type="submit">Create room</button>
                </form>
            </>
        );
    }
}

NewChatForm.propTypes = {
    // socket context
    socket: PropTypes.object.isRequired,
    // function to send information back to parent component
    setChatRoom: PropTypes.func.isRequired
}

export default NewChatForm;