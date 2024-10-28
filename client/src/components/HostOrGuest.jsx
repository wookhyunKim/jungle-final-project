import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
// import GameContext from '../contexts/GameContext'
import Button from "../components/common/Button";
import "../styles/hostorguest.css"

const HostOrGuest = (props) => {

    //뒤로가기버튼
    const navigate = useNavigate();
    const handleBackBtn = () => {
        navigate(-1);
    };
    return (
        <div className="main-container">
            <div className="header">
                <h1>금칙어 게임</h1>
                <h5>Never, say The word</h5>
            </div>
            <section className="hostOrGuest-main">
                {props.children}
            </section>
            <div className="footer">
                <Button onClick={handleBackBtn} className="backbutton"
                variant="black"
                size = "medium">Back</Button>
            </div>
        </div>
    );
  };

  HostOrGuest.propTypes = {
    children : PropTypes.node
  }
  
  export default HostOrGuest;