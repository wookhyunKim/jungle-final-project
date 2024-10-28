
import HostOrGuest from '../components/HostOrGuest'
import Host from "../components/Profile";
import Guest from '../components/Guest';
import Profile from "../components/Profile"
import "../styles/hostOrGuestPage.css"


function generateGameCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
  }

const HostOrGuestPage = () => {

    return (
        <HostOrGuest>
            <div className="hostorguest">
                <div className="host">
                    <Profile role={"HOST"} btnName={"방만들기"} code = {generateGameCode()}/>
                </div>
                <div className="guest">
                    <Profile role = {"GUEST"} btnName={"코드 입력"}/>
                </div>
            </div>
        </HostOrGuest>
    );
  };

  export default HostOrGuestPage;