import HostImage from '../assets/images/hostAvatar.png';
import HostOrGuest from "../components/HostOrGuest";
import { useState } from 'react';
import Button from '../components/common/Button.jsx';

const HostRoomPage = () => {
  const playerInfo = [
      { id: 1, name: 'Player 1' },
      { id: 2, name: 'Player 2' }
  ]
  const [roomCode] = useState('ABC123');
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <HostOrGuest>
      <div>
        <img src={HostImage} style={{ width: '200px', height: '200px' }} />
        <div>
          <div>Guest</div>
          <div>Player #1</div>
        </div>
      </div>

      {/* Player table */}
      <table>
        <thead>
          <tr>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {playerInfo.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Room code */}
      <div>
        Room Code: <span>{roomCode}</span>
      </div>

      {/* Start game button */}
      {!isGameStarted ? (
        <Button onClick={handleStartGame}>시작 하기</Button>
      ) : (
        <div>Waiting for the host to start the game...</div>
      )}
    </HostOrGuest>
  );
};

export default HostRoomPage;
