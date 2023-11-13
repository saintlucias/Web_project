

// Library area
import React, { useEffect } from 'react';

// Component area
import SelectID from './pages/SelectID';
import Signup from './pages/Signup';
import DeleteID from './pages/DeleteID';
import KakaoLogin from './pages/KakaoLogin';

import styled from 'styled-components';
import './App.css';
import ImgUpload from './pages/ImgUpload';


export default function App() {


  return (
    <Body>
      <Div_server_container>
        <div>
          <SelectID />
        </div>
        <div>
          <Signup />
        </div>
        <div>
          <DeleteID />
        </div>
      </Div_server_container>
      <Kakao_div>
        <div>
        <h2>Kakao login</h2>
          <KakaoLogin />
        </div>
      </Kakao_div>
      <div>
        <ImgUpload />
      </div>
    </Body>
  );
}

const Body = styled.body`
    height:100vw;
    margin:auto;
  `;

const Div_server_container = styled.div`
  width:50%;
  padding:20px;
  margin: auto;
  align-items:center;
  justify-content: center;
  background-color: rgba(125, 125, 125, 0.125);
  border-radius: 10px;
  box-shadow: 1px 2px 8px 1px rgba(0, 0, 0, 0.125);
`;

const Kakao_div = styled.div`
  padding:20px;
  width:50%;
  height: 20%;
  display:flex;
  text-align:center;
  justify-content: center;
  align-items: center;
  margin:auto;
  margin-top:80px;
  background-color: rgba(128, 0, 255, 0.075);
  border-radius: 10px;
  box-shadow: 1px 2px 8px 1px rgba(0, 0, 0, 0.125);
`;