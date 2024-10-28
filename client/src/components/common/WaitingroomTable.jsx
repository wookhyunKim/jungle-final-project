import { usePlayerStore } from "../store/players";

const WaitingroomTable = () => {
    const { participants } = usePlayerStore();
    console.log("Participants:", participants.participants);
    const playerList = participants.participants;

    return (
        <div className="waitingroom-container max-w-2xl mx-auto p-4">
            <div className="border-2 border-teal-200 rounded-xl bg-teal-50 p-4">
                {Array.isArray(playerList) && playerList.map((playerId, index) => (
                    // playerId가 문자열인 경우를 처리
                    <div 
                        key={playerId || index}
                        className="bg-white mb-3 last:mb-0 p-4 rounded-lg border-2 border-teal-100 hover:border-teal-300 transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-lg text-gray-700">
                                플레이어 #{index + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                                {playerId}
                            </div>
                        </div>
                    </div>
                ))}
                
                {(!playerList || playerList.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                        참가자가 없습니다
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitingroomTable;