import React, { useState } from "react";
import styled from "styled-components";

import axios from "axios";

export default function DeleteID() {
    const [ID, setID] = useState('');

    const handleDeleteData = () => {
        const data = { ID: ID };

        axios.post(`http://localhost:4000/api/status_check?ID=${ID}`)
            .then(response => {
                if (response.data.length === 0) {
                    alert("Error: ID가 존재하지 않습니다.");
                } else {
                    // If the ID doesn't exist, proceed with the POST request
                    axios.post("http://localhost:4000/api/status_delete", data)
                        .then(res => {
                            console.log("Data delete successfully: ", res.data);
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

    const handleDeleteChange = (event) => {
        setID(event.target.value);
    };



    return (
        <Div>
            <h3>ID 삭제</h3>
            <div>
                <Input type="text" placeholder="삭제할 ID 입력" onChange={handleDeleteChange} />
            </div>
            <Button onClick={handleDeleteData}><span>Delete</span></Button>
        </Div>
    );
}

const Div  = styled.div`
    text-align: center;
`;

const Input = styled.input`
    width: 200px;
    border-radius: 5px;
    margin-top: 20px;
    padding: 10px;
    border: none;
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

