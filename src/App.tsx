import AnimatedBackground from "./style/AnimatedBackground";
import styled from 'styled-components';
import ShowImages from "./pages/ShowImages";
import bluecapsulelogo from './images/bluecapsule.jpg';
import { DelayedNavi, useLogout, ChecksToken } from './modules/Hooks';

function App() {
  const { isLoggedIn } = ChecksToken();
  const triggerNavi = DelayedNavi();
  const { handleLogout } = useLogout();

  const handleButtonClick = () => {
    triggerNavi('/PersonalPage');
  };

  const handlelogin = () => {
    triggerNavi('/login')
  }

  return (
    <Body>
      <Container>
        <Bcslogo src={bluecapsulelogo} />
        <>
          <Btn_intro><BtnText>음</BtnText></Btn_intro>
          <Btn_intro><BtnText>음음</BtnText></Btn_intro>
          <Btn_intro><BtnText>음음음</BtnText></Btn_intro>
          <Btn_intro><BtnText>음음음음</BtnText></Btn_intro>
        </>
        {isLoggedIn ? (
          <>
            <Block>
                <Button onClick={handleLogout}>
                  로그아웃
                </Button>
              <Button_pri onClick={handleButtonClick}>
                개인페이지
              </Button_pri>
            </Block>
          </>
        ) : (
          <>
            <Block>
              <Button onClick={handlelogin}>
                로그인
              </Button>
            </Block>
          </>
        )}
      </Container>
      <AnimatedBackground />
      <ShowImages />
    </Body>
  );
}

export default App;
const Body = styled.div`
  min-width:1000px;
  background-color: rgba(125, 0, 0, 0.075);
`;

const Container = styled.div`
  display:flex;
  position:relative;
  margin:auto;
  justify-content:center;
  align-items:center;
  width: 98.8vw;
  height:60px;
  background-color:white;
  min-width:1000px;
`;
const Block = styled.div`
  position: absolute;
  display:flex;
  width:220px;
  right:20px;
  justify-content: space-evenly;
`;
const Button = styled.button`
  position:absoulte;
  width:100px;
  height:40px;
  border:none;
  cursor: pointer;
  border-radius:10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight:bold;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  &:active {
    background-color: rgba(0, 0, 0, 1);
  }
`;
const Button_pri = styled.button`
  position: relative;
  width:100px;
  height:40px;
  border:none;
  cursor: pointer;
  border-radius:10px;
  background-color: rgba(0, 0, 255, 0.6);
  color: white;
  font-weight:bold;

  &:hover {
    background-color: rgba(0, 0, 255, 0.8);
  }
  &:active {
    background-color: rgba(0, 0, 255, 1);
  }
`;
const Btn_intro = styled.button`
  width: 15vw;
  height: 50px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  background-color: transparent;
  min-width: 120px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;



  &:hover span::before {
    width: 100%;
  }
`;

const BtnText = styled.span`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 4px;
    background-color: rgba(0, 60, 255, 0.9);
    transition: width 0.3s ease;
  }
`;
const Bcslogo = styled.img`
  position:absolute;
  left: 50px;
  width:100px;
  height:40px;
  border-radius: 5px;
  margin-left:10px;
`;