import { useState, useEffect } from 'react';
import { NavigateFunction, NavigateOptions, useNavigate, To } from 'react-router-dom';
import { parseJwt } from './Modules';



{/* 딜레이 적용한 네비게이션 */ }

function DelayedNavi(): NavigateFunction {
  const navigate = useNavigate();
  const [delayedNavigation, setDelayedNavigation] = useState(false);

  const triggerDelayedNavigation: NavigateFunction = (to: any, options?: NavigateOptions) => {
    setDelayedNavigation(true);
    setTimeout(() => {
      navigate(to, options);
      setDelayedNavigation(false);
    }, 500); 
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
    // const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('__bluecapsule__');

        if (storedToken) {
            setLoggedIn(true);
            // setTimeout(() => {
            //     navigate('/');
            // }, 500); // 0.5초 후 이동
        }
    }, []);

    return { isLoggedIn };
}


{/* 개인 페이지 - 토큰 확인 후 이미지 노출 */ } // PresonalPage.tsx

function ShowImagePrivate() {

    const [images, setImages] = useState<any[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const triggerNavi = useNavigate();

    useEffect(() => {
        const Token: any = sessionStorage.getItem('__bluecapsule__');
        const decodedToken = parseJwt(Token);
        if (!Token) {
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
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const navigate = DelayedNavi();

    useEffect(() => {
        setUserName(decodedToken.name);
      }, [decodedToken.name]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    }
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    }

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
            formData.append('title', title);
            formData.append('content', content);

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
    
    return {handleFileChange,
            handleUpload,
            handleVisibilityChange,
            handleTitleChange,
            handleContentChange,
            visibility, 
            title, 
            content };
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
          const data = await response.json();
          if (data.isDuplicate) {
            setIsEmailDuplicate(true);
            alert('이미 이메일이 존재합니다.');
          } else {
            alert('사용 가능한 이메일입니다.');
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


// 이미지 클릭 후 해당 게시물로 이동할 때

function ShowPost(postId: string, pnum: string) {
  const [contents, setContents] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [day, setDay] = useState<string>();

  useEffect(() => {
    const fetchContent = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/ShowPost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, pnum }), 
        });

        const data = await response.json();
        if (data.length > 0) {
          const post = data[0];
          setUserName(post?.name || null);
          setContents(post?.content || null);
          setImages(post?.img ? [post.img] : []); 
          setTitle(post?.title || null);
          setDay(post?.day || null);
        }
    };

    fetchContent();
  }, [postId, pnum]); 

  return { contents, userName, images, title, day };
}


{/* 이미지 보이기 */}

function ShowAllImages() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/ShowImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json(); 
      setImages(data);
    } catch (error: any) {
      console.error('Error fetching images:', error);
    }
  };
  fetchImages();
}, []);

  return { ShowAllImages, images}
}



{/* 로그인 토큰 검증 */}

function TokenVerify(){
  const [Tokens, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = DelayedNavi();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('__bluecapsule__');

    if (storedToken) {
      setToken(storedToken);

      try {
        const decodedToken = parseJwt(storedToken);
        setUserName(decodedToken ? decodedToken.name : null);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserName(null);
      }

      setLoggedIn(true);
    }
  }, []);

  function handleLogout() {
    setLoggedIn(false);
    setUserName(null);
    setToken(null);
    sessionStorage.removeItem('__bluecapsule__');
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_SERVER_APP}/login`,
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

      const data = await response.json();

      const receivedToken = data.token;

      const decodedToken: any = parseJwt(receivedToken);

      if (decodedToken && decodedToken.name) {
        setUserName(decodedToken.name); // 토큰 중 이름값
        setLoggedIn(true);
        setToken(receivedToken);
        sessionStorage.setItem('__bluecapsule__', receivedToken);
        alert("반가워용")
        Navigate('/');
      }
      else {
        return alert('입력한 정보가 일치하지 않수다.');
      }

    } catch (error: any) {
      alert('로그인중에 알 수 없는 에러 발생함. 다시 시도 요망.');
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return {
    handleLogin, 
    handleLogout, 
    handleEmailChange, 
    handlePasswordChange,
    userName,
    isLoggedIn,
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
    Registration_info,
    ShowPost,
    ShowAllImages,
    TokenVerify
};