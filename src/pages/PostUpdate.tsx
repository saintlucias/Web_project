import React,{useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PostUpdate: React.FC = () => {    
    const navigate  = useNavigate();

    const TopersonalPage = () => {
        navigate('/PersonalPage');
    }

    const [visibility, setVisibility] = useState<string>('');

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibility(e.target.value);
      };

    return(
        <>
            <h2>PostUpdate page</h2>
                <button onClick={TopersonalPage}> 이전 페이지 </button>
            <select value={visibility} onChange={handleVisibilityChange}>
                <option value="yes">공개</option>
                <option value="no">비공개</option>
            </select>
        </>
    );
}

export default PostUpdate;

