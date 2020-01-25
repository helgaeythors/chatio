// Login Form
import React from 'react';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            error: ""
        };
    }
    setError() {
        this.setState({ error: "Name not available" });
    }
    addUser(e) {
        e.preventDefault();
        const { socket } = this.props;
        const { setUserName } = this.props;
        const { userName } = this.state;
        let setError = this.setError();
        
        socket.emit('adduser', this.state.userName, function(confirmation) {
            if (confirmation) {
                // send to parent if available
                setUserName(userName);
            } else {
                // call set error function defined above
                setError;
            }
        });
    }
    handleChange(e) {
        this.setState({ userName: e.target.value });
    }
    render() {
        return(
            <>
                <h1>Chat.io</h1>
                <form onSubmit={ e => this.addUser(e) }>
                    <label>Your nick name:</label>
                    <input type="text" onChange={ e => this.handleChange(e) } ></input>
                    <button className="btn btn-primary" type="submit">Join</button>
                    <div style={ {color: "red"} } >{ this.state.error }</div>
                </form>
            </>
        );
    }
}

LoginForm.propTypes = {
    // socket context
    socket: PropTypes.object.isRequired,
    // function to send information back to parent component
    setUserName: PropTypes.func.isRequired
}

export default LoginForm;