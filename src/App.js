// Library area
import React, {useEffect} from 'react';

// Component area
import SelectID from './pages/SelectID';
import Signup from './pages/Signup';
import DeleteID from './pages/DeleteID';

import styled from 'styled-components';
import './App.css';

export default function App() {

  
  return (
    <Body>
        <div>
          <SelectID />
        </div>
        <div>
          <Signup/>
        </div>
        <div>
          <DeleteID />
        </div>
    </Body>
  );
}

const Body = styled.body `
  padding-top: 10px;
  width:100%;
  height:100vw;
  background-color: rgba(125, 125, 125, 0.125);
`;

