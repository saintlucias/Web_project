import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJwt } from './Modules';



{/* 딜레이 적용한 네비게이션 */ }

function DelayedNavi(): (page: string) => void {
    const navigate = useNavigate();
    const [delayedNavigation, setDelayedNavigation] = useState(false);

    const triggerDelayedNavigation = (page: string) => {
        setDelayedNavigation(true);
        setTimeout(() => {
            navigate(page);
        }, 500); // 0.3초
    };

    return triggerDelayedNavigation;
}


{/* 로그아웃 세션 */ } // App.tsx

function useLogout() {
    const [isLoggedIn, setLoggedIn] = useState(false);

    const handleLogout = () => {
        const userConfirmed = window.confirm('진짜 로그아웃 하게?');

        if (userConfirmed) {
            sessionStorage.removeItem('__bluecapsule__');
            setLoggedIn(false);
            setTimeout(() => {
                window.location.reload(); // 새로고침
            }, 500); // 0.25 초

        } else {

        }
    };

    return {
        isLoggedIn,
        handleLogout,
    };
}


{/* 로그인 시 토큰 체크 */ } 

function ChecksToken() {
    const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('__bluecapsule__');

        if (storedToken) {
            setLoggedIn(true);
            setTimeout(() => {
                navigate('/');
            }, 500); // 0.25초 후 이동
        }
    }, []);

    return { isLoggedIn };
}


{/* 개인 페이지 - 토큰 확인 후 이미지 노출 */ } // PresonalPage.tsx

function ShowImagePrivate() {

    const [images, setImages] = useState<any[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const triggerNavi = DelayedNavi();

    useEffect(() => {
        const Token: any = sessionStorage.getItem('__bluecapsule__');
        const decodedToken = parseJwt(Token);
        if (!Token) {
            alert("올바른 경로로 접근하세요.")
            return triggerNavi("/")
        }
        setUserName(decodedToken.name);

        const fetchImages = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/ShowImagePrivate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                setImages(data.filter((images: any) => images.name === userName));
            } catch (error: any) {
                console.error('Error fetching images: ', error);
            }
        };
        fetchImages();
    }, [userName]);

    return { images, userName };
}


{/* 이미지 에러 => 리로드 */ } //PersonalPage.tsx 

function ImageError() {
    const [imageKey, setImageKey] = useState(1);
    const [imageLoadError, setImageLoadError] = useState(false);

    const handleImageError = () => {
        setImageLoadError(true);
        setImageKey(prevKey => prevKey + 1);
    }
    const handleImageLoaded = () => {
        setImageLoadError(false);
    }

    return { handleImageError, handleImageLoaded };
}


{/* 로그인된 유저 이름 가져오기 */ } // Upload.tsx

