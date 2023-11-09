import React, { useState, useEffect } from "react";
import axios from "axios";

import styled from 'styled-components';


export default function Main_page() {
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
                <Button onClick={handleSaveData}>Save　Data</Button>
            </div>
        </Div>
    );
}

const Div = styled.div `
    text-align: center;
`;

const Table = styled.table `
    width: 100px;
    height: 100px;
    border-radius: 5px;
    margin: auto;
    padding: 10px;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button `
    width: 100px;
    margin-top: 20px;
    border-radius: 5px;
    border: none;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;

    &:hover {
        background-color: rgba(125, 125, 125, 0.25);
        transform: scale(1.05);
        font-weight:bold;
    }

    &:active {
        color: white;
        background-color: skyblue;
    }
`;
