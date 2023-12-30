import cryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

const secretKey = `${process.env.REACT_APP_DB_SECRETKEY}`;
const iv = `${process.env.REACT_APP_DB_IV}`;

{/* 암호화 */}

export function encrypt(text: string): any {
  const cipher = cryptoJs.AES.encrypt(text, cryptoJs.enc.Utf8.parse(secretKey), {
    iv: cryptoJs.enc.Utf8.parse(iv),
    padding: cryptoJs.pad.Pkcs7,
    mode: cryptoJs.mode.CBC,
  });

  return cipher.toString();
}


{/* 복호화 */}

export function decrypt(encryptedText: string): any {
  const decipher = cryptoJs.AES.decrypt(encryptedText, cryptoJs.enc.Utf8.parse(secretKey), {
    iv: cryptoJs.enc.Utf8.parse(iv),
    padding: cryptoJs.pad.Pkcs7,
    mode: cryptoJs.mode.CBC,
  });
  return decipher.toString(cryptoJs.enc.Utf8);
}


{/* 토큰 파싱 */}

export function parseJwt(token: string): any {
  if (!token) {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const base64Url = parts[1];

  if (!base64Url) {
    return null;
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}


{/* 날짜 형식 지정 */}

export function formatTime(dateTimeString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
}

const dateTime = new Date(dateTimeString);
return dateTime.toLocaleString(undefined, options);
}


{/* 랜덤 텍스트 생성 */}

export function GRS(minLength: number, maxLength: number) {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let result: string = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


{/* 랜덤 상수 생성 */}

export function generateUN() {
  return Math.floor(100000 + Math.random() * 900000); 
}


{/* 텍스트 복호화 - 사이트 주소값 지정 */}

export function encText(text: string, shift: number): string {
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const alphabetStart = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        const charCode = char.charCodeAt(0);
        const encryptedCharCode = ((charCode - alphabetStart + shift) % 26) + alphabetStart;
        return String.fromCharCode(encryptedCharCode);
      } else {
        return char;
      }
    })
    .join('');
}


export function generateUUID(): string {
  return uuidv4();
}
