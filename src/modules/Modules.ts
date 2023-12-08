import cryptoJs from "crypto-js";

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
