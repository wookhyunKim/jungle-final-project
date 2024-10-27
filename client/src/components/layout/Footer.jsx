import Input from '../common/Input'
import Button from '../common/Button'
import '../../styles/footer.css'
import soundOnIcon from '../../assets/images/SoundOnIcon.png';
import soundOffIcon from '../../assets/images/SoundOffIcon.png';
import treasureCardsIcon from '../../assets/images/treasureCardsIcon.png';

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer-tip">
            <img src={soundOnIcon}></img>
            <img src={soundOffIcon}></img>
            <img src={treasureCardsIcon}></img>
        </div>
        {/* click시 발생할 로직 추가해야 */}
        <Button variant="red" size="medium">게임 종료</Button>
        <Input></Input>
    </div>
  )
}

export default Footer
