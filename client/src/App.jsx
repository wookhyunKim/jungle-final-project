import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import HostOrGuestPage from "./pages/HostOrGuestPage.jsx";
import GameRoomPage from "./pages/GameRoomPage.jsx";
import GuestRoomPage from "./pages/GuestRoomPage.jsx";
import HostRoomPage from "./pages/HostRoomPage.jsx";
import TakePhotosPage from "./pages/TakePhotosPage.jsx";
import TestRoomPage from "./pages/TestRoomPage.jsx";
import GuestWaitPage from "./pages/GuestWaitPage.jsx";
// import './app.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hostOrGuest" element={<HostOrGuestPage />} />
                <Route path="/GameRoomPage" element={<GameRoomPage />} />
                {/* <Route path='/guestroom' element={<GuestRoomPage/>}/> */}
                <Route path="/guestroom" element={<GuestWaitPage />} />
                <Route path="/hostroom" element={<HostRoomPage />} />
                <Route path="/testroom" element={<TestRoomPage />} />
                {/* <Route path="/" element={<Test/>}/> */}
                <Route path="/takephotos" element={<TakePhotosPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
