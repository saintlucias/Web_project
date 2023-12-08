import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import { Registration_info } from '../modules/Hooks';

const Registration: React.FC = () => {

  const { handleSubmit, 
          handleNameChange, 
          isNameDuplicate, 
          handleCheckNameDuplicate, 
          handleCheckEmailDuplicate,
          handleEmailChange,
          isEmailDuplicate,
          handlePasswordChange,
          handleResetForm,
          name,
          email,
          password
        } = Registration_info();

  return (
    <RegistrationContainer>
      <Title>가입 ㅋㅋ</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Name :
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{ borderColor: isNameDuplicate ? 'red' : '' }}
          />
          {!name.trim() ? (
            <DisabledCheckDuplicatesButton disabled>
              중복 확인
            </DisabledCheckDuplicatesButton>
          ) : (
            <CheckDuplicatesButton
              onClick={handleCheckNameDuplicate}
              disabled={!name.trim()}
            >
              중복 확인
            </CheckDuplicatesButton>
          )}
        </Label>
        <Label>
          Email :
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            style={{ borderColor: isEmailDuplicate ? 'red' : '' }}
          />

          {!email.trim() ? (
            <DisabledCheckDuplicatesButton disabled>
              중복 확인
            </DisabledCheckDuplicatesButton>
          ) : (
            <CheckDuplicatesButton
              onClick={handleCheckEmailDuplicate}
              disabled={!email}>
              중복 확인
            </CheckDuplicatesButton>
          )}
        </Label>
        <Label>
          Password:
          <Input type="password" value={password} onChange={handlePasswordChange} />
        </Label>
        <Button type="submit"><span>회원 가입</span></Button>
        <ResetButton type="button" onClick={handleResetForm}>
          <span>모두 비우기</span>
        </ResetButton>
        <Link to="/" style={{margin:'auto'}}>
          <Button>
            <span>이전 페이지</span>
          </Button>
        </Link>
      </Form>
    </RegistrationContainer>
  );
};

export default Registration;

const RegistrationContainer = styled.div`
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
const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;
const Label = styled.label`
  display: flex;
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
  justify-content: space-evenly;
  align-items: center;
`;
const Input = styled.input`
  padding: 8px;
  font-size: 14px;
`;
const Button = styled.button`
  margin: auto;
  margin-top: 20px;
  background: rgb(0, 172, 238);
  background: linear-gradient(0deg, rgba(0, 172, 0, 1) 0%, rgba(2, 126, 0, 1) 100%);
  width: 200px;
  height: 40px;
  line-height: 42px;
  padding: 0;
  border: none;
  border-radius: 5px;
  position: relative;
  color: white;
  outline: none;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1),
    4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:before,
  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(2, 126, 0, 1);
    transition: all 0.3s ease;
  }

  &:before {
    height: 0%;
    width: 2px;
  }

  &:after {
    width: 0%;
    height: 2px;
  }

  &:hover {
    background: transparent;
    box-shadow: none;

    &:before {
      height: 100%;
    }

    &:after {
      width: 100%;
    }

    span {
      color: rgba(2, 126, 0, 1);

      &:before {
        height: 100%;
      }

      &:after {
        width: 100%;
      }
    }
  }

  span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;

    &:before,
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      background: rgba(2, 126, 0, 1);
      transition: all 0.3s ease;
    }

    &:before {
      width: 2px;
      height: 0%;
    }

    &:after {
      width: 0%;
      height: 2px;
    }
  }
`;

const ResetButton = styled(Button)`
  background-color: #ccc;
  margin-top: 10px;
`;

const ErrorMessage = styled.span`
  color: red;
`;

const CheckDuplicatesButton = styled.button`
  background-color: #4caf50;
  color: black;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
`;
const DisabledCheckDuplicatesButton = styled(CheckDuplicatesButton)`
  background-color: rgba(125, 125, 125, 0.5);
  color: white;
  cursor: not-allowed;
`;

export {
  RegistrationContainer,
  Title,
  Form,
  Label,
  Input,
  Button,
  ResetButton,
  ErrorMessage,
  CheckDuplicatesButton
};