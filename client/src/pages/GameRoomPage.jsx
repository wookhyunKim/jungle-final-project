import Footer from '../components/layout/Footer';
import Main from '../components/layout/Main';
import StatusBar from '../components/layout/StatusBar';
import '../styles/gameRoomPage.css';

const GameRoomPage = () => {
    return (
        <div className="grid-container">
            <StatusBar/>
            <Main/>
            <Footer/>
        </div>
    );
};

export default GameRoomPage;
