import {useNavigate} from "react-router-dom"
import {useRef, useEffect, useCallback} from 'react'
import { useState } from "react"
import HostImage from '../assets/images/hostAvatar.png'
import GuestImage from '../assets/images/guestAvatar.png'
import Button from './common/Button'
import "../styles/host.css"
import "../styles/guest.css"
import "../styles/profile.css"
import useGameStageStore from"../components/store/gameStage.js"



// 세션 컨트롤 컴포넌트

const SessionControls = () => {
  const isGameActive = useGameStageStore(state => state.isGameActive);
  const setIsGameActive = useGameStageStore(state => state.setIsGameActive);
  const forbiddenWordCount = useGameStageStore(state => state.forbiddenWordCount);
  const setForbiddenWordCount = useGameStageStore(state => state.setForbiddenWordCount);  //
  const transcript = useGameStageStore(state => state.transcript);
  const setTranscript = useGameStageStore(state => state.setTranscript);
  const interimTranscript = useGameStageStore(state => state.interimTranscript);
  const setInterimTranscript = useGameStageStore(state => state.setInterimTranscript);
  const resetGame = useGameStageStore(state => state.resetGame);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
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

    // 음성 인식 이벤트 핸들러 설정
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isGameActive]);

  const countForbiddenWords = useCallback((transcript) => {
    const word = "아니";
    const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
    setForbiddenWordCount(occurrences);  // 직접 set 함수 사용
  }, [setForbiddenWordCount]); 

  const handleStartGame = () => {
    resetGame();
    setIsGameActive(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopGame = () => {
    setIsGameActive(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={{ margin: '10px' }}>
      <button onClick={handleStartGame} disabled={isGameActive}>
        게임 시작
      </button>
      <button onClick={handleStopGame} disabled={!isGameActive}>
        게임 종료
      </button>
      <div id="count">금칙어(아니) 카운트: {forbiddenWordCount}</div>
      <div id="subtitles">
        {transcript}
        <span style={{color: 'gray'}}>{interimTranscript}</span>
      </div>
    </div>
  );
};

// 비디오 세션 컴포넌트
const VideoSession = ({onGameStart, onLeaveSession }) => (
  // <div id="session" style={{ display: isSessionActive ? 'block' : 'none' }}>
  <div id="session">
    <div id="session-header">
      <h1 id="session-title"></h1>
      <input
        className="btn btn-large btn-danger"
        type="button"
        id="buttonLeaveSession"
        onClick={onLeaveSession}
        value="Leave session"
      />
    </div>
    <div id="main-video" className="col-md-6">
      <p></p>
      <video autoPlay playsInline={true}></video>
      <SessionControls onGameStart={onGameStart} />
    </div>
    <div id="video-container" className="col-md-6"></div>
  </div>
);

// 입력 폼 컴포넌트
const InputForm = ({ inputCode, onInputChange, type, btnName, onStartGame, onMkRoom }) => (
  <div className="input-form">
    <input 
      id="code" 
      type="text" 
      value={inputCode} 
      onChange={onInputChange}
    />
    <Button onClick={type ? onStartGame : onMkRoom}>
      {btnName}
    </Button>
  </div>
);

const Profile = ({role, btnName, code, name, type}) => {
  
  const navigate = useNavigate();
  const isHost = role === "HOST";

  //상태관리 가져오기/////////////
  const isSessionActive = useGameStageStore((state) => state.isSessionActive);
  const setIsSessionActive = useGameStageStore((state) => state.setIsSessionActive);
  // const [isGameActive, setIsGameActive] = useState(false);
  const [inputCode, setInputValue] = !isHost ? useState('') : [null, () => {}];

  /////////////////////////////////////

  const handleInputChange = (event) => {
    if (!isHost) {
      setInputValue(event.target.value);
    }
  };

  const handleMkRoom = (event) => {
    event.preventDefault();
    if (type) {
      setIsSessionActive(true);
    }
    
    const targetUrl = isHost ? "/hostroom" : "/guestroom";
    const codeToSend = isHost ? code : inputCode;
    
    navigate(targetUrl, { state: { code: codeToSend, nickname: name } });
  };

  const startGame = (event) => {
    event.preventDefault();
    console.log("Session started!");
    setIsSessionActive(true);
  };

  return (
    <>
      <img className="image" 
        src={isHost ? HostImage : GuestImage} 
        style={{ 
          width: '200px', 
          height: '200px'
        }}
        // style={{ 
        //   display: isSessionActive ? 'none' : 'block',
        //   width: '200px', 
        //   height: '200px'
        // }}
      />
      <div className="descript">
        <div className="identity">{name}</div>
        <div className="border-line"/>
        
        {type && (
          <>
            <div 
              className="player-table-container" 
              style={{ 
                // display: isSessionActive ? 'none' : 'block', 
                marginTop: '20px' 
              }}
              // style={{ 
              //   marginTop: '20px' 
              // }}
            >
              <div className="player-table" />
            </div>

            <VideoSession 
              // isSessionActive={isSessionActive}
              onGameStart={startGame}
              onLeaveSession={() => {}} // leaveSession 구현 필요
            />
          </>
        )}


        {/* 호스트인지, 게스트인지 여부에 따라서, button/inputform 나타남 */}
        {isHost ? (
          <Button className="mkroom-btn"
              onClick={handleMkRoom}>
            {btnName}
          </Button>
        ) : (
          <InputForm 
            inputCode={inputCode}
            onInputChange={handleInputChange}
            type={type}
            btnName={btnName}
            onStartGame={startGame}
            onClick={leaveSession}
            onMkRoom={handleMkRoom}
          />
        )}
      </div>
    </>
  );
};

export default Profile;