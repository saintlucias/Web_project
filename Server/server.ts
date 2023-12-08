import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql, {RowDataPacket} from 'mysql2';
import jwt from 'jsonwebtoken';
import multer,{ MulterError } from 'multer';

const secretKey = `${process.env.REACT_APP_DB_SECRETKEY}`;
const iv = `${process.env.REACT_APP_DB_IV}`;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: ['http://192.168.0.23:3000', 'http://localhost:3000'], // 접근 가능 포트 지정
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

  try {
    const [result] = await db.promise().query('SELECT * FROM users WHERE email=? AND password=?', [email, password]);

    if (Array.isArray(result) && result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = (result as RowDataPacket[])[0];
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: 10 });
    // eslint-disable-next-line
 
    // const encryptedToken = encrypt(token);  // jwt 토큰 암호화 코드
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error: any) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 회원가입
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {

    const [result] = await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    if (result && 'insertId' in result) {
      return res.status(200).json({ message: 'User registered successfully.', userId: result.insertId });
    } else {
      return res.status(500).json({ error: 'Unexpected result type from the database.' });
    }
  } catch (error: any) {
    console.error('Error during registration:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
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
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter as any,
});

// 이미지 업로드
app.post('/upload', async (req: Request, res: Response) => {
  try {
    upload.single('file')(req, res, async (err: any) => {
      if (err instanceof MulterError) {
        return res.status(500).json({ error: 'Multer Error: ' + err.message });
      } else if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unknown Error: ' + err.message });
      }

      const IMG = 'uploaded_images/' + (req.file as Express.Multer.File).filename;
      const id = req.body.id;
      const visible = req.body.visibility; // 공개 여부 

      const sqlQuery = 'INSERT INTO registered_image (name, img, day, visible) VALUES (?, ?, NOW(), ?)';

      db.execute(sqlQuery, [id, IMG, visible], (err, results: any) => {
        if (err) {
          console.error('Error during SQL query:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results && results.affectedRows && results.affectedRows > 0) {
          console.log('Data inserted successfully. Affected rows:', results.affectedRows);
          return res.json({ success: true });
        } else {
          console.error('Error inserting data. No rows affected.');
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    });
  } catch (error: any) {
    console.error('Error during image upload:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 등록된 모든 이미지 노출  // 공개 여부 'yes' 만
app.post('/ShowImage', async (req: Request, res: Response) => {
  try {
    const visibilityQuery = 'SELECT visible FROM registered_image';

    db.query(visibilityQuery, (err, visibilityResults: any) => {
      if (err) {
        console.error('Error fetching visibility from database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (visibilityResults[0]?.visible === 'no') {
        return res.status(204).send();
      } else {
        const sqlQuery = 'SELECT img, name, day FROM registered_image WHERE visible = \'yes\'';

        db.query(sqlQuery, (err, results: RowDataPacket[]) => {
          if (err) {
            console.error('Error fetching images from database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          const imageInfo = results.map((image: RowDataPacket) => ({
            img: image.img,
            name: image.name,
            day: image.day,
          }));

          return res.status(200).json(imageInfo);
        });
      }
    });
  } catch (error) {
    console.error('Error in ShowAllImages route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 개인 페이지 이미지 노출 
app.post('/ShowImagePrivate', async (req: Request, res: Response) => {
  try {
        const sqlQuery = 'SELECT img, name, day, visible FROM registered_image';

        db.query(sqlQuery, (err, results: RowDataPacket[]) => {
          if (err) {
            console.error('Error fetching images from database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          const imageInfo = results.map((image: RowDataPacket) => ({
            img: image.img,
            name: image.name,
            day: image.day,
            visible: image.visible,
          }));

          return res.status(200).json(imageInfo);
        });
      } catch (error) {
    console.error('Error in ShowAllImages route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 이미지 노출 공개 여부 업데이트 
app.post('/Updatepublic', async (req: Request, res: Response) => {
  try {
    const visibility = req.body.visibility;
    const IMG = req.body.img;

    const sqlQuery = 'UPDATE registered_image SET visible = ? WHERE = ?';

    db.query(sqlQuery, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Error fetching images from database : ', err);
        return res.status(500).json({error: 'Internal Server error'});
      }
    });
  } catch (error) {
    console.error('Error in Updatepublic route : ', error);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
});


const port = 4000;

function main() {
  app.listen(port, () => {
    console.log(`Server listening at http://192.168.0.23:${port}`);
  });
}

main();