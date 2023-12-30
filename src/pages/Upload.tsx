import React from 'react';
import styled from 'styled-components';
import { DelayedNavi, LoadUserName, FileLoader} from '../modules/Hooks';

const Upload: React.FC = () => {
  const navigate = DelayedNavi();

  const { userName } = LoadUserName();

  const { handleFileChange,
          handleContentChange,
          handleTitleChange,
          handleUpload,
          handleVisibilityChange, 
          visibility,
          title,
          content } = FileLoader();

  const ToPersonalPage = () => {
    return navigate('/PersonalPage');
  }

  return (
    <>
      <Container>
        <span>{userName} 의 업로드 페이지</span>
        　
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Select value={visibility} onChange={handleVisibilityChange}>
          <option value="yes">게시물 공개</option>
          <option value="no">게시물 비공개</option>
        </Select>
        <Input type="text" placeholder='게시글 제목' value={title} onChange={handleTitleChange}/>
        <Input_textarea placeholder='게시글 내용' value={content} onChange={handleContentChange}/>
        </Container>
        <Container>
            <Button onClick={ToPersonalPage}>
              <span>뒤로가기</span>
            </Button>
          <Button onClick={handleUpload}>
            <span>게시물 등록</span>
          </Button>
      </Container>
    </>
  );
};

export default Upload;

const Container = styled.div`
  display:grid;
  margin-top: 50px;
  justify-content: center;
  text-align:center;
`;
const Select = styled.select`
padding:7.5px;
border: 2px solid rgba(0, 172, 0, 0.25);
border-radius: 5px;
margin: auto;
margin-top: 20px;
  width:100%;
`;
const Input = styled.input `
  padding: 7.5px;
  margin-top: 20px;
  border: 2px solid rgba(0, 172, 0, 0.25);
  border-radius: 5px;
`;
const Input_textarea = styled.textarea `
  margin-top:20px;
  width: 300px; 
  height: 300px; 
  border: 2px solid rgba(0, 172, 0, 0.25);
  border-radius: 5px;
  box-shaodw: 1px 2px 6px 2px rgba(0, 0, 0, 0.15);
  resize: none;

`;
const Button = styled.button`
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
