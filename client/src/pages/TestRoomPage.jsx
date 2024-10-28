import { OpenVidu } from 'openvidu-browser';  // OpenVidu 라이브러리 임포트 - 화상 채팅 기능 구현을 위한 핵심 라이브러리
import axios from 'axios';                    // HTTP 클라이언트 라이브러리
import React, { Component } from 'react';
import '../styles/testroompage.css';
import UserVideoComponent from '../components/UserVideoComponent.jsx';  // 비디오 스트림을 표시하는 컴포넌트

// OpenVidu 서버 URL - 화상 채팅 세션 관리를 위한 서버 주소
const APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";

/**
 * TestRoomPage 컴포넌트
 * 주요 기능:
 * 1. 화상 채팅방 구현 (OpenVidu 사용)
 * 2. 실시간 음성 인식을 통한 금칙어 게임
 */
class TestRoomPage extends Component {
    constructor(props) {
        super(props);

        // 컴포넌트의 상태 초기화
        this.state = {
            mySessionId: 'SessionA',     // 화상 채팅방 식별자
            myUserName: 'Participant' + Math.floor(Math.random() * 100),  // 랜덤 사용자 이름 생성
            session: undefined,          // OpenVidu 세션 객체
            mainStreamManager: undefined,// 메인 화면에 표시될 비디오 스트림
            publisher: undefined,        // 사용자 자신의 비디오 스트림
            subscribers: [],             // 다른 참가자들의 비디오 스트림 목록
            forbiddenWordCount: 0,      // 금칙어 사용 횟수
            isGameActive: false,        // 게임 진행 상태
            transcript: '',             // 음성 인식 최종 결과
            interimTranscript: ''       // 음성 인식 중간 결과
        };

        // 메서드 바인딩
        // React에서 이벤트 핸들러로 사용될 메서드들을 현재 컴포넌트 인스턴스에 바인딩
        this.joinSession = this.joinSession.bind(this);                    // 세션 참가
        this.leaveSession = this.leaveSession.bind(this);                 // 세션 퇴장
        this.switchCamera = this.switchCamera.bind(this);                 // 카메라 전환
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);// 세션 ID 변경
        this.handleChangeUserName = this.handleChangeUserName.bind(this); // 사용자 이름 변경
        this.handleMainVideoStream = this.handleMainVideoStream.bind(this);// 메인 비디오 스트림 변경
        this.onbeforeunload = this.onbeforeunload.bind(this);            // 페이지 종료 시 처리

