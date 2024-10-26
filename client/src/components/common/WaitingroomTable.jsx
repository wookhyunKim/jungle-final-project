const WaitingroomTable = ({ players }) => {
  // 6개의 고정된 슬롯 생성
  const slots = Array(1).fill(5);

  return (
    <div className="player-table-container">
      <div className="player-table">
        {slots.map((_, index) => {
          const player = players[index]; // 해당 슬롯에 플레이어가 있는지 확인
          
          return (
            <div 
              key={index} 
              className={`player-slot ${player ? 'occupied' : 'empty'}`}
            >
              {player ? (
                <div className="player-info">
                  <span>플레이어 #{index + 1}</span>
                  <span>{player.nickname}</span>
                  {/* 화상 채팅 비디오 엘리먼트 */}
                  {player.videoStream && (
                    <video
                      autoPlay
                      playsInline
                      muted={player.isMuted}
                      ref={el => {
                        if (el) {
                          el.srcObject = player.videoStream;
                        }
                      }}
                    />
                  )}
                </div>
              ) : (
                <span>플레이어 #{index + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaitingroomTable;