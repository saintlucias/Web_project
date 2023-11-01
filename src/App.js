// Library area
import React, {useEffect} from 'react';

// Component area
import Main_page from './pages/Main_page';

import './App.css';

import axios from 'axios';

export default function App() {

  useEffect(() => {
    axios.get('/api/test')
      .then(res => console.log(res))
      .catch()
  })

  return (
    <div >
        <div>
          <Main_page />
        </div>
    </div>
  );
}