        // 게임 관련 메서드 바인딩
        this.startGame = this.startGame.bind(this);                       // 게임 시작
        this.stopGame = this.stopGame.bind(this);                        // 게임 종료
        this.initializeSpeechRecognition = this.initializeSpeechRecognition.bind(this); // 음성 인식 초기화
    }

        // 컴포넌트가 마운트될 때 실행되는 생명주기 메서드
        componentDidMount() {
            // 페이지 종료 시 실행될 이벤트 리스너 등록
            window.addEventListener('beforeunload', this.onbeforeunload);
            // 음성 인식 기능 초기화
            this.initializeSpeechRecognition();
        }

        // 컴포넌트가 언마운트될 때 실행되는 생명주기 메서드
        componentWillUnmount() {
            // 이벤트 리스너 제거로 메모리 누수 방지
            window.removeEventListener('beforeunload', this.onbeforeunload);
            // 음성 인식 중지
            if (this.recognition) {
                this.recognition.stop();
            }
        }
    /**
         * 페이지 종료 시 실행되는 메서드
         * 세션을 정상적으로 종료하기 위해 호출
         */
    onbeforeunload(event) {
      this.leaveSession();
    }

    /**
    * 세션 ID 입력값 변경 핸들러
    * 사용자가 세션 ID를 입력할 때 상태를 업데이트
    */
    handleChangeSessionId(e) {
      this.setState({
          mySessionId: e.target.value,
      });
    }

    /**
    * 사용자 이름 입력값 변경 핸들러
    * 사용자가 이름을 입력할 때 상태를 업데이트
    */
    handleChangeUserName(e) {
      this.setState({
          myUserName: e.target.value,
      });
    }

    /**
    * 메인 비디오 스트림 변경 핸들러
    * 클릭한 비디오를 메인 화면에 표시하기 위한 메서드
    */
    handleMainVideoStream(stream) {
      if (this.state.mainStreamManager !== stream) {
          this.setState({
              mainStreamManager: stream
          });
      }
    }

    /**
    * 참가자 제거 메서드
    * 참가자가 세션을 떠날 때 해당 스트림을 제거
    */
    deleteSubscriber(streamManager) {
      let subscribers = this.state.subscribers;
      let index = subscribers.indexOf(streamManager, 0);
      if (index > -1) {
          subscribers.splice(index, 1);
          this.setState({
              subscribers: subscribers,
          });
      }
    }

    /**
    * 음성 인식 초기화 메서드
    * Web Speech API를 사용하여 음성 인식 기능을 설정
    */
    initializeSpeechRecognition() {
      // Web Speech API 지원 여부 확인
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
          console.error('Speech recognition is not supported in this browser');
          return;
      }

      // 음성 인식 객체 생성 및 설정
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ko-KR';              // 한국어 설정
      this.recognition.continuous = true;           // 연속 인식 모드 활성화
      this.recognition.interimResults = true;       // 중간 결과 활성화

      // 음성 인식 시작 시 호출되는 이벤트 핸들러
      this.recognition.onstart = () => {
          console.log('녹음이 시작되었습니다.');
          this.setState({ isGameActive: true });
      };

      // 음성 인식 결과 처리 이벤트 핸들러
      this.recognition.onresult = (event) => {
          let finalTranscript = '';    // 최종 인식 결과
          let interimTranscript = '';  // 중간 인식 결과

          // 모든 인식 결과를 순회하며 처리
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              const result = event.results[i];
              const transcript = result[0].transcript.trim();

              if (result.isFinal) {
                  // 최종 결과인 경우
                  finalTranscript += transcript + ' ';
                  this.countForbiddenWords(transcript);  // 금칙어 검사
              } else {
                  // 중간 결과인 경우
                  interimTranscript += transcript + ' ';
              }
          }

          // 인식 결과를 상태에 반영
          this.setState({
              transcript: finalTranscript,
              interimTranscript: interimTranscript
          });
      };

      // 음성 인식 종료 시 호출되는 이벤트 핸들러
      this.recognition.onend = () => {
          console.log('녹음이 종료되었습니다.');
          // 게임이 활성화 상태면 자동으로 다시 시작
          if (this.state.isGameActive) {
              this.recognition.start();
          }
      };

      // 음성 인식 에러 처리 핸들러
      this.recognition.onerror = (event) => {
          console.error('음성 인식 오류:', event.error);
          // no-speech 에러가 아니고 게임이 활성화 상태면 재시작
          if (event.error !== 'no-speech' && this.state.isGameActive) {
              this.recognition.stop();
              this.recognition.start();
          }
      };
    }

    /**
    * 금칙어 카운트 메서드
    * 주어진 텍스트에서 "아니"라는 단어의 출현 횟수를 계산
    */
    countForbiddenWords(transcript) {
      const word = "아니";
      const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
      this.setState(prevState => ({
          forbiddenWordCount: prevState.forbiddenWordCount + occurrences
      }));
    }

    /**
    * 게임 시작 메서드
    * 상태를 초기화하고 음성 인식을 시작
    */
    startGame() {
      this.setState({ 
          isGameActive: true,
          forbiddenWordCount: 0,
          transcript: '',
          interimTranscript: ''
      }, () => {
          if (this.recognition) {
              this.recognition.start();
          }
      });
    }

    /**
    * 게임 종료 메서드
    * 음성 인식을 중지하고 게임 상태를 비활성화
    */
    stopGame() {
      this.setState({ isGameActive: false }, () => {
          if (this.recognition) {
              this.recognition.stop();
          }
      });
    }

    /**
     * OpenVidu 세션 참가 메서드
     * 화상 채팅 세션을 초기화하고 연결하는 핵심 메서드
     */
    joinSession() {
      // OpenVidu 객체 생성
      this.OV = new OpenVidu();

      this.setState(
          {
              session: this.OV.initSession(),  // 새 세션 초기화
          },
          () => {
              let mySession = this.state.session;

              // 이벤트 핸들러 설정
              // 1. 새로운 스트림이 생성될 때 (다른 참가자가 입장할 때)
              mySession.on('streamCreated', (event) => {
                  // 새 참가자의 스트림을 구독
                  let subscriber = mySession.subscribe(event.stream, undefined);
                  let subscribers = this.state.subscribers;
                  subscribers.push(subscriber);

                  this.setState({
                      subscribers: subscribers,
                  });
              });

              // 2. 스트림이 제거될 때 (참가자가 퇴장할 때)
              mySession.on('streamDestroyed', (event) => {
                  this.deleteSubscriber(event.stream.streamManager);
              });

              // 3. 에러 발생 시
              mySession.on('exception', (exception) => {
                  console.warn(exception);
              });

              // 토큰을 가져와서 세션에 연결
              this.getToken().then((token) => {
                  // 세션에 연결 시도
                  mySession.connect(token, { clientData: this.state.myUserName })
                      .then(async () => {
                          // 사용자의 미디어 스트림 설정
                          let publisher = await this.OV.initPublisherAsync(undefined, {
                              audioSource: undefined,      // 기본 마이크 사용
                              videoSource: undefined,      // 기본 카메라 사용
                              publishAudio: true,         // 오디오 활성화
                              publishVideo: true,         // 비디오 활성화
                              resolution: '640x480',      // 비디오 해상도
                              frameRate: 30,             // 프레임 레이트
                              insertMode: 'APPEND',      // 비디오 삽입 모드
                              mirror: false,             // 미러링 비활성화
                          });

                          // 스트림 발행
                          mySession.publish(publisher);

                          // 현재 사용 가능한 비디오 장치 정보 가져오기
                          let devices = await this.OV.getDevices();
                          let videoDevices = devices.filter(device => device.kind === 'videoinput');
                          let currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                          let currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                          // 상태 업데이트
                          this.setState({
                              currentVideoDevice: currentVideoDevice,
                              mainStreamManager: publisher,
                              publisher: publisher,
                          });
                      })
                      .catch((error) => {
                          console.log('There was an error connecting to the session:', error.code, error.message);
                      });
              });
          },
      );
  }

  /**
   * 세션 종료 메서드
   * 현재 세션을 종료하고 모든 상태를 초기화
   */
  leaveSession() {
      const mySession = this.state.session;

      if (mySession) {
          mySession.disconnect();
      }

      // 모든 상태 초기화
      this.OV = null;
      this.setState({
          session: undefined,
          subscribers: [],
          mySessionId: 'SessionA',
          myUserName: 'Participant' + Math.floor(Math.random() * 100),
          mainStreamManager: undefined,
          publisher: undefined
      });
  }

  /**
   * 카메라 전환 메서드
   * 사용 가능한 다른 카메라로 전환
   */
  async switchCamera() {
      try {
          // 사용 가능한 비디오 장치 목록 가져오기
          const devices = await this.OV.getDevices()
          let videoDevices = devices.filter(device => device.kind === 'videoinput');

          // 두 개 이상의 카메라가 있는 경우에만 전환
          if (videoDevices && videoDevices.length > 1) {
              // 현재 사용 중인 카메라가 아닌 다른 카메라 선택
              let newVideoDevice = videoDevices.filter(device => device.deviceId !== this.state.currentVideoDevice.deviceId)

              if (newVideoDevice.length > 0) {
                  // 새로운 카메라로 스트림 생성
                  let newPublisher = this.OV.initPublisher(undefined, {
                      videoSource: newVideoDevice[0].deviceId,
                      publishAudio: true,
                      publishVideo: true,
                      mirror: true
                  });

                  // 기존 스트림을 제거하고 새 스트림으로 교체
                  await this.state.session.unpublish(this.state.mainStreamManager)
                  await this.state.session.publish(newPublisher)
                  this.setState({
                      currentVideoDevice: newVideoDevice[0],
                      mainStreamManager: newPublisher,
                      publisher: newPublisher,
                  });
              }
          }
      } catch (e) {
          console.error(e);
      }
  }

  /**
     * 컴포넌트 렌더링 메서드
     * 화상 채팅 UI와 게임 인터페이스를 렌더링
     */
  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;

    return (
        <div className="container">
            {/* 세션 참가 전 화면 렌더링 */}
            {this.state.session === undefined ? (
                <div id="join">
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1> Join a video session </h1>
                        {/* 세션 참가 폼 */}
                        <form className="form-group" onSubmit={this.joinSession}>
                            {/* 사용자 이름 입력 필드 */}
                            <p>
                                <label>Participant: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={this.handleChangeUserName}
                                    required
                                />
                            </p>
                            {/* 세션 ID 입력 필드 */}
                            <p>
                                <label> Session: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={this.handleChangeSessionId}
                                    required
                                />
                            </p>
                            {/* 참가 버튼 */}
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {/* 세션 참가 후 화면 렌더링 */}
            {this.state.session !== undefined ? (
                <div id="session">
                    {/* 세션 헤더: 세션 제목과 컨트롤 버튼들 */}
                    <div id="session-header">
                        <h1 id="session-title">{mySessionId}</h1>
                        {/* 세션 나가기 버튼 */}
                        <input
                            className="btn btn-large btn-danger"
                            type="button"
                            id="buttonLeaveSession"
                            onClick={this.leaveSession}
                            value="Leave session"
                        />
                        {/* 카메라 전환 버튼 */}
                        <input
                            className="btn btn-large btn-success"
                            type="button"
                            id="buttonSwitchCamera"
                            onClick={this.switchCamera}
                            value="Switch Camera"
                        />
                    </div>

                    {/* 메인 비디오 화면 */}
                    {this.state.mainStreamManager !== undefined ? (
                        <div id="main-video" className="col-md-6">
                            {/* 메인 비디오 컴포넌트 */}
                            <UserVideoComponent streamManager={this.state.mainStreamManager} />
                            
                            {/* 게임 컨트롤 영역 */}
                            <div style={{ margin: '10px' }}>
                                {/* 게임 시작 버튼 */}
                                <button 
                                    onClick={this.startGame}
                                    disabled={this.state.isGameActive}
                                    className="btn btn-primary mr-2"
                                >
                                    게임 시작
                                </button>
                                {/* 게임 종료 버튼 */}
                                <button 
                                    onClick={this.stopGame}
                                    disabled={!this.state.isGameActive}
                                    className="btn btn-danger"
                                >
                                    게임 종료
                                </button>
                                {/* 금칙어 카운트 표시 */}
                                <div id="count" className="mt-3">
                                    "금칙어(아니)" 카운트: {this.state.forbiddenWordCount}
                                </div>
                                {/* 음성 인식 결과 표시 */}
                                <div id="subtitles" className="mt-2 p-3 bg-light rounded">
                                    {this.state.transcript}
                                    <span style={{color: 'gray'}}>
                                        {this.state.interimTranscript}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* 참가자 비디오 목록 */}
                    <div id="video-container" className="col-md-6">
                        {/* 자신의 비디오 스트림 */}
                        {this.state.publisher !== undefined ? (
                            <div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
                                <UserVideoComponent streamManager={this.state.publisher} />
                            </div>
                        ) : null}
                        {/* 다른 참가자들의 비디오 스트림 */}
                        {this.state.subscribers.map((sub, i) => (
                            <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
                                <span>{sub.id}</span>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

/**
 * OpenVidu 토큰 발급 메서드
 * 세션 연결에 필요한 토큰을 서버로부터 받아옴
 */
async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
}

/**
 * OpenVidu 세션 생성 메서드
 * 서버에 새로운 세션 생성을 요청
 */
async createSession(sessionId) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
        headers: { 'Content-Type': 'application/json', },
    });
    return response.data;
}

/**
 * OpenVidu 연결 토큰 생성 메서드
 * 특정 세션에 대한 연결 토큰을 서버에 요청
 */
async createToken(sessionId) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
        headers: { 'Content-Type': 'application/json', },
    });
    return response.data;
}
}

// 컴포넌트 내보내기
export default TestRoomPage;