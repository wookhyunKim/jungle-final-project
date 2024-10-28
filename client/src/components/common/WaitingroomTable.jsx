const WaitingroomTable = ({ players = [] }) => {
  const slots = Array(4).fill(null); // 4개의 고정된 슬롯

  return (
      <div className="player-table-container">
          <div className="player-table">
              {slots.map((_, index) => {
                  const player = players[index];
                  console.log(player)
                  
                  return (
                      <div 
                          key={index} 
                          className={`player-slot ${player ? 'occupied' : 'empty'}`}
                      >
                          {player ? (
                              <div className="player-info">
                                  <span>플레이어 #{index + 1}</span>
                                  <span>{player.nickname}</span>
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