import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setuserName] = useState<string>('');

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

    return () => {
      newSocket.close();
    };
  }, []);

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
      <ChatContainer>
        <MessageList>
          {messages.map((message, index) => (
            <Message key={index}>
              {message.startsWith('me :')
                ? message.split('me :')[1]
                : message.startsWith('other :')
                  ? message.split('other :')[1]
                  : message}
            </Message>
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
    background-color: rgba(133, 33, 12, 0.2);
    width: 50vw;
    height: 500px;
    border-radius: 5px;
    margin: auto;
    box-shadow: 1px 6px 6px 1px rgba(55, 125, 233, 0.25);
    overflow-y: scroll;
    min-width: 500px;
  `;

const MessageList = styled.ul`
    padding: 10px;
    list-style: none;
  `;

const Message = styled.li<{ isLeftAligned?: boolean }>`
    margin-bottom: 10px;
    padding: 8px;
    background-color: rgba(55, 12, 23, 0.1);
    border-radius: 5px;
    text-align: ${({ isLeftAligned }) => (isLeftAligned ? 'left' : 'right')};
  `;

const ChatInputContainer = styled.div`
    display: flex;
    margin: auto;
    margin-top: 15px;
    justify-content: center;
    align-items: center;
  `;

const UserNameInput = styled.input`
    border: none;
    background-color: rgba(55, 12, 23, 0.1);
    border-radius: 5px;
    width: 7vw;
    min-width: 100px;
    height: 30px;
  `;

const MessageInput = styled.input`
    border: none;
    background-color: rgba(55, 12, 23, 0.1);
    border-radius: 5px;
    width: 35vw;
    height: 30px;
    margin-left: 5px;
    min-width: 150px;
  `;

const SendButton = styled.button`
    background-color: rgba(55, 12, 23, 0.2);
    margin-left: 5px;
    border: none;
    border-radius: 5px;
    width: 75px;
    height: 30px;
  `;


export default Chat;
