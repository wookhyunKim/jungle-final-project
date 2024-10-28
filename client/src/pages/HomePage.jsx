// src/pages/HomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import characterImg from '../assets/images/mainImage.png'; 
import nextButton from '../assets/images/nextButton.png';
import HostOrGuest from '../components/HostOrGuest';
import Button from '../components/common/Button.jsx'
import '../styles/homePage.css';
import { usePlayerStore } from '../components/store/players.js'

const HomePage = () => {
    const [isHome, setIsHome] = useState(false);
    const navigate = useNavigate();
    
    // Zustand store에서 필요한 상태와 액션들을 가져옴
    const { curPlayer, setNickname } = usePlayerStore();

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };
    
    const toGuestorHost = () => {
        if (curPlayer.nickname.trim()) {  // 닉네임이 비어있지 않은 경우에만
            setIsHome(true);
            navigate('/hostOrGuest', { 
                state: { 
                    nickname: curPlayer.nickname 
                } 
            });
        }
    };
    
    return (
        <div className="game-container">
            {!isHome ? (
                // 시작 화면
                <div className="game-content">
                    <h1 className='game-title text-center text-5xl'>금칙어 게임</h1>
                    <div className="character-container">
                        <img className="goongYe" src={characterImg} alt="goongYe image" />
                    </div>
                    <Button 
                        variant="red" 
                        size="large" 
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
                            value={curPlayer.nickname}
                            onChange={handleNicknameChange}
                        />
                        <button 
                            className="arrow-button"
                            onClick={toGuestorHost}
                            disabled={!curPlayer.nickname.trim()} // 닉네임이 비어있으면 버튼 비활성화
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