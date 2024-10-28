import {useNavigate} from "react-router-dom";
import { useState } from "react";
import HostImage from '../assets/images/hostAvatar.png';
import GuestImage from '../assets/images/guestAvatar.png';
import Button from './common/Button';
import "../styles/host.css"
import "../styles/guest.css"

const Profile = ({role,btnName,children,code}) => {
    const navigate = useNavigate();
    //방만들기버튼 누르면 발생하는 로직...궁금증
    //방번호 코드는 프론트에서 만들어 아님, 서버에서??
    //일단 다른 페이지로 이동하는걸로

    // 필요한 상태와 핸들러 선언
    const [players, setPlayers] = role === "HOST" 
        ? useState([{ nickname: "Host", videoStream: null, isMuted: true }]) 
        : [null, () => {}];  // role이 "HOST"가 아닐 때 빈 상태 반환
    
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
        console.log(event);/////////작동함
        //players 전달
        if (role === "HOST") {
          navigate(targetUrl, { state: { players,code} });
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
        <div className="identity">{role}</div>
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
