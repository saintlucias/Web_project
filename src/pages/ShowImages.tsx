import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ShowImages: React.FC = () => {
  const formatTime = (dateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(undefined, options);
  };

  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const imagesPerPage = 4;

  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/ShowImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data);
    } catch (error: any) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const lastImageIndex = currentPage * imagesPerPage;
  const firstImageIndex = lastImageIndex - imagesPerPage;
  const currentImages = images.slice(firstImageIndex, lastImageIndex);

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <ImageBox>
      <H2>등록된 게시물</H2>
      <ImageContainer>
        {currentImages.map((image: any, index) => (
          <ImgContainer key={index}>
            <a href="https://www.naver.com/">
            <Image src={image.img} alt='이미지 로드 오류' />
            </a>
            <p>
              <Span>등록 유저</Span><br/>
              <strong>{image.name}</strong>
            </p>
            <p>
              <Span>등록 일자</Span> <br />
              <strong>{formatTime(image.day)}</strong>
            </p>
          </ImgContainer>
        ))}
      </ImageContainer>
      <PaginationContainer>
        <PaginationButton onClick={handlePrevPage} disabled={currentPage === 1}>
          <strong>〈</strong>
        </PaginationButton>
        <PageIndicator>
          {currentPage} / {totalPages}
        </PageIndicator>
        <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>
        <strong>〉</strong>
        </PaginationButton>
      </PaginationContainer>
    </ImageBox>
  );
};

export default ShowImages;
const ImageBox = styled.div `
  position: relative;
  width: 400px;
  height:700px;
  background-color:white;
  box-shadow: 1px 6px 6px 1px rgba(0, 0, 0, 0.2);
  border-radius: 7.5px;
  margin-left:40px;
  margin-top: 40px;
`;

const Span = styled.span`
  font-size: 15px;
  color: rgba(125, 125, 125, 1);
`;

const H2 = styled.h2`
  text-align: center;
`
const ImgContainer = styled.div`
  text-align: center;
  width: 200px;
  height: 300px;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 5px;
  object-fit: cover;
  margin: 5px;
  cursor: pointer;
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