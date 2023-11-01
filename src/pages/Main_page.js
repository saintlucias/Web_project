import React, { useState, useEffect } from "react";
import axios from "axios";

import '../css/Main_page.css';

export default function Main_page() {
    const [STR, setStr] = useState(0);
    const [DEX, setDex] = useState(0);
    const [ID, setID] = useState('');
    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:4000/api/status_load")
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
            STR: fetchedData ? fetchedData.STR : STR, 
            DEX: fetchedData ? fetchedData.DEX : DEX,
            user_name: ID
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
        <div className="Main_page_container">
            <h2>This is Main_page Component.</h2>
            <div>
                {ID && (
                    <div>
                        ID : {ID}
                    </div>
                )}
            </div>
            <table>
                <tr>
                    <td>STR</td>
                    <td>{fetchedData ? fetchedData.STR : STR}</td>
                    <button onClick={handleIncrementSTR}>+</button>
                </tr>
                <tr>
                    <td>DEX</td>
                    <td>{fetchedData ? fetchedData.DEX : DEX}</td>
                    <button onClick={handleIncrementDEX}>+</button>
                </tr>
            </table>
            <button onClick={handleSaveData}>Save Data</button>
        </div>
    );
}