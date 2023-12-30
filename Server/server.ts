import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql, { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import crypto from 'crypto';
import { generateUN, generateUUID } from '../src/modules/Modules';

const secretKey = `${process.env.REACT_APP_DB_SECRETKEY}`;
const iv = `${process.env.REACT_APP_DB_IV}`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: ['http://192.168.0.23:3000', 'http://localhost:3000', 'http://192.168.0.18:3000'], // 접근 가능 포트 지정
  })
);

const db = mysql.createPool({
  host: process.env.REACT_APP_DB_HOST,
  user: 'root',
  password: 'native_pass',
  database: 'ts_react',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 로그인
app.post('/login', async (req: Request<{ email: string; password: string }>, res: Response) => {
  const { email, password } = req.body;
  const md5hash = crypto.createHash('md5').update(password).digest('hex');
  try {
    const [result] = await db.promise().query('SELECT * FROM users WHERE email=? AND password=?', [email, md5hash]);

    if (Array.isArray(result) && result.length === 0) {
      return res.json({ error: 'Invalid email or password' });
    }

    const user = (result as RowDataPacket[])[0];
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: 10 });
    // eslint-disable-next-line

    // const encryptedToken = encrypt(token);  // jwt 토큰 암호화 코드
    return res.json({ message: 'Login successful', token });
  } catch (error: any) {
    return res.json({ error: 'Internal server error' });
  }
});

// 회원가입
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const md5hash = crypto.createHash('md5').update(password).digest('hex');
  const no = generateUN();

  async function generateAndCheckUniqueNumber() {

    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE no = ?', [no]);
    const existingUserArray = existingUser as RowDataPacket[];
    if (existingUserArray && existingUserArray.length > 0) {
      return generateAndCheckUniqueNumber();
    }
  }
  try {
    await generateAndCheckUniqueNumber();

    const [result] = await db.promise().query('INSERT INTO users (no, name, email, password) VALUES (?, ?, ?, ?)', [no, name, email, md5hash]);

    if (result && 'insertId' in result) {
      return res.json({ message: 'User registered successfully.', userId: result.insertId });
    } else {
      return res.json({ error: 'Unexpected result type from the database.' });
    }
  } catch (error: any) {
    return res.json({ error: 'Internal server error' });
  }
});

// 이메일 중복 검사
app.post('/checkEmail', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(200).json({ isDuplicate: true });
    } else {
      return res.status(200).json({ isDuplicate: false });
    }
  } catch (error: any) {
    console.error('Error checking email:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 이름 중복 검사
app.post('/checkName', async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE name = ?', [name]);

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(200).json({ isDuplicate: true });
    } else {
      return res.status(200).json({ isDuplicate: false });
    }
  } catch (error: any) {
    console.error('Error checking name:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 이미지 업로드 경로

let uniqueFilename: string;

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'public/uploaded_images');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 가능해 시발롬아'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter as any,
});

// 게시물 업로드
app.post('/upload', async (req: Request, res: Response) => {
  try {
    upload.single('file')(req, res, async (err: any) => {
      const pnum = generateUUID();
      const IMG = 'uploaded_images/' + (req.file as Express.Multer.File).filename;
      const id = req.body.id;
      const content = req.body.content;
      const title = req.body.title;
      const visible = req.body.visibility; // 공개 여부 

      const sqlQuery = 'INSERT INTO registered_image (pnum, name, img, day, visible, content, title) VALUES (?, ?, ?, NOW(), ?, ?, ?)';

      db.execute(sqlQuery, [pnum, id, IMG, visible, content, title], (err, results: any) => {

        if (results && results.affectedRows && results.affectedRows > 0) {
          return res.json({ success: true });
        } else {
          return res.json({ error: 'ISE' });
        }
      });
    });
  } catch (error: any) {
    return res.json({ error: 'Internal Server Error' });
  }
});

// 등록된 모든 이미지 노출  // 공개 여부 'yes' 만
app.post('/ShowImage', async (req: Request, res: Response) => {
  try {
    const visibilityQuery = 'SELECT visible FROM registered_image';

    db.query(visibilityQuery, (err, visibilityResults: any) => {
      if (visibilityResults[0]?.visible === 'no') {
        return res.send();
      } else {
        const sqlQuery = 'SELECT pnum, img, name, day FROM registered_image WHERE visible = \'yes\' ORDER BY day desc';

        db.query(sqlQuery, (err, results: RowDataPacket[]) => {
          if (err) {
            return res.json({ error: 'Internal Server Error' });
          }
          const imageInfo = results.map((image: RowDataPacket) => ({
            pnum: image.pnum,
            img: image.img,
            name: image.name,
            day: image.day,
          }));

          return res.json(imageInfo);
        });
      }
    });
  } catch (error) {
    return res.json({ error: 'Internal Server Error' });
  }
});

// 개인 페이지 이미지 노출 
app.post('/ShowImagePrivate', async (req: Request, res: Response) => {
  try {
    const sqlQuery = 'SELECT img, name, day, visible FROM registered_image';

    db.query(sqlQuery, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Error fetching images from database:', err);
        return res.json({ error: 'Internal Server Error' });
      }

      const imageInfo = results.map((image: RowDataPacket) => ({
        img: image.img,
        name: image.name,
        day: image.day,
        visible: image.visible,
      }));
      return res.json(imageInfo);
    });
  } catch (error) {
    return res.json({ error: 'Internal Server Error' });
  }
});


// 게시물 뷰 

app.post('/ShowPost', async (req: Request, res: Response) => {
  try {
    const pnum = req.body.pnum;
    const userName = req.body.postId;

    const sqlQuery = 'SELECT img, name, day, content, title FROM registered_image WHERE name = ? AND pnum = ?';

    db.query(sqlQuery, [userName, pnum], (err, results: RowDataPacket[]) => {
      const contentInfo = results.map((content: RowDataPacket) => ({
        img: content.img,
        name: content.name,
        day: content.day,
        content: content.content,
        title: content.title
      }));
      return res.json(contentInfo);
    });
  } catch (error: any) {
    return res.json({ error: 'ISE' });
  }
});


app.post('/ShowUuid', async (req: Request, res: Response) => {
  try {
    const { uuid } = req.body;

    const sqlQuery = `SELECT * FROM registered_image WHERE pnum = '${uuid}'`;

    db.query(sqlQuery, (err, result: RowDataPacket[]) => {
      if (err) {
        return res.json({ error: 'ISE' });
      }

      if (result && result.length > 0) {
        res.json(result[0]);
      } else {
        res.json({ error: 'UUID not found' });
      }
    });
  } catch (error: any) {
    return res.json({ error: 'ISE' });
  }
});








// 이미지 노출 공개 여부 업데이트 // 수정중
app.post('/Updatepublic', async (req: Request, res: Response) => {
  try {
    const visibility = req.body.visibility;
    const IMG = req.body.img;

    const sqlQuery = 'UPDATE registered_image SET visible = ? WHERE = ?';

    db.query(sqlQuery, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Error fetching images from database : ', err);
        return res.status(500).json({ error: 'Internal Server error' });
      }
    });
  } catch (error) {
    console.error('Error in Updatepublic route : ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});







const port = 4000;

function main() {
  app.listen(port, () => {
    console.log(`Server listening at http://192.168.0.23:${port}`);
  });
}

main();