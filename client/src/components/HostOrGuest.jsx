import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/hostorguest.css"
import "../styles/profile.css"
// import useGameStageStore from"../components/store/gameStage.js"

const HostOrGuest = (props) => {
    // const isSessionActive = useGameStageStore((state) => state.isSessionActive);
    // const setIsSessionActive = useGameStageStore((state) => state.setIsSessionActive);

    const navigate = useNavigate();
    const handleBackBtn = () => {
        navigate(-1);
    };

    // isSessionActive가 true일 때만 hidden 클래스 추가
    // const headerClass = `${"header", isSessionActive ? 'hidden' : ''}`;
    // const footerClass = `${"hostOrGuest-footer", isSessionActive ? 'hidden' : ''}`;

    return (
        <div className="main-container">
            {/* <div className={headerClass}> */}
            <div className="header">
                <h1>금칙어게임</h1>
                <h5>Never, say The word</h5>
            </div>
            <section className="hostOrGuest-main">
                {props.children}
            </section>
            <div className="hostOrGuest-footer">
                <Button 
                    onClick={handleBackBtn} 
                    className="backbutton"
                    variant="black"
                    size="medium">
                    Back
                </Button>
            </div>
        </div>
    );
};


HostOrGuest.propTypes = {
    children: PropTypes.node
}

export default HostOrGuest
