import HostOrGuest from "../components/HostOrGuest";
import { useLocation } from "react-router-dom";
import Profile from "../components/Profile";
import "../styles/hostOrGuestPage.css";

function generateGameCode(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
   
    return code;
}
const code = generateGameCode();

const HostOrGuestPage = () => {
    const location = useLocation();
    const { nickname } = location.state || {};

    return (
        <>
        <HostOrGuest>
            <div className="hostorguest">
                <div className="host">
                    <Profile
                        role={"HOST"}
                        btnName={"방만들기"}
                        code={code}
                        // name={"HOST"}
                        name={nickname}
                    />
                </div>
                <div className="guest">
                    <Profile
                        role={"GUEST"}
                        btnName={"코드 입력"}
                        // name={"GUEST"}
                        name={nickname}
                    />
                </div>
            </div>
        </HostOrGuest>
        </>
    );
};

export default HostOrGuestPage;
