import Timer from '../common/FullTimerClock'
import ProfileCard from '../common/ProfileCard'
import SessionBar from '../common/SessionBar'
import '../../styles/statusBar.css'
import teamLogo from '../../assets/images/teamLogoImage.png'

const StatusBar = () => {
  return (
    <div className="status-bar">
        <img className="teamLogo" src={teamLogo}></img>
        <SessionBar className="sessionBar"/>
        <ProfileCard className="profileCard"/>
        <Timer className="timer"/>
    </div>
  )
}

export default StatusBar
