const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql");   // npm i mysql | yarn add mysql
const app     = express();
const PORT    = 4000; // 포트번호 설정

// MySQL 연결
const db = mysql.createPool({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "native_pass",      // 데이터베이스 비밀번호
    database: "test_react",  // 사용할 데이터베이스
});

app.use(cors({
    origin: "*",                // 출처 허용 옵션
    credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))

// post 요청 시 값을 객체로 바꿔줌
app.use(express.urlencoded({ extended: true })) 

// 서버 연결 시 발생
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

app.get("/api/status_load", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    const sqlQuery = "SELECT * FROM STATUS";

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Database error:", err); // Log the specific database error
            res.status(500).send("Database error occurred");
        } else {
            if (result.length === 0) {
                console.log("No data found in the database");
                res.send("Data does not exist in the database");
            } else {
                console.log("Data retrieved successfully:", result);
                res.send(result);
            }
        }
    });
});

app.post("/api/status_update", (req, res) => {
    const { STR, DEX, ID } = req.body;
    const sqlQuery = `UPDATE STATUS SET STR=${STR}, DEX=${DEX} WHERE user_name=${ID}`;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            res.status(500).send("Data update failed.");
        } else {
            console.log("Data updated successfully", result);
            res.send("Data updated successfully", result);
        }
    });
});
