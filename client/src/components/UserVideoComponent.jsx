import React from 'react';
import OpenViduVideoComponent from '../components/OvVideo.jsx';
import './UserVideo.css';

const UserVideoComponent = ({ streamManager }) => {
 // 닉네임 가져오는 함수
 const getNicknameTag = () => {
   // Gets the nickName of the user
   return JSON.parse(streamManager.stream.connection.data).clientData;
 };

 return (
   <div>
     {streamManager !== undefined ? (
       <div className="streamcomponent">
         <OpenViduVideoComponent streamManager={streamManager} />
         <div><p>{getNicknameTag()}</p></div>
       </div>
     ) : null}
   </div>
 );
};

export default UserVideoComponent;