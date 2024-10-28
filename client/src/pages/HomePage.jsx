import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import characterImg from '../assets/images/mainImage.png'; 
import nextButton from '../assets/images/nextButton.png';
import HostOrGuest from '../components/HostOrGuest';
import Button from '../components/common/Button.jsx'
import '../styles/homePage.css';
//상태관리 store 가져오기
import { usePlayerStore } from '../components/store/players.js';


const HomePage = () => {
    const [isHome, setIsHome] = useState(false);
    const navigate = useNavigate(); // 페이지 이동을 위한 hook
    const[nickname,setNickname] = useState('');
    
    const toGuestorHost = () => {
      setIsHome(true);
      navigate('/hostOrGuest',{state:{nickname}});
    }
    return (
      <div className="game-container">
        {!isHome ? (
          // 시작 화면
          <div className="game-content">
            <h1 className='game-title text-center text-5xl text-'>금칙어 게임</h1>
            <div className="character-container">
              <img className="goongYe" src={characterImg} alt="goongYe image" />
            </div>
            <Button 
              variant="red" size="large" 
              onClick={() => setIsHome(true)}
              className="text-white"
            >
              시작하기
            </Button>
          </div>
        ) : (
          <HostOrGuest>
            <div className="input-container">
              <input 
                type="text" 
                placeholder="닉네임을 입력하세요" 
                className="nickname-input"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <button 
                className="arrow-button"
                onClick={toGuestorHost} // 게스트인지 호스트인지 선택하는 페이지
              >
                <img src={nextButton} alt="next" />
              </button>
            </div>
          </HostOrGuest>
        )}
      </div>
    );
  };
  
  export default HomePage;