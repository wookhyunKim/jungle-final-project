import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/testroompage.css';
import UserVideoComponent from '../components/UserVideoComponent.jsx';

const APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";

const TestRoomPage = () => {
    // 상태 관리
    const [mySessionId, setMySessionId] = useState('SessionA');
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [forbiddenWordCount, setForbiddenWordCount] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

    // refs
    const OVRef = useRef(null);
    const recognitionRef = useRef(null);

    // 이벤트 핸들러들
    const handleChangeSessionId = useCallback((e) => {
        setMySessionId(e.target.value);
    }, []);

    const handleChangeUserName = useCallback((e) => {
        setMyUserName(e.target.value);
    }, []);

    const handleMainVideoStream = useCallback((stream) => {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream);
        }
    }, [mainStreamManager]);

    const deleteSubscriber = useCallback((streamManager) => {
        setSubscribers(prevSubscribers => {
            const index = prevSubscribers.indexOf(streamManager);
            if (index > -1) {
                const newSubscribers = [...prevSubscribers];
                newSubscribers.splice(index, 1);
                return newSubscribers;
            }
            return prevSubscribers;
        });
    }, []);

    // OpenVidu 세션 관련 함수들
    const leaveSession = useCallback(() => {
        if (session) {
            session.disconnect();
        }

        OVRef.current = null;
        setSession(undefined);
        setSubscribers([]);
        setMySessionId('SessionA');
        setMyUserName('Participant' + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
    }, [session]);

    // 페이지 종료 시 처리
    useEffect(() => {
        window.addEventListener('beforeunload', leaveSession);
        return () => {
            window.removeEventListener('beforeunload', leaveSession);
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [leaveSession]);

    // 음성 인식 초기화
    const initializeSpeechRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('Speech recognition is not supported in this browser');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            console.log('녹음이 시작되었습니다.');
            setIsGameActive(true);
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscriptTemp = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const transcriptText = result[0].transcript.trim();

                if (result.isFinal) {
                    finalTranscript += transcriptText + ' ';
                    countForbiddenWords(transcriptText);
                } else {
                    interimTranscriptTemp += transcriptText + ' ';
                }
            }

            setTranscript(finalTranscript);
            setInterimTranscript(interimTranscriptTemp);
        };

        recognition.onend = () => {
            console.log('녹음이 종료되었습니다.');
            if (isGameActive) {
                recognition.start();
            }
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            if (event.error !== 'no-speech' && isGameActive) {
                recognition.stop();
                recognition.start();
            }
        };
    }, [isGameActive]);

    // 게임 관련 함수들
    const countForbiddenWords = useCallback((transcript) => {
        const word = "아니";
        const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
        setForbiddenWordCount(prev => prev + occurrences);
    }, []);

    const startGame = useCallback(() => {
        setIsGameActive(true);
        setForbiddenWordCount(0);
        setTranscript('');
        setInterimTranscript('');
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    }, []);

    const stopGame = useCallback(() => {
        setIsGameActive(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    // OpenVidu 세션 참가
    const joinSession = useCallback(async () => {
        OVRef.current = new OpenVidu();
        const mySession = OVRef.current.initSession();
        setSession(mySession);

        mySession.on('streamCreated', (event) => {
            const subscriber = mySession.subscribe(event.stream, undefined);
            setSubscribers(prev => [...prev, subscriber]);
        });

        mySession.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
        });

        mySession.on('exception', (exception) => {
            console.warn(exception);
        });

        try {
            const token = await getToken();
            await mySession.connect(token, { clientData: myUserName });

            const publisher = await OVRef.current.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            mySession.publish(publisher);

            const devices = await OVRef.current.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const currentVideoDeviceId = publisher.stream.getMediaStream()
                .getVideoTracks()[0].getSettings().deviceId;
            const currentVideoDevice = videoDevices.find(device => 
                device.deviceId === currentVideoDeviceId);

            setCurrentVideoDevice(currentVideoDevice);
            setMainStreamManager(publisher);
            setPublisher(publisher);
        } catch (error) {
            console.log('Error connecting to session:', error);
        }
    }, [myUserName, deleteSubscriber]);

    // 카메라 전환 함수
    const switchCamera = useCallback(async () => {
        try {
            const devices = await OVRef.current.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices && videoDevices.length > 1) {
                const newVideoDevice = videoDevices.filter(
                    device => device.deviceId !== currentVideoDevice.deviceId
                );

                if (newVideoDevice.length > 0) {
                    const newPublisher = OVRef.current.initPublisher(undefined, {
                        videoSource: newVideoDevice[0].deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true
                    });

                    if (session && mainStreamManager) {
                        await session.unpublish(mainStreamManager);
                        await session.publish(newPublisher);
                        
                        setCurrentVideoDevice(newVideoDevice[0]);
                        setMainStreamManager(newPublisher);
                        setPublisher(newPublisher);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, [session, mainStreamManager, currentVideoDevice]);

    // OpenVidu 토큰 관련 함수들
    const createSession = async (sessionId) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'api/sessions',
            { customSessionId: sessionId },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data;
    };

    const createToken = async (sessionId) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
            {},
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data;
    };

    const getToken = async () => {
        const sessionId = await createSession(mySessionId);
        return await createToken(sessionId);
    };

    // 컴포넌트 마운트 시 음성 인식 초기화
    useEffect(() => {
        initializeSpeechRecognition();
    }, [initializeSpeechRecognition]);

    return (
        <div className="gameroom-container">
            {/* 세션 참가 전 화면 */}
            {session === undefined ? (
                <div id="join">
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1>Join a video session</h1>
                        <form 
                            className="form-group" 
                            onSubmit={(e) => {
                                e.preventDefault();
                                joinSession();
                            }}
                        >
                            <p>
                                <label>Participant: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={handleChangeUserName}
                                    required
                                />
                            </p>
                            <p>
                                <label>Session: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input
                                    className="btn btn-lg btn-success"
                                    name="commit"
                                    type="submit"
                                    value="JOIN"
                                />
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {/* 세션 참가 후 화면 */}
            {session !== undefined ? (
                <div id="session">
                    <div id="session-header">
                        {/* <h1 id="session-title">{mySessionId}</h1> */}
                        <div class="user-option">
                            <input
                                className="btn btn-large btn-danger"
                                type="button"
                                id="buttonLeaveSession"
                                onClick={leaveSession}
                                value="Leave session"
                            />
                            <input
                                className="btn btn-large btn-success"
                                type="button"
                                id="buttonSwitchCamera"
                                onClick={switchCamera}
                                value="Switch Camera"
                            />
                        </div>
                    </div>
                    <div class="video-area">
                        {/* 메인 비디오 영역 */}
                        {mainStreamManager !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <UserVideoComponent streamManager={mainStreamManager} />
                                
                                {/* 게임 컨트롤 영역 */}
                                <div style={{ margin: '10px' }}>
                                    <button 
                                        onClick={startGame}
                                        disabled={isGameActive}
                                        className="btn btn-primary mr-2"
                                    >
                                        게임 시작
                                    </button>
                                    <button 
                                        onClick={stopGame}
                                        disabled={!isGameActive}
                                        className="btn btn-danger"
                                    >
                                        게임 종료
                                    </button>
                                    <div id="count" className="mt-3">
                                        "금칙어(아니)" 카운트: {forbiddenWordCount}
                                    </div>
                                    <div id="subtitles" className="mt-2 p-3 bg-light rounded">
                                        {transcript}
                                        <span style={{color: 'gray'}}>
                                            {interimTranscript}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* 참가자 비디오 영역 */}
                        <div id="video-container" className="col-md-6">
                            {publisher !== undefined ? (
                                <div 
                                    className="stream-container col-md-6 col-xs-6"
                                    onClick={() => handleMainVideoStream(publisher)}
                                >
                                    <UserVideoComponent streamManager={publisher} />
                                </div>
                            ) : null}
                            {subscribers.map((sub, i) => (
                                <div
                                    key={i}
                                    className="stream-container col-md-6 col-xs-6"
                                    onClick={() => handleMainVideoStream(sub)}
                                >
                                    <span>{sub.id}</span>
                                    <UserVideoComponent streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>

                    





                </div>
            ) : null}
        </div>
    );
};

export default TestRoomPage;