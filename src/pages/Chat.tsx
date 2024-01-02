import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setuserName] = useState<string>('');
  const ChatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://192.168.0.23:4002');

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newSocket.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(newSocket);

    ChatRef.current?.scrollTo(0, ChatRef.current.scrollHeight);
    return () => {
      newSocket.close();
    };

  }, [messages]); 


  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(`${userName} : ${currentMessage}`);
      setCurrentMessage('');
    }
  };
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      const trimmedUserName = userName.trim();
      const trimmedMessage = currentMessage.trim();

      if (trimmedUserName !== '' && trimmedMessage !== '') {
        sendMessage();
      }
    }
  };

  return (
    <div>
      <Header>블루캡슐 AI 팀 오늘의 점심 메뉴 결정</Header>
      <ChatContainer ref={ChatRef}>
        <MessageList>
          {messages.map((message, index) => (
            message.startsWith('me :') || message.startsWith('other :') ? (
              <AlignedMessage key={index} isOwnMessage={message.startsWith('me :')}>
                <Message isOwnMessage={message.startsWith('me :')}>
                  {message.startsWith('me :')
                    ? message.split('me :')[1]
                    : message.startsWith('other :')
                      ? message.split('other :')[1]
                      : message}
                </Message>
              </AlignedMessage>
            ) : (
              <CenteredMessage key={index}>
                {message}
              </CenteredMessage>
            )
          ))}
        </MessageList>
      </ChatContainer>
      <ChatInputContainer>
        <UserNameInput
          type="text"
          placeholder="이름 입력"
          onKeyUp={handleKeyPress}
          onChange={(e) => setuserName(e.target.value)}
        />
        <MessageInput
          type="text"
          value={currentMessage}
          onKeyUp={handleKeyPress}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="메시지 입력"
        />
        <SendButton onClick={() => sendMessage()} disabled={!userName || !currentMessage.trim()}>Send</SendButton>
      </ChatInputContainer>
    </div>
  );
};

const Header = styled.h2`
    text-align: center;
    padding: 20px;
  `;

const ChatContainer = styled.div`
    background-color: rgb(186,206,224);
    width: 50vw;
    height: 500px;
    border-radius: 5px;
    margin: auto;
    box-shadow: 1px 6px 6px 1px rgba(55, 125, 233, 0.25);
    overflow-y: scroll;
    min-width: 500px;
  `;

  const AlignedMessage = styled.div<{ isOwnMessage?: boolean }>`
  display: flex;
  justify-content: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')};
`;

const MessageList = styled.div`
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space- evenly;
  `;
  const Message = styled.div<{ isOwnMessage?: boolean }>`
  width:auto;
  background-color: ${({ isOwnMessage }) => (isOwnMessage ? 'rgb(255,235,51)' : 'rgb(255, 255, 255)')};
  margin: 10px 30px;
  border-radius: 7.5px;
  padding: 8px;
  flex-wrap: column;
`;
const CenteredMessage = styled(Message)`
  width:90%;
  margin: auto;
  margin-top:10px;
  margin-bottom: 10px;
  text-align: center;
  background-color: rgba(55, 12, 23, 0.1);
  border-radius: 5px;
`;
const ChatInputContainer = styled.div`
    display: flex;
    margin: auto;
    margin-top: 15px;
    justify-content: center;
    align-items: center;
  `;

const UserNameInput = styled.input`
    border: 1px solid black;
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
    width: 7vw;
    min-width: 100px;
    height: 30px;
  `;

const MessageInput = styled.input`
    border: 1px solid black;
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
    width: 35vw;
    height: 30px;
    margin-left: 5px;
    min-width: 150px;
  `;

const SendButton = styled.button`
    background-color: ${({ disabled }) => (disabled ? 'rgba(125, 125, 125, 0.25)' : 'rgb(255, 235, 51)')};
    margin-left: 5px;
    border: none;
    border-radius: 5px;
    width: 75px;
    height: 30px;
    font-weight: ${({disabled }) => (disabled ? 100 : 'bold' )};
  `;


export default Chat;
