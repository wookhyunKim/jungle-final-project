// import HostOrGuest from "../components/HostOrGuest"

// const HostRoomPage = () => {
//   return (
//     <HostOrGuest></HostOrGuest>
//   )
// }

// export default HostRoomPage

// import HostOrGuest from "../components/HostOrGuest"
// import HostImage from '../assets/images/hostAvatar.png';

// const GuestRoomPage = () => {
// //플레이어 정보 상태 가져오기

// // const players = [
// //     {id="1", userId=}
// // ]
// //이전 페이지에서 저장된 코드 가져오기
//   return (
//     <HostOrGuest>
//         <div>
//             <img src={HostImage} style={{ width: '200px', height: '200px'}}/>
//             <div>
//                 <div>Host</div>
//                 <div>플레이어 #1</div>
//             </div>
//         </div>

//         {/* 플레이어 입장하면 실시간으로 이 테이블에, 플레이어 정보 채워지면서 테이블이 늘어남 */}
//         <table>

//         </table>
//         {/* 코드칸 */}
//         <div></div>
//         {/* 시작하기버튼 누르면, "게임 시작을 기다리는 중..."이 뜨고, 호스트가 게임시작 버튼을 누르면 게스트가 다른 페이지로 이동*/}
//         <div></div>
//     </HostOrGuest>
//   )
// }

// export default GuestRoomPage



// import HostImage from '../assets/images/hostAvatar.png';
// import HostOrGuest from "../components/HostOrGuest";
// import { useState } from 'react';
// import Button from '../components/common/Button.jsx'

// const GuestRoomPage = () => {
//   const [playerInfo, setPlayerInfo] = useState([

//     { id: 1, name: 'Player 1' },
//     // Add more player info as needed
//   ]);
//   const [roomCode, setRoomCode] = useState('임시코드');
//   const [isGameStarted, setIsGameStarted] = useState(false);


//   const fetchPlayerInfo = () => {

//   };


//   const fetchRoomCode = () => {

//   };

  // 게임 시작함수
//   const handleStartGame = () => {
//     setIsGameStarted(true);
//   };

//   const playerInfo = [
//       { id: 1, name: 'Player 1' },
//       { id: 2, name: 'Player 2' }
//   ]
//   const [roomCode] = useState('ABC123');
//   const [isGameStarted, setIsGameStarted] = useState(false);

//   const handleStartGame = () => {
//     setIsGameStarted(true);
//   };

//   return (
//     <HostOrGuest>
//       <div>
//         <img src={HostImage} style={{ width: '200px', height: '200px' }} />
//         <div>
//           <div>Host</div>
//           <div>Player #1</div>
//         </div>
//       </div>

//       {/* Player table */}
//       <table>
//         <thead>
//           <tr>
//             <th>Player</th>
//           </tr>
//         </thead>
//         <tbody>
//           {playerInfo.map((player) => (
//             <tr key={player.id}>
//               <td>{player.name}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Room code */}
//       <div>
//         Room Code: <span>{roomCode}</span>
//       </div>

//       {/* Start game button */}
//       {!isGameStarted ? (
//         <Button className="gameStartBtn" onClick={handleStartGame}>시작 하기</Button>
//       ) : (
//         <div>Waiting for the host to start the game...</div>
//       )}
//     </HostOrGuest>
//   );
// };

// export default GuestRoomPage;

import React from 'react'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react";
import HostOrGuest from '../components/HostOrGuest'
import Profile from '../components/Profile'
import WaitingroomTable from '../components/common/WaitingroomTable'

const HostRoomPage = () => {
  const location = useLocation();
  const {roomcode = '',nickname = ''} = location.state || {};

  const [roomCode, setRoomcode] = useState(roomcode);
    const [nickName, setNickname] = useState(nickname);

    useEffect(() => {
      joinSession(roomCode, nickName);
    }, []); // roomCode와 nickName이 변경될 때만 실행
  return (
    <HostOrGuest>
      <Profile role={"HOST"} btnName={"시작하기"} type={true}/>
      
    </HostOrGuest>
  )
}

export default HostRoomPage
