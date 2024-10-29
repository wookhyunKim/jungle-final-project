import React from 'react'
import { useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from "react";
import HostOrGuest from '../components/HostOrGuest'
import Profile from '../components/Profile'
import useGameStageStore from"../components/store/gameStage.js"

const HostRoomPage = () => {
    const location = useLocation();
    const {code, nickname} = location.state || {};

    const isSessionActive = useGameStageStore((state) => state.isSessionActive);
    const setIsSessionActive = useGameStageStore((state) => state.setIsSessionActive);

    const hasEffectRun = useRef(false);

    useEffect(() => {
      if (!hasEffectRun.current) {
        joinSession(code, nickname);
        hasEffectRun.current = true;
      }
    }, []);

    return (
        <>
            {isSessionActive ? (
                <Profile role={"HOST"} btnName={"시작하기"} type={true}/>
            ) : (
                <>
                    <h1>{code}</h1>
                    <HostOrGuest>
                        <Profile role={"HOST"} btnName={"시작하기"} type={true}/>
                    </HostOrGuest>
                </>
            )}
        </>
    );
}

export default HostRoomPage