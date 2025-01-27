import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import HostOrGuestPage from './pages/HostOrGuestPage.jsx';
import GameRoomPage from './pages/GameRoomPage.jsx';
import GuestRoomPage from './pages/GuestRoomPage.jsx';
import HostRoomPage from './pages/HostRoomPage.jsx';
// import './app.css';


function App() {
    const [count, setCount] = useState(0);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hostOrGuest" element={<HostOrGuestPage/>} />
                <Route path="/GameRoomPage" element={<GameRoomPage/>}/>
                <Route path='/guestroom' element={<GuestRoomPage/>}/>
                <Route path='/hostroom' element={<HostRoomPage/>}/>
                {/* <Route path="/" element={<Test/>}/> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
