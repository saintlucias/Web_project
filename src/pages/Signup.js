import React, { useState } from "react";
import axios from "axios";

import styled from 'styled-components';



export default function Signup() {
    const [ID, setID] = useState('');

    const handleInsertData = () => {
        const data = {
            ID: ID,
            STR: 4,
            DEX: 4
        };

        axios.post(`http://localhost:4000/api/status_check?ID=${ID}`)
            .then(response => {
                if (response.data.length > 0) {
                    alert("Error: 이미 ID가 존재합니다.");
                } else {
                    // If the ID doesn't exist, proceed with the POST request
                    axios.post("http://localhost:4000/api/status_insert", data)
                        .then(res => {
                            console.log("Data insert successfully: ", res.data);
                        })
                        .catch(err => {
                            console.error("Error: ", err.message);
                        });
                }
            })
            .catch(error => {
                console.error("Error: ", error.message);
            });
    };

const handleInputChange = (event) => {
    setID(event.target.value);
};

return (
    <Div>
        <h3>회원 가입</h3>
        <div>
            <Input type="text" placeholder="ID 입력" onChange={handleInputChange}/>
        </div>
        {/* <input type='password' placeholder="Password 입력" /> */}
        <div>
            <Button onClick={handleInsertData} >가입하기</Button>
        </div>
    </Div>
);
}

const Div = styled.div `
    display: grid;
    text-align: center;
`;

const Input = styled.input `
    width: 200px;
    border-radius: 5px;
    border: none;
    margin-top: 10px;
    padding: 10px;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button `
    width: 100px;
    border-radius: 5px;
    border: none;
    margin-top: 20px;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;

    &:hover {
        font-weight: bold;
        background-color: rgba(125, 125, 125, 0.2);
        transform: scale(1.05);
    }

    &:active {
        color: white;
        background-color: skyblue;
    }
`;

