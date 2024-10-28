import {create} from 'zustand';

// 플레이어 관련 상태

// 현재 플레이어 정보
// 각 플레이어 정보(닉네임, ID, 순서)
// 플레이어별 금칙어 목록
// 플레이어별 필터 상태
// 마이크 on, off 상태
// 보상 카드 보유 현황

export const usePlayerStore = create((set) => ({
    // 현재 플레이어 설정
    curPlayer: {
        nickname: '',
        isHost : false,
    },

    //참가자 리스트
    participants: [],
    updateParticipantList : (new_list) => set((state)=>({
        participants : {
            ...state.participants,
            participants:new_list
        }
    })),

    //닉네임설정
    setNickname: (input_nickname) => set((state)=>({
        curPlayer: {
            ...state.curPlayer,
            nickname:input_nickname
        }
    })),

    //호스트 여부설정
    setIsHost: () => set((state)=>({
        curPlayer: {
            ...state.curPlayer,
            isHost : true
        }
    })),

    // 플레이어 리스트
    players : {},

    // // 액션: 플레이어 추가
    // addPlayer: (nickname) => set((state) => ({
    //     playerList: [
    //         ...state.playerList,
    //         {
    //             playerNum: state.playerList.length + 1,
    //             nickname: nickname,
    //             filter: [],
    //             mike: true,
    //             sound: true,
    //             rewardCards: []
    //         }
    //     ]
    // })),

    // 액션: 플레이어 삭제
    deletePlayer: (playerId) => set((state) => ({
        playerList: state.playerList.filter((player, index) => index !== playerId)
    })),

    // 액션: 상태 초기화
    resetPlayerState: () => set({
        curPlayer: {
            nickname: '',
            isHost: false,
        },
        playerList: []
    })
}));

export default usePlayerStore;
