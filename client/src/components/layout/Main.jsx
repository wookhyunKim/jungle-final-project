import MainSingleVideo from '../common/MainSingleVideo'
import MissionCard from '../common/MissionCard'
import SideElement from '../common/SideElement'
import UserBannedWords from '../common/UserBannedWords'

import goongYeImage from '../../assets/images/goongYeImage.png'
import GoongYeCmtSec from '../goongYeCmtSec'

import "../../styles/Main.css"

const Main = () => {
    // 금칙어 데이터
    const bannedWordsData = {
        woogi: ["개꿀따리"],
        naPPayeom: ["뭐요"],
        taemtaem: ["마라여"]
    }
    //내 미션
    const myMisson = "naPPayeom이 머리만지게 하기"

  return (
    <div className="main">
        <div className ="Main-videos">
            <MainSingleVideo/>
            <MainSingleVideo/>
            <MainSingleVideo/>
            <MainSingleVideo/>
        </div>
        <div className="Main-sideSection">
            {/* 금칙어 목록 */}
            <SideElement title="금칙어 목록">
                <UserBannedWords number='1' nickname='woogi' bannedWords={bannedWordsData.woogi}></UserBannedWords>
                <UserBannedWords number='2' nickname='naPPayeom' bannedWords={bannedWordsData.naPPayeom}></UserBannedWords>
                <UserBannedWords number='3' nickname='taemtaem' bannedWords={bannedWordsData.taemtaem}></UserBannedWords>
            </SideElement>
            {/* 나의 목록 */}
            <SideElement title="나의 미션">
                <MissionCard missonContent={myMisson}/>
            </SideElement>
            {/* 진행자 */}
            <SideElement className="goongYeSection">
                <>
                <img className="goongYeImage" src={goongYeImage}/>
                <GoongYeCmtSec/>
                </>
            </SideElement>
        </div>
    </div>
  )
}

export default Main
