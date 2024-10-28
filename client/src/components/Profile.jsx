import {useNavigate} from "react-router-dom";
import { useEffect,useState,useRef } from "react";
import HostImage from '../assets/images/hostAvatar.png';
import GuestImage from '../assets/images/guestAvatar.png';
import Button from './common/Button';
import "../styles/host.css"
import "../styles/guest.css"

const Profile = ({role,btnName,code,name,type}) => {
    const navigate = useNavigate();
    //방만들기버튼 누르면 발생하는 로직...궁금증
    //방번호 코드는 프론트에서 만들어 아님, 서버에서??
    //일단 다른 페이지로 이동하는걸로

    const [roomCode, setRoomcode] = useState(code);
    const [nickname, setNickname] = useState(name);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [inputCode, setInputValue] = role !== "HOST" 
        ? useState('') 
        : [null, () => {}];  // role이 "HOST"일 때 빈 상태 반환

    const handleInputChange = (event) => {
        if (role !== "HOST") {
            setInputValue(event.target.value);
        }
    };

    const handleMkRoom= (event) => {
        event.preventDefault();
        console.log("Button Clicked!2");

        if(type === true){
          setIsSessionActive(true);
        }
          const targetUrl = role === "HOST" ? "/hostroom" : "/guestroom";
          //players 전달
          navigate(targetUrl, { state: {roomCode,nickname} });
      
        
      //const targetUrl = "/hostroom";
      //navigate(targetUrl);
    }

    const startGame = (event) => {
      event.preventDefault();
      console.log("Button Clicked!");
      setIsSessionActive(true); // 상태를 true로 변경하여 session 표시
    }

  return (
    <>
      <img className="image" src={role === "HOST" ? HostImage : GuestImage} style={{ width: '200px', height: '200px'}}/>
      <div className="descript">
        <div className="identity">{name}</div>
        <div className="border-line"/>
        {type === true && (
                    <>
                        <div className="player-table-container" style={{ display: isSessionActive ? 'none' : 'block', marginTop: '20px' }}>
                            <div className="player-table">
                                {/* player-table 내용 */}
                            </div>
                        </div>

                        <div id="session" style={{ display: isSessionActive ? 'block' : 'none' }}>
                            <div id="session-header">
                                <h1 id="session-title"></h1>
                                <input
                                    className="btn btn-large btn-danger"
                                    type="button"
                                    id="buttonLeaveSession"
                                    onMouseUp={() => leaveSession()}
                                    value="Leave session"
                                />
                            </div>
                            <div id="main-video" className="col-md-6">
                                <p></p>
                                <video autoPlay playsInline={true}></video>
                                <div style={{ margin: '10px' }}>
                                    <button id="startButton" onClick={startGame}>게임 시작</button>
                                    <button id="stopButton" disabled>게임 종료</button>
                                    <div id="count">"금칙어(아니)" 카운트: 0</div>
                                </div>
                            </div>
                            <div id="video-container" className="col-md-6"></div>
                            <div
                                id="subtitles"
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: 'white',
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    fontSize: '18px',
                                    zIndex: 1000
                                }}
                            >
                                자막
                            </div>
                        </div>
                    </>
                )}
        {role === "HOST" ? 
        <Button className="mkroom-btn" onClick={handleMkRoom}>
          {btnName}
          </Button>
        :<>
        <div className="input-form">
        <input id="code" type="text" value={inputCode} onChange={handleInputChange}>
        </input>
        {type === true ? (
  <Button onClick={startGame}>
    {btnName}
  </Button>
) : (
  <Button onClick={handleMkRoom}>
    {btnName}
  </Button>
)}
          </div>
          </> }
        
      </div>
    </>
  )
}

export default Profile
