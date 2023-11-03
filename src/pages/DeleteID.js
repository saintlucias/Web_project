import React, { useState } from "react";
import '../css/DeleteID.css';
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
        <div className="DeleteID_container">
            <h3>ID 삭제</h3>
            <div>
                <input type="text" placeholder="삭제할 ID 입력" onChange={handleDeleteChange} />
            </div>
            <button onClick={handleDeleteData}>Delete</button>
        </div>
    );
}