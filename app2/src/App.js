import React from 'react';
import Socket from './utils/socket';
const App = () => {
    const handleClick = () => {
        const socket = new Socket();
        socket.connectWebSocket();
        socket.onmessage = function (e) {
            console.log('收到msg', e.data, JSON.parse(e.data).name);
        };
        socket.onclose = function (e) {
            console.log('连接关闭');
        };
    };
    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: 'cyan',
            }}
        >
            <h1>App 2</h1>
            <button
                onClick={() => {
                    handleClick();
                }}
            >
                ws-server
            </button>
        </div>
    );
};

export default App;
