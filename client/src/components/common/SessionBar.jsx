import {useState, useEffect} from "react";
import "../../styles/sessionBar.css";

import ProgressBar from "@ramonak/react-progress-bar";

const SessionBar = (remainingTime) => {

    const sessionTime = 20;
    const [sec, setSec] = useState(20);


    //1초씩 줄어드는 effect
    useEffect(()=> {
        //interval_id: 남은시간
        const interval_id = setInterval(() => {
            //1초 간격으로 실행될 함수:setSec
            setSec(prevSec => {
                //남은시간 1초 미만일 때의 prevsec
                if (prevSec <=1) {
                    clearInterval(interval_id);
                    return 0
                }
                //그 외에는 prevsec
                return prevSec -1;
            })
        }, 1000);

          return() => clearInterval(interval_id);
        }, []);

    return (
        <ProgressBar 
            completed={String(sec)}
            maxCompleted={sessionTime}
            barConatinerClassName="container"
            completedClassName="barRemainTime"
            customLabel={`${remainingTime}초`}
            labelClassName="label"
        />
    );
}

export default SessionBar;
