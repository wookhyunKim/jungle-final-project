import {useNavigate} from "react-router-dom";
import HostImage from '../assets/images/hostAvatar.png';
import Button from '../components/common/Button';
import "../styles/host.css"
import { generateGameCode } from "../utils/generateGameCode";
import { joinSession } from "../connectRoom";
import usePlayerStore from "./store/players";

const Host = () => {
    const navigate = useNavigate();
    //방만들기버튼 누르면 발생하는 로직...궁금증
    //방번호 코드는 프론트에서 만들어 아님, 서버에서??
    //일단 다른 페이지로 이동하는걸로

    const {curPlayer} = usePlayerStore();


    const handleMkroom= (event) => {
        event.preventDefault();
        // console.log(event);/////////작동함 
        const roomCode = generateGameCode();
        const nickname = curPlayer.nickname;
        joinSession(roomCode, nickname);
        navigate('/hostroom');
    }

  return (
    <>
      <img className="image" src={HostImage} style={{ width: '200px', height: '200px'}}/>
      <div className="descript">
        <div className="identity">Host</div>
        <div className="border-line"/>
        <Button className="mkroom-btn" onClick={handleMkroom}>방만들기</Button>
      </div>
    </>
  )
}

export default Host
