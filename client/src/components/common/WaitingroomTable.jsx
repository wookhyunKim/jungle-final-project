// import usePlayerStore from "../store/players"  // Zustand store에서 플레이어 정보 관리하는 store import
// import "../../styles/waitingroomTable.css"    

// const WaitingroomTable = () => {
//  // store에서 players 상태를 가져옴 (구조분해할당)
//  // players는 객체 형태 - 예: { 0: {id: 1, nickname: "player1"}, 1: {id: 2, nickname: "player2"} }
//  const {players} = usePlayerStore();  

//  // 4개의 빈 슬롯을 가진 배열 생성 [null, null, null, null]
//  // 이는 4명의 플레이어를 위한 공간을 미리 만드는 것
//  const slots = Array(4).fill(null);

//  return (
//    <div className="player-table-container">
//      <div className="player-table">
//        {
//          // slots 배열을 map으로 순회
//          // _ 는 현재 요소(여기서는 null)를 사용하지 않음을 의미
//          // index는 현재 순회 중인 배열의 인덱스 (0,1,2,3)
//          slots.map((_, index) => {
//            // players 객체에서 현재 인덱스에 해당하는 플레이어 정보를 가져옴
//            // 플레이어가 없다면 undefined
//            const player = players[index]; 
           
//            return (
//              <div 
//                key={index}  // React의 key prop
//                // 조건부 클래스: player가 있으면 'occupied', 없으면 'empty' 클래스 추가
//                className={`player-slot ${player ? 'occupied' : 'empty'}`}
//              >
//                {/* 삼항 연산자로 플레이어 유무에 따라 다른 내용 표시 */}
//                {player ? (
//                  // 플레이어가 있는 경우
//                  <div className="player-info">
//                    <span>player #{index + 1}</span>
//                    <span>&nbsp | &nbsp</span>
//                    <span>{player.nickname}</span>
//                  </div>
//                ) : (
//                  // 플레이어가 없는 경우
//                  <span>플레이어 #{index + 1}</span>
//                )}
//              </div>
//            );
//          })
//        }
//      </div>
//    </div>
//  );
// };

// export default WaitingroomTable;