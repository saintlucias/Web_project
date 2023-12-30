
![bluecapsule_220516_1](https://github.com/saintlucias/Web_project/assets/125417038/a4a2ce52-3208-4676-b4f6-7fe533b80329)

# Web_project
( 홈쇼핑 웹페이지 제작 )

## 참고할 웹 페이지 ::

네이버 쇼핑 <br>
- https://shopping.naver.com/home

네이버 스마트 스토어 <br>
- https://sell.smartstore.naver.com/#/home/about

쿠팡 <br>
- https://www.coupang.com/ 

11번가 <br>
- https://www.11st.co.kr/


## AOS :: JS Library <br>
![제목 없음](https://github.com/saintlucias/Web_project/assets/125417038/87e4b04e-cc1e-444d-ade9-801c1ff17883)

- https://michalsnik.github.io/aos/
  <br>ㄴ 스크롤 특수 효과 모음

## Use language
- React (Node js) <br>
![다운로드](https://github.com/saintlucias/Web_project/assets/125417038/032052df-116c-4687-8ac2-768fdbb5b3d9)

- Mysql <br>
![1024px-MySQL ff87215b43fd7292af172e2a5d9b844217262571](https://github.com/saintlucias/Web_project/assets/125417038/5da4af60-ac6a-46e8-917e-6ed8fa9f3349)

- Python <br>
![Python-logo-notext svg](https://github.com/saintlucias/Web_project/assets/125417038/19492758-1d62-4184-b99e-a216e7f864a3)


- ( ... )


## 주요 기능

- Database - insert, select, update, delete , (...)
- 이미지 업로드, 게시물 등록, 이미지 특수효과 등 



## 설치 라이브러리 

npm i styled-component [ css 스타일 ]<br/>
npm i crypto-js [ 암호화, 복호화 ]<br/>
npm i express [ Node 서버 ] <br/>
npm i mysql2 [ mysql 데이터베이스 ] <br/>
npm i multer [ 이미지 파일 저장 경로 지정 - diskstorage ... ] <br/>
npm i react-router-dom [ redirect ... ] <br/> 
npm i ts-node [ nodejs 에서 타입스크립트 실행하기 위한 도구 ] <br/>
npm i typescript <br/>
npm i web-vitals <br/>
npm i express (--force ) [node 서버 관련] <br>
[ ... ]

## 오류 
- 이미지 로드 오류 [ 서버로부터 이미지는 전달 되지만 로컬 경로에서 이미지 받아오는게 안됨.] <br/>
    ㄴ> 업로드된 이미지 폴더를 public 으로 이동 후 이미지 로드했더니 해결됨.

- 함수를 모듈 폴더에 넣어서 import 하고 사용하려 했으나 오류 <br/>
    ㄴ> tsconfig.json => "include" 에 모듈 폴더를 포함 시켜주어야 함. <br>
    