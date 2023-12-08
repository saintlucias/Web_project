import {parseJwt} from '../modules/Modules';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [Tokens, setToken] = useState<string | null>(null);
  const Navigate = useNavigate();


  useEffect(() => {
    const storedToken = sessionStorage.getItem('__bluecapsule__');

    if (storedToken) {
      setToken(storedToken);

      try {
        const decodedToken = parseJwt(storedToken);
        setUserName(decodedToken ? decodedToken.name : null);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserName(null);
      }

      setLoggedIn(true);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName(null);
    setToken(null);
    sessionStorage.removeItem('__bluecapsule__');

  };


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try 
    {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/login`, 
      {
        method: 'POST',
        headers: 
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if( response.ok == false )      
      { 
        const errorMessage = await response.text();
        console.error('Login failed:', errorMessage);
        alert('아이디 혹은 비밀번호가 틀렸음.');       
        return;      
      }
      
      const data = await response.json();

      if( data == null )
      {
        console.error('Token not found in server response : ', data);
        alert('서버로부터 토큰이 넘어오질 않았음.');
        return;
      }

      const receivedToken = data.token;

      try 
      {
        const decodedToken: any = parseJwt(receivedToken);

        if (decodedToken && decodedToken.name) 
        {
          setUserName(decodedToken.name); // 토큰 중 이름값
          setLoggedIn(true);
          setToken(receivedToken);
          sessionStorage.setItem('__bluecapsule__', receivedToken);
          alert("반가워용")
          Navigate('/');
        } 
        else 
        {
          console.error('Decoded token is invalid:', decodedToken);
          alert('서버로부터 유효하지 않은 토큰을 받음.');
        }
      } 
      catch (decodeError) 
      {
        console.error('Error decoding token:', decodeError);
        alert('토큰 로딩 오류발생. 다시 시도 요망');
      } 
    } catch (error: any) 
    {
      console.error('Error during login:', error.message);
      alert('로그인중에 알 수 없는 에러 발생함. 다시 시도 요망.');
    }
  };

  return (
    <LoginContainer>
      <Title>{isLoggedIn ?
        <div>
          <USERNAME>{userName}</USERNAME>
          <USERNAME_SPAN> 님 ㅎㅇ </USERNAME_SPAN>
        </div>
        : '로그인 ㅋㅋ'}
      </Title>
      {isLoggedIn ? (
        <LogoutForm>
          <Button onClick={handleLogout}>Logout</Button>
        </LogoutForm>
      ) : (
        <LoginForm onSubmit={handleLogin}>
          <Label>
            Email:
            <Input type="email" value={email} onChange={handleEmailChange} />
          </Label>
          <Label>
            Password:
            <Input type="password" value={password} onChange={handlePasswordChange} />
          </Label>
          <Button type="submit">Login</Button>
          <Link to="/Register">
            <Button type="button">회원 가입</Button>
          </Link>
        </LoginForm>
      )}
      <Link to="/">
        <Button type="button">메인 페이지</Button>
      </Link>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div` 
max-width: 400px;
margin: auto;
margin-top:50px;

  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const LoginForm = styled.form`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 20px;
`;

const LogoutForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const Label = styled.label`

  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const USERNAME = styled.span`
  color: blue;
`;

const USERNAME_SPAN = styled.span`
  font-size: 20px;
`;