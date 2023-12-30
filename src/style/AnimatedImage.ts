import { keyframes, styled } from "styled-components";
import mall1 from '../images/mall1.jpg';


{/* 이미지 애니메이션 -> 서서히 사라짐 효과 */}

const colorChangeEffect = keyframes`
  0% {
    background-image: url(${mall1});
  }
  25% { 
    background-image: url(${mall1});
  }
  50% {
    background-image: url(${mall1});
  }
  75% {
    background-image: url(${mall1});
  }
  100% {
    background-image: url(${mall1});
  }
`;

export const AnimatedBackground = styled.div`
    position: relative;
    width: 100%;
    height: 800px;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // background-image: url(${mall1});
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center center;
        background-size: cover;
        filter: grayscale(0%);
        animation: ${colorChangeEffect} 20s infinite;
    }
`;