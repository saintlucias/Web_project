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
            <Button onClick={handleDeleteData} >Delete</Button>
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
    width: 100px;
    border-radius: 5px;
    margin-top: 20px;
    border: none;
    box-shadow: 1px 2px 6px 1px rgba(0, 0, 0, 0.2);
    transition:0.2s;

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

const activeButtonStyle = {
    color: 'white',
    backgroundColor: 'rgba(8, 8, 8, 0.8)',
};