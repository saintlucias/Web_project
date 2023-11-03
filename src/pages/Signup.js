import React, { useState } from "react";
import axios from "axios";

import '../css/Signup.css';

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
                    alert("Error: ID already exists.");
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
    <div className="Signup_container">
        <h3>회원 가입</h3>
        <div>
            <input type="text" placeholder="ID 입력" onChange={handleInputChange} />
        </div>
        {/* <input type='password' placeholder="Password 입력" /> */}
        <div>
            <button onClick={handleInsertData}>가입하기</button>
        </div>
    </div>
);
}