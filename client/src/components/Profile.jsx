import {useNavigate} from "react-router-dom";
import { useEffect,useState,useRef } from "react";
import HostImage from '../assets/images/hostAvatar.png';
import GuestImage from '../assets/images/guestAvatar.png';
import Button from './common/Button';
import "../styles/host.css"
import "../styles/guest.css"
import { joinSession,getSubscribers } from '../connectRoom';

const Profile = ({role,btnName,children,code,name,type}) => {
    const navigate = useNavigate();
    //방만들기버튼 누르면 발생하는 로직...궁금증
    //방번호 코드는 프론트에서 만들어 아님, 서버에서??
    //일단 다른 페이지로 이동하는걸로

        // 필요한 상태와 핸들러 선언
        const [players, setPlayers] = useState(() => {
          const subscribers = getSubscribers();
          return subscribers;
      });
    const [roomCode, setRoomcode] = useState(code);
    const [nickname, setNickname] = useState(name);

    const hasJoined = useRef(false);

useEffect(() => {
    if (!hasJoined.current) {
        joinSession(roomCode, nickname);
        hasJoined.current = true;  // 한 번만 실행되도록 설정
    }
}, []);
    
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

        const targetUrl = role === "HOST" ? "/hostroom" : "/guestroom";
        //players 전달
        if (role === "HOST") {
          navigate(targetUrl, { state: { players,roomCode} });
      } else {
          navigate(targetUrl);
      }

      //const targetUrl = "/hostroom";
      //navigate(targetUrl);
    }

  return (
    <>
      <img className="image" src={role === "HOST" ? HostImage : GuestImage} style={{ width: '200px', height: '200px'}}/>
      <div className="descript">
        <div className="identity">{name}</div>
        <div className="border-line"/>
        {children}
        {role === "HOST" ? 
        <Button className="mkroom-btn" onClick={handleMkRoom}>
          {btnName}
          </Button>
        :<>
        <div className="input-form">
        <input id="code" type="text" value={inputCode} onChange={handleInputChange}>
        </input>
        <Button onClick={handleMkRoom}>
          {btnName}
          </Button>
          </div>
          </> }
        
      </div>
    </>
  )
}

export default Profile
