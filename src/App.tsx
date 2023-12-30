import AnimatedBackground from "./style/AnimatedBackground";
import styled from 'styled-components';
import ShowImages from "./pages/ShowImages";
import Tab from "./pages/Tab";
import Chat from "./pages/Chat";

function App() {


  return (
    <Body>
      <Tab />
      <AnimatedBackground />
      <DIV>
        <ShowImages />
        <CHATDIV>
          <Chat />
        </CHATDIV>
      </DIV>
    </Body>
  );
}

export default App;
const Body = styled.div`
  min-width:1000px;
  background-color: rgba(125, 125, 125, 0.05);
`;
const DIV = styled.div`
  display : flex;
`;
const CHATDIV = styled.div`
  margin-top: 10px;
  margin:auto;
`;
