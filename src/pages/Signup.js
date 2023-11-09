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
            <Button onClick={handleInsertData}><span>가입하기</span></Button>
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

const Button = styled.button`
    margin-top: 20px;
    background: rgb(0, 172, 238);
    background: linear-gradient(0deg, rgba(0, 172, 238, 1) 0%, rgba(2, 126, 251, 1) 100%);
    width: 130px;
    height: 40px;
    line-height: 42px;
    padding: 0;
    border: none;
    border-radius: 5px;
    position: relative;
    color: white;
    outline: none;
    box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
    7px 7px 20px 0px rgba(0,0,0,.1),
    4px 4px 5px 0px rgba(0,0,0,.1);
    transition: all 0.3s ease;

    &:before,
    &:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(2, 126, 251, 1);
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
        color: rgba(2, 126, 251, 1);

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
        background: rgba(2, 126, 251, 1);
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

