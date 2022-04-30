import React from 'react';
import Socket from 'yiyi-websocket';
import Recorder from 'yiyi-audio-recorder';
//APPID，APISecret，APIKey在控制台-我的应用-语音听写（流式版）页面获取
import CryptoJS from 'crypto-js';
const APPID = 'c4e048be';
const API_SECRET = 'NzEyODMxNTRiODRiNjZlOGRiYWE3NmNh';
const API_KEY = '5abbbd3f78427cfaa12fd9aea3512085';
const language = 'zh_cn';
const accent = 'mandarin';
let handlerInterval = '';
import TransWorker from './transcode.worker.js';
let transWorker = new TransWorker();
let orignAudioData = [];
const App = () => {
    const formatUrl = () => {
        var url = 'wss://iat-api.xfyun.cn/v2/iat';
        var host = 'iat-api.xfyun.cn';
        var apiKey = API_KEY;
        var apiSecret = API_SECRET;
        var date = new Date().toGMTString();
        var algorithm = 'hmac-sha256';
        var headers = 'host date request-line';
        var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
        var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
        var signature = CryptoJS.enc.Base64.stringify(signatureSha);
        var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        var authorization = btoa(authorizationOrigin);
        url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
        return url;
    };
    const socket = new Socket({ url: formatUrl() });
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
            formatResult(e.data);
            console.log('onmessage 收到msg', e.data, JSON.parse(e.data).name);
        };
        socket.onclose = function (e) {
            console.log('onclose', e);
        };
        socket.onerror = function (e) {
            console.log('onerror', e);
        };
    };
    const toBase64 = buffer => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    const formatResult = resultData => {
        let resultText = '',
            resultTextTemp = '';
        // 识别结束
        let jsonData = JSON.parse(resultData);

        if (jsonData.data && jsonData.data.result) {
            let data = jsonData.data.result;
            let str = '';
            let resultStr = '';
            let ws = data.ws;
            for (let i = 0; i < ws.length; i++) {
                str = str + ws[i].cw[0].w;
            }
            // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
            // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
            if (data.pgs) {
                if (data.pgs === 'apd') {
                    // 将resultTextTemp同步给resultText
                    resultText = resultTextTemp;
                }
                // 将结果存储在resultTextTemp中
                resultTextTemp = resultText + str;
            } else {
                resultText = resultText + str;
            }
        }
        console.log(
            'jsonData=======>',
            jsonData,
            'resultText 翻译结果',
            resultText,
            resultTextTemp,
            'resultTextTemp'
        );
        if (jsonData.code === 0 && jsonData.data.status === 2) {
            handleClose();
            clearInterval(handlerInterval);
        }
        if (jsonData.code !== 0) {
            handleClose();
            clearInterval(handlerInterval);
            console.log(`${jsonData.code}:${jsonData.message}`);
        }
    };
    const handleSend = () => {
        let pcm = recorder.getPCM();

        // console.log('handleSend pcm', pcm, 'audioData', audioData);
        let audioData = orignAudioData.splice(0, 1280);
        console.log('handleSend pcm', pcm, 'audioData', audioData);
        var params = {
            common: {
                app_id: APPID,
            },
            business: {
                language: language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
                domain: 'iat',
                accent: accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
                vad_eos: 5000,
                dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
            },
            data: {
                status: 0,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: toBase64(audioData),
            },
        };
        socket.sendMessage(JSON.stringify(params)).then(res => {
            console.log('sendMessage', res);
        });

        handlerInterval = setInterval(() => {
            if (orignAudioData.length === 0 || !socket.getStatus()) {
                socket
                    .sendMessage(
                        JSON.stringify({
                            data: {
                                status: 2,
                                format: 'audio/L16;rate=16000',
                                encoding: 'raw',
                                audio: '',
                            },
                        })
                    )
                    .then(res => {});

                clearInterval(handlerInterval);
            }
            audioData = orignAudioData.splice(0, 1280);
            console.log(
                'handleSend pcm',
                pcm,
                'audioData',
                audioData,
                'orignAudioData',
                orignAudioData
            );
            // 中间帧
            socket
                .sendMessage(
                    JSON.stringify({
                        data: {
                            status: 1,
                            format: 'audio/L16;rate=16000',
                            encoding: 'raw',
                            audio: toBase64(audioData),
                        },
                    })
                )
                .then(res => {
                    console.log('sendMessage', res);
                });
        }, 40);
    };
    const handleClose = () => {
        socket.closeWebSocket();
    };

    const startRecord = () => {
        if (!recorder) {
            recorder = new Recorder({ compiling: true });
            transWorker.onmessage = function (event) {
                orignAudioData.push(...event.data);
            };
            recorder.onprogress = params => {
                let { lChannelData, e } = params;
                console.log('监听语音过程', params);

                transWorker.postMessage(e.inputBuffer.getChannelData(0));
            };
            recorder.start().then(res => {});
        }
    };

    const stopRecord = () => {
        recorder.stop();
        console.log('orignAudioData', orignAudioData);
    };

    const playRecord = () => {
        recorder.play();
    };

    const getMP3Blob = () => {
        const blob = recorder.getMP3Blob();
        const file = new File([blob], '录音', { type: blob.type });
        console.log('blob', blob, 'file', file);
    };
    const downloadMp3 = () => {
        console.log('recorder', recorder);
        recorder.downloadMP3('录音');
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
