import React from 'react';
import Kakao from '../images/kakao_login_medium_narrow.png';
import styled from 'styled-components';



export default function KakaoLogin() {
    const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;


    console.log("REST_API_KEY:", process.env.REACT_APP_REST_API_KEY);
    console.log("REDIRECT_URI:", process.env.REACT_APP_REDIRECT_URL);
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

    return (

        <Image
            alt="카카오 로그인"
            src={Kakao}
            onClick={() => window.location.href = kakaoURL}
        />
    );
}

const Image = styled.img`
    width: 255px;
    height: 50px;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.125);
    transition: 0.1s; 
    border-radius: 10px;

    &:hover {
        transform: scale(1.025);
    }

    &:active {
        transform: scale(1.05);
    }
`;