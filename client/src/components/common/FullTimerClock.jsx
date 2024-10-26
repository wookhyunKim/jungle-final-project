//그외에 추가해서 구현할 점

//호스트가 게임 시작하기 누르면, 타이머 시작됨
//다만 모달 뜨는 순간만 타이머 멈춤

import { useEffect, useState } from "react";

const timerStyles = {
    container: {
        height:'48px',
        border: '2px solid black',
        background: 'white',
        padding: '10px 30px',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#0066FF',
        display: 'inline-block',
        textShadow: '-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black'
    }
};

const getSeconds = (time) => {
    const seconds = Number(time % 60);
    if(seconds < 10) {
        return "0" + String(seconds);
    } else {
        return String(seconds);
    }
}

const Timer = () => {
    const [time, setTime] = useState(300); // 남은 시간 (단위: 초)
    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [time]);
    return (
        <div className="timer-container" style={timerStyles.container}>
            <div className="timer-box">
                <span className="timer-number">{parseInt(time / 60)}</span>
                <span className="timer-colon">:</span>
                <span className="timer-number">{getSeconds(time)}</span>
            </div>
        </div>
    );
}


export default Timer;