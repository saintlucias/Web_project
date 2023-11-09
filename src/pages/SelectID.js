import React, { useState, useEffect } from "react";
import axios from "axios";

import styled from 'styled-components';


export default function SelectID() {
    const [STR, setStr] = useState(0);
    const [DEX, setDex] = useState(0);
    const [ID, setID] = useState('');


    useEffect(() => {
        axios.get("http://localhost:4000/api/select_status")
            .then((res) => {
                if (res.data.length > 0) {
                    setID(res.data[0].user_name); //database 컬럼명
                    setStr(res.data[0].STR); // database 컬럼명...
                    setDex(res.data[0].DEX);
                }
            }).catch((err) => {
                console.log(err);
            })
    }, []);

    const handleIncrementSTR = () => {
        setStr(STR + 1);
    };

    const handleIncrementDEX = () => {
        setDex(DEX + 1);
    };

    const handleSaveData = () => {
        const data = {
            STR: STR,
            DEX: DEX,
            ID: ID
        };


        axios.post("http://localhost:4000/api/status_update", data)
            .then(res => {
                console.log("Data saved successfully:", res.data);
            })
            .catch(err => {
                console.error("Error: ", err.message);
            });
    };


    return (
        <Div>
            <h2>Update / Select</h2>
            <div>
                <div>
                    {ID && (
                        <div>
                            ID : {ID}
                        </div>
                    )}
                </div>
                <Table>
                    <tr>
                        <td>STR</td>
                        <td>{STR}</td>
                        <td><button onClick={handleIncrementSTR}>+</button></td>
                    </tr>
                    <tr>
                        <td>DEX</td>
                        <td>{DEX}</td>
                        <td><button onClick={handleIncrementDEX}>+</button></td>
                    </tr>
                </Table>
                <Button onClick={handleSaveData}><span>Save Data</span></Button>
            </div>
        </Div>
    );
}

const Div = styled.div`
    text-align: center;
`;

const Table = styled.table`
    width: 100px;
    height: 100px;
    border-radius: 5px;
    margin: auto;
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
