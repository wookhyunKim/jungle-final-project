import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import GuestImage from '../assets/images/guestAvatar.png';
import Button from '../components/common/Button'
import "../styles/guest.css"

const Guest = () => {
  const navigate = useNavigate();
  ///////////////////수정필요////////////////////////

    //코드입력하고 누르면 발생하는 로직...궁금증
    //1. 받은 방번호 코드는 일단 가지고 있다가, 서버로 보내서 확인해야??
    //2. 서버에서, 유효한 번호인지 확인해서, 플레이어 정보 가져와야??
    //3. 그 이후에 페이지 이동??
    const handleCodeSubmit= (event) => {
      event.preventDefault();
      //일단 페이지 이동
      // console.log(inputCode);///작동함
      navigate('/guestroom');
    }
    ////////////////////////////////////////////////

    //입력한 코드, 상태관리
    const [inputCode, setInputValue] = useState('');
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

  return (
    <>
      <img className="image" src={GuestImage} style={{ width: '200px', height: '200px'}}/>
      <div className="descript">
        <div className="identity">Guest</div>
        <div className="border-line"/>
        <div className="input-form">
          <input id="code" type="text" value={inputCode} onChange={handleInputChange}></input>
          <Button onClick={handleCodeSubmit}>코드 입력</Button>
        </div>
      </div>
    </>
  )
}

export default Guest

