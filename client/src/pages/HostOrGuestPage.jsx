
import HostOrGuest from '../components/HostOrGuest'
import Host from "../components/Host";
import Guest from '../components/Guest';
import "../styles/hostOrGuestPage.css"

const HostOrGuestPage = () => {
    return (
        <HostOrGuest>
            <div className="hostorguest">
                <div className="host">
                    <Host/>
                </div>
                <div className="guest">
                    <Guest/>
                </div>
            </div>
        </HostOrGuest>
    );
  };

  export default HostOrGuestPage;