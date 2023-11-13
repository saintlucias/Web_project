const express = require("express"); // npm i express | yarn add express
const cors = require("cors");    // npm i cors | yarn add cors
const mysql = require("mysql");   // npm i mysql | yarn add mysql
const app = express();
const PORT = 4000; // 포트번호 설정

app.use(express.json()); // Parse JSON bodies

// MySQL 연결
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'native_pass',
    database: 'test_react',
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

// 데이터베이스 조회
app.get("/api/select_status", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const sqlQuery = "SELECT * FROM STATUS where user_name = 'admin'";

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

//데이터베이스 값 수정 // user_name 제외
app.post("/api/status_update", (req, res) => {
    const { STR, DEX, ID } = req.body;

    // 파라미터화된 쿼리를 생성
    const sqlQuery = "UPDATE status SET STR = ?, DEX = ? WHERE user_name = ?";

    // 값을 배열로 전달하여 쿼리를 실행
    db.query(sqlQuery, [STR, DEX, ID], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Data update failed.");
        } else {
            console.log("Data updated successfully:", result);
            res.send("Data updated successfully");
        }
    });
});

// 데이터베이스 중복값 체크
app.post("/api/status_check", (req, res) => {
    const { ID } = req.query;
    const sqlQuery = `SELECT * FROM status WHERE user_name ='${ID}'`;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Database error:", err);
        } else {
            res.send(result);
        }
    });
});

// 데이터베이스 id 등록
app.post("/api/status_insert", (req, res) => {
    const { ID, STR, DEX } = req.body;

    const sqlQuery = "INSERT INTO status VALUES (?, ?, ?)";

    db.query(sqlQuery, [ID, STR, DEX], (err, result) => {
        if (err) {
            console.error("Database error:", err);
        } else {
            console.log("Data insert successfully: ", result);
        }
    });
});

app.post("/api/status_delete", (req, res) => {
    const { ID } = req.body;

    const sqlQuery = "DELETE FROM status WHERE user_name = ?";

    db.query(sqlQuery, [ID], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Database error occurred");
        } else {
            if (result.affectedRows === 0) {
                console.error("Error: ID does not exist.");
            } else {
                console.log("Data delete successfully: ", result);
            }
        }
    });
});

// g