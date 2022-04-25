import React, { useEffect } from 'react';
import { HZRecorder } from './utils/HZRecorder';
import { message } from 'antd';

const Recorder = () => {
    let recorder, speakInfo;
    useEffect(() => {
        initAudio();
    }, []);

    const initAudio = () => {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        navigator.getUserMedia(
            { audio: true },
            function (stream) {
                recorder = new HZRecorder(stream);

                console.log('初始化完成');
            },
            function (e) {
                message.info('No live audio input');
                console.log('No live audio input: ' + e);
            }
        );
    };
    // 语音开始
    const speakClick = () => {
        recorder.start();
        message.info('语音输入中...');
        console.log('语音输入中...');
    };
    // 语音结束
    const speakEndClick = () => {
        let audioData = new FormData();
        audioData.append('speechFile', recorder.getBlob());
        getSpeechRecognition(audioData).then(res => {
            speakInfo.value = res.data;
        });
    };
    return (
        <div>
            <div
                onTouchStart={speakClick}
                onTouchEnd={speakEndClick}
                style={{ width: 100, height: 50, backgroundCOlor: '#1890ff', margin: 'auto' }}
            >
                录音
            </div>
        </div>
    );
};
export default Recorder;
