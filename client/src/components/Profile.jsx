import {useNavigate} from "react-router-dom";
import { useEffect,useState,useRef } from "react";
import HostImage from '../assets/images/hostAvatar.png';
import GuestImage from '../assets/images/guestAvatar.png';
import Button from './common/Button';
import "../styles/host.css"
import "../styles/guest.css"
import { joinSession,getSubscribers, getParticipants } from '../connectRoom';
import usePlayerStore from "./store/players";

const Profile = ({role,btnName,children,code,name,type}) => {
    const navigate = useNavigate();
    //방만들기버튼 누르면 발생하는 로직...궁금증
    //방번호 코드는 프론트에서 만들어 아님, 서버에서??
    //일단 다른 페이지로 이동하는걸로

    // 필요한 상태와 핸들러 선언
    const [participants, setParticipants] = useState(getParticipants());
    console.log(participants);
    const [roomCode, setRoomcode] = useState(code);
    const {nickname} = usePlayerStore().curPlayer.nickname;
    const hasJoined = useRef(false);
    
    const [inputCode, setInputValue] = role !== "HOST" 
        ? useState('') 
        : [null, () => {}];  // role이 "HOST"일 때 빈 상태 반환

    const handleInputChange = (event) => {
        if (role !== "HOST") {
            setInputValue(event.target.value);
        }
    };

    const handleHostStart= (event) => {
        // event.preventDefault();
        
        // 1. 여기서 joinsession하기
        console.log(participants);
        // const targetUrl = role === "HOST" ? "/hostroom" : "/guestroom";

      //   //2. players 전달
      //   if (role === "HOST") {
      //     navigate(targetUrl, { state: { participants,roomCode}});
      // } else {
      //     navigate(targetUrl);
      }


  return (
    <>
      <img className="image" src={role === "HOST" ? HostImage : GuestImage} style={{ width: '200px', height: '200px'}}/>
      <div className="descript">
        <div className="identity">{name}</div>
        <div className="border-line"/>
        {children}
        {role === "HOST" ? 
        <Button className="mkroom-btn" onClick={handleHostStart}>
          {btnName}
          </Button>
        :<>
        <div className="input-form">
        <input id="code" type="text" value={inputCode} onChange={handleInputChange}>
        </input>
        <Button onClick={handleGuestStart}>
          {btnName}
          </Button>
          </div>
          </> }
        
      </div>
    </>
  )
}

export default Profile
