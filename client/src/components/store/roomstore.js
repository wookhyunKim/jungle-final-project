//전반적인 진행 상태 정보

// 방 정보 (roomId, 참가자 목록, 호스트 여부)
// 현재의 게임 단계 (홈화면, 대기실, 금칙어 설정 단계, 게임 진행 중, 피버타임, 결과화면)
// 타이머 상태(남은 시간)
// 게임 진행 시간 


import {create} from 'zustand';

export const useRoomStore = create((set)=> ({
    roomID : 0,
    setRoomID : (input_roomcode) => set({roodId:input_roomcode})
}))