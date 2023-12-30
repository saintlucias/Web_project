import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TokenVerify } from '../modules/Hooks';

const Login: React.FC = () => {

  const {
          handleLogin,
          handleLogout,
          handleEmailChange,
          handlePasswordChange,
          userName,
          isLoggedIn,
          email,
          password
        } = TokenVerify();

  return (
    <LoginContainer>
      <Title>{isLoggedIn ?
        <div>
          <p>Loading....</p>
        </div>
        : '로그인 ㅋㅋ'}
      </Title>
      {isLoggedIn ? (
        <>
        </>
      ) : (
        <LoginForm onSubmit={handleLogin}>
          <Label>
            Email:
            <Input type="email" value={email} onChange={handleEmailChange} autoComplete="attributes" />
          </Label>
          <Label>
            Password:
            <Input type="password" value={password} onChange={handlePasswordChange} autoComplete="current-password"/>
            
          </Label>
          <Button type="submit">Login</Button>
          <Link to="/Register">
            <Button type="button">회원 가입</Button>
          </Link>
        </LoginForm>
      )}
    </LoginContainer>
  );
}

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