import React from 'react';
import Socket from 'yiyi-websocket';
import Recorder from 'yiyi-audio-recorder';
const App = () => {
    const socket = new Socket({ url: 'ws://localhost:8080' });
    let recorder = null;
    const handleClick = () => {
        console.log(
            'socket.getStatus',
            socket.getStatus(),
            'socket.isCanConnect()',
            socket.isCanConnect()
        );

        socket.connectWebSocket().then(res => {
            console.log('connect', res);
        });
        socket.onopen = function (e) {
            console.log('onOpen', e);
        };
        socket.onmessage = function (e) {
            console.log('onmessage 收到msg', e.data, JSON.parse(e.data).name);
        };
        socket.onclose = function (e) {
            console.log('onclose', e);
        };
        socket.onerror = function (e) {
            console.log('onerror', e);
        };
    };
    const handleSend = () => {
        socket.sendMessage(new Date().getTime()).then(res => {
            console.log('sendMessage', res);
        });
    };
    const handleClose = () => {
        socket.closeWebSocket();
    };

    const startRecord = () => {
        if (!recorder) {
            recorder = new Recorder();
            recorder.start().then(res => {});
        }
    };

    const stopRecord = () => {
        recorder.stop();
    };

    const playRecord = () => {
        recorder.play();
    };

    const getMP3Blob = () => {
        const blob = recorder.getMP3Blob();
        const file = new File(blob, '录音', { type: blob.type });
        console.log('blob', blob, 'file', file);
    };
    const downloadMp3 = () => {
        console.log('recorder', recorder);
        recorder.downloadMP3();
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
            <button
                onClick={() => {
                    handleSend();
                }}
            >
                send ws-server
            </button>
            <button
                onClick={() => {
                    handleClose();
                }}
            >
                close ws-server
            </button>

            <button
                onClick={() => {
                    startRecord();
                }}
            >
                开始录音
            </button>
            <button
                onClick={() => {
                    playRecord();
                }}
            >
                播放录音
            </button>
            <button
                onClick={() => {
                    stopRecord();
                }}
            >
                停止录音
            </button>
            <button
                onClick={() => {
                    getMP3Blob();
                }}
            >
                获取mp3Blob
            </button>
            <button
                onClick={() => {
                    downloadMp3();
                }}
            >
                下载Mp3
            </button>
        </div>
    );
};

export default App;
