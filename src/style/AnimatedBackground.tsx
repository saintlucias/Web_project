import { useState, useEffect } from 'react';
import mall1 from '../images/mall1.jpg';
import mall from '../images/mall.jpg';
import fruit from '../images/fruit.jpg';


{/* 3초당 배열 속 이미지 교체 컴포넌트 */}

const AnimatedBackground = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [mall, mall1, fruit];
    const imageContainerStyle = {
        Position: 'fixed',
        width: '100%',
        height: '600px',
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: 'cover',
        minWidth: '1000px'
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentIndex, images.length]);
    return <div style={imageContainerStyle}></div>;
};

export default AnimatedBackground;