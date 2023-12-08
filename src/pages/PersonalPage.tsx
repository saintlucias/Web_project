import {formatTime} from '../modules/Modules';
import { DelayedNavi, ShowImagePrivate, ImageError } from '../modules/Hooks';
import React from 'react';
import styled from 'styled-components';

const PersonalPage: React.FC = () => {

  const { images } = ShowImagePrivate();
  
  const triggerNavi = DelayedNavi();

  const { handleImageError, handleImageLoaded } = ImageError();

  const ToMainPage = () => {
    return triggerNavi("/")
  }
  const ToPostUpdate = () => {
    return triggerNavi("/PostUpdate");
  }
  const ToUpload = () => {
    return triggerNavi("/Upload");
  }

  return (
    <>
      <Container>
        <h2>개인 페이지</h2>
          <Button onClick={ToMainPage}><span>메인 페이지</span></Button>
          <Button onClick={ToUpload}><span>게시물 등록</span></Button>
      </Container>
      <br />
      <H2>등록한 이미지</H2>
      <ImageContainer>
        {images.map((image: any, index: any) => (
          <ImgContainer key={index}>
            <Image 
            src={image.img} 
            alt='이미지 로드 오류' 
            onError={handleImageError}
            onLoad={handleImageLoaded}
            />
              <Stbutton onClick={ToPostUpdate}>
                게시물 수정
              </Stbutton>
            <p>
              <Span>등록 일자</Span> <br />
              <strong>{formatTime(image.day)}</strong>
            </p>
            <label>
              공개 여부 : <strong>{image.visible}</strong>
            </label>
          </ImgContainer>
        ))}
      </ImageContainer>
      <Container>

      </Container>
    </>
  );
}

export default PersonalPage;

const H2 = styled.h2`
  text-align: center;
`;

const Image = styled.img`
  width: 8vw;
  height: 8vw;
  border-radius:5px;
  object-fit: cover;
  margin: 5px;
  min-width: 120px;
  min-height: 120px;
`;
const Span = styled.span`
  font-size:15px;
  color: rgba(125, 125, 125, 1);
`;
const Container = styled.div`
    display: grid;
    justify-content: center;
    text-align:center;
`;
const ImgContainer = styled.div`
  text-align: center;
  width:200px;
  height:300px;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Stbutton = styled.button`
  border: none;
  border-radius: 5px;
  box-shadow: 1px 2px 6px 2px rgba(0, 0, 0, 0.15);
  font-weight: 800;
  color: rgb(1, 110, 150);
  background-color: transparent;

  &:active {
    background-color: rgba(0, 172, 0, 0.5);
  }
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