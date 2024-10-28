const WaitingroomTable = ({ participants = [] }) => {
    // Ensure that `participants` is an array
    const playerList = Array.isArray(participants) ? participants : [];
    const slots = Array(4).fill(null); // 4 fixed slots

    return (
        <div className="player-table-container">
            <div className="player-table">
                {playerList.map((user, index) => (
                    <div
                        key={index}
                        className={`player-slot ${user ? "occupied" : "empty"}`}
                    >
                        {user ? (
                            <div className="player-info">
                                <span>
                                    플레이어 #{index + 1} : {user}
                                </span>
                            </div>
                        ) : (
                            <span>플레이어 #{index + 1}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaitingroomTable;
