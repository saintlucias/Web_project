import React, { useState } from 'react';
import styled from 'styled-components';
import { formatTime, encText } from '../modules/Modules';
import { ShowAllImages, DelayedNavi } from '../modules/Hooks';

const ShowImages: React.FC = () => {


  const { images } = ShowAllImages();

  {/* 이미지 넘기기  ex) <  1/4  >  */ }

  const [currentPage, setCurrentPage] = useState<number>(1);

  const imagesPerPage = 4;

  const lastImageIndex = currentPage * imagesPerPage;
  const firstImageIndex = lastImageIndex - imagesPerPage;
  const currentImages = images.slice(firstImageIndex, lastImageIndex);

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handleNextPage = () => {
    if (currentPage === lastImageIndex) {
      setCurrentPage(1);
    }
    else {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  const handlePrevPage = () => {
    if (currentPage === firstImageIndex) {
      setCurrentPage(3);
    }
    else {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };
  {/* ----------------------------------------------------- */ }


  const Navitopost = DelayedNavi();
  const onClickImageInfo = async (userName: string, pnum: string) => {
    Navitopost(`/Viewpost/post?postId=${encText(userName, 5)}?no=${encText(pnum,5)}`, { state: { userName: userName, pnum: pnum } });
  };

  return (
    <ImageBox>
      <H2>최근 게시물</H2>
      <ImageContainer>
        {currentImages.map((image: any, index: number) => (
          <ImgContainer key={image.img} onClick={() => onClickImageInfo(currentImages[index].name, currentImages[index].pnum)}>
            <Image
              src={image.img}
              alt='Image loading error' />
            <p>
              <Span>등록 유저</Span><br />
              <strong>{image.name}</strong>
            </p>
            <p>
              <Span>등록 일자</Span> <br />
              <strong>{formatTime(image.day)}</strong>
            </p>
            <input type="hidden" value={image.pnum}/>
          </ImgContainer>
        ))}
      </ImageContainer>
      <PaginationContainer>
        <PaginationButton onClick={handlePrevPage} disabled={currentPage === 0}>
          <strong>〈</strong>
        </PaginationButton>
        <PageIndicator>
          {currentPage} / {totalPages}
        </PageIndicator>
        <PaginationButton onClick={handleNextPage} disabled={currentPage === 0}>
          <strong>〉</strong>
        </PaginationButton>
      </PaginationContainer>
    </ImageBox>
  );
};

export default ShowImages;

const ImageBox = styled.div`
  position: relative;
  width: 400px;
  height:700px;
  background-color:white;
  box-shadow: 1px 6px 6px 1px rgba(0, 0, 0, 0.2);
  border-radius: 7.5px;
  margin-left:40px;
  margin-top: 40px;
  min-width:400px;
  
`;

const Span = styled.span`
  font-size: 15px;
  color: rgba(125, 125, 125, 1);
`;

const H2 = styled.h2`
  text-align: center;
`
const ImgContainer = styled.div`
  margin-left:12px;
  margin-top:10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.075);
  box-shadow:1px 1px 1px 1px rgba(0, 0, 0, 0.015);
  text-align: center;
  width: 180px;
  height: 250px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.01);
  }
  &:active { 
    transform: scale(1.025);
  }
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  width: 140px;
  height: 120px;
  border-radius: 5px;
  object-fit: cover;
  margin: 5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

const PaginationButton = styled.button`
  margin: 0 5px 10px;
  padding: 4px 16px;
  background-color: rgba(0, 0, 255,0.6);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover{
    background-color: rgba(0, 0, 255,0.8);
  }
  &:active{
    background-color: rgba(0, 0, 255,1);
  }

  &:disabled {
    background-color: #ccc;
  }
`;

const PageIndicator = styled.div`
  margin: 0 5px;
  font-size: 14px;
`;