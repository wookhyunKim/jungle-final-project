import React from 'react'
import { useLocation } from 'react-router-dom'
import HostOrGuest from '../components/HostOrGuest'
import Profile from '../components/Profile'
import WaitingroomTable from '../components/common/WaitingroomTable'
import '../styles/hostroompage.css'

const HostRoomPage = () => {
  const location = useLocation();
  const {participants = [], code = ''} = location.state || {};

  return (
    <HostOrGuest class="hostroom-container">
      <div>{code}</div>
      {/* <Profile role={"HOST"} btnName={"시작하기"} type={"START"}/> */}
      <WaitingroomTable participants={participants}/>
    </HostOrGuest>
  )
}

export default HostRoomPage
