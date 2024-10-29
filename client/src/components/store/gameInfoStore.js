import {create} from 'zustand';

const useStoreTime = create((set) => ({
    time: 300, // 초기 시간 설정(5분)
    setTime: (newTime) => set({ time: newTime }),
    decrementTime: () => set((state) => ({ time: Math.max(state.time - 1, 0) })),
}));

export default useStoreTime;