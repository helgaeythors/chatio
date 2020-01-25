import React from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import Chat from './components/Chat/Chat';
import SocketContext from './contexts/socketContext';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            userName: ""
        };
    }
    setUserName (username) {
        this.setState({ userName: username });
    }
    render() {
        const { socket } = this.context;
        const { userName } = this.state;
        return (
            <>
                {
                    !userName ? 
                        <LoginForm socket={ socket } setUserName={ this.setUserName.bind(this) } />
                    :
                        <Chat socket={ socket } userName={ userName } />
                }
            </>
        );
    }
};

App.contextType = SocketContext;

export default App;