function LoadUserName() {
    const [userName, setUserName] = useState<string>('');
    const Token: any = sessionStorage.getItem('__bluecapsule__');
    const navigate = DelayedNavi();

    useEffect(() => {
        if (!Token) {
            alert('올바른 경로로 접근하세요.');
            navigate('/');
        }
        const storedToken = sessionStorage.getItem('__bluecapsule__');

        if (storedToken) {
            try {
                const decodedToken: any = parseJwt(storedToken);

                if (decodedToken && decodedToken.name) {
                    setUserName(decodedToken.name);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

    }, [navigate]);

    return { userName, Token, setUserName };
}


{/* 이미지 파일 삽입 / 업로드 */ } // Upload.tsx

function FileLoader() {

    const Token: any = sessionStorage.getItem('__bluecapsule__');
    const decodedToken: any = parseJwt(Token);
    const [userName, setUserName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [visibility, setVisibility] = useState<string>('yes');
    const navigate = DelayedNavi();

    useEffect(() => {
        setUserName(decodedToken.name);
      }, [decodedToken.name]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];

        if (selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                setFile(selectedFile);
            } else {
                alert('이미지 파일만 등록할 수 있음.');
                if (e.target) {
                    e.target.value = '';
                }
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        try {
            if (!file) {
                alert("파일을 선택해주세요.")
                console.error('로그인이 안됐거나, 파일이 없거나..');
                return;
            }
            if (!userName) {
                alert("올바른 경로로 접근하셈.")
                console.error('로그인 안된 유저임.')
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('id', userName);
            formData.append('visibility', visibility);

            const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert('등록 완료');
                
                setTimeout(() => {
                    navigate('/PersonalPage');
                }, 500);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error during upload:', error.message);
        }
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibility(e.target.value);
      };
    
    return { handleFileChange, handleUpload, handleVisibilityChange, visibility };
}


{/* 회원가입 */ } // Registration.tsx

function Registration_info() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
    const [isNameDuplicate, setIsNameDuplicate] = useState(false);
  
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      setIsNameDuplicate(false);
    };
  
    // 이름 중복 확인
    const handleCheckNameDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
  
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_APP}/checkName`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          if (data.isDuplicate) {
            setIsNameDuplicate(true);
            alert('이미 이름이 존재합니다.');
          } else {
            alert('사용 가능한 이름입니다.');
          }
        } else {
          console.error('Failed to check for duplicate name.');
        }
      } catch (error: any) {
        console.error('Error during duplicate check for name:', error.message);
      }
    };
  
    // 이메일 중복 확인
    const handleCheckEmailDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
  
        const response = await fetch(
          `${process.env.REACT_APP_API_SERVER_APP}/checkEmail`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.isDuplicate) {
            setIsEmailDuplicate(true);
            alert('이미 이메일이 존재합니다.');
          } else {
            alert('사용 가능한 이메일입니다.');
          }
        } else {
          console.error('Failed to check for duplicate email.');
        }
      } catch (error: any) {
        console.error('Error during duplicate check for email:', error.message);
      }
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setIsEmailDuplicate(false);
    };
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    };
  
  
  
    const handleResetForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setIsNameDuplicate(false);
      setIsEmailDuplicate(false);
    };
  
  
    //회원 가입 하기
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
  
        if (!name.trim() || !email.trim() || !password.trim()) {
          alert('공백은 입력할 수 없음.');
          return;
        }
  
        const duplicateEmailResponse = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/checkEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (duplicateEmailResponse.ok) {
          const duplicateEmailData = await duplicateEmailResponse.json();
          if (duplicateEmailData.isDuplicate) {
            setIsEmailDuplicate(true);
            alert('이메일 있다자낭');
            return;
          }
        } else {
          console.error('Failed to check for duplicate email.');
          return;
        }
  
        const duplicateNameResponse = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/checkName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
  
        if (duplicateNameResponse.ok) {
          const duplicateNameData = await duplicateNameResponse.json();
          if (duplicateNameData.isDuplicate) {
            setIsNameDuplicate(true);
            alert('이름 있다자낭');
            return;
          }
        } else {
          console.error('Failed to check for duplicate name.');
          return;
        }
  
        const registrationResponse = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (registrationResponse.ok) {
          const data = await registrationResponse.json();
          alert('회원가입이 완료되었습니다.');
          console.log('Registration successful:', data);
          handleResetForm(); // Reset the form after successful registration
        } else {
          const errorData = await registrationResponse.json();
          console.error('Registration failed:', errorData.error);
        }
      } catch (error: any) {
        alert('다시 시도해주세요.');
        console.error('Error during registration:', error.message);
      }
    };
    return {
            isEmailDuplicate, 
            isNameDuplicate, 
            handleNameChange, 
            handleCheckNameDuplicate,
            handleCheckEmailDuplicate,
            handleEmailChange,
            handlePasswordChange,
            handleSubmit,
            handleResetForm,
            name,
            email,
            password
        }
}

















export {
    DelayedNavi,
    useLogout,
    ChecksToken,
    ShowImagePrivate,
    ImageError,
    LoadUserName,
    FileLoader,
    Registration_info
};