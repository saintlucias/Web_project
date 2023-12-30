import { useLocation } from 'react-router-dom';
import { ShowPost } from '../modules/Hooks';
import styled from 'styled-components';
import { formatTime } from '../modules/Modules';
import { useEffect } from 'react';
import Tab from './Tab';


const Viewpost: React.FC = () => {
  const location = useLocation();
  const postId = location.state && location.state.userName;
  const pnum = location.state && location.state.pnum;
  const { title, images, contents, userName, day } = ShowPost(postId, pnum);

  useEffect(() => {

  }, [location.search]);

  return (
    <>
      <Tab />
      <CustomedTable>
        <tbody>
          <SuperTR>
            <td>
              {images.map((image: string, index: number) => {
                console.log(`${process.env.REACT_APP_IMAGE_DIR}/${image}`)
                return (
                  <Image key={index} src={`${process.env.PUBLIC_URL}/${image}`} alt={`Image ${index}`} />
                );
              })}
            </td>
          </SuperTR>
          <CustomedTr>
            <td>
              <h3>{userName}</h3>
            </td>
          </CustomedTr>
          <tr>
            <td>
              <CustomedHr />
            </td>
          </tr>
          <CustomedTr>
            <td>
              <h3>{title}</h3>
            </td>
          </CustomedTr>
          <CustomedTr>
            <td>{contents}</td>
          </CustomedTr>
          <CustomedTr>
            <td>등록 일자 : {day && formatTime(day)}</td>
          </CustomedTr>
        </tbody>
      </CustomedTable>
    </>
  );
};

export default Viewpost;

const CustomedTable = styled.table`
  height: 100%;
  display: grid;
  margin: auto;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 700px;
  height: 500px;
  border-radius: 10px;
  cursor: pointer;
`;

const CustomedHr = styled.hr`
  border: 1px solid rgba(125, 125, 125, 0.2);
`;

const CustomedTr = styled.tr`
padding: 7.5px;

`;
const SuperTR = styled.tr`
  width:700px;
  height:500px;
`;