import React from 'react';

const ImageCarousel: React.FC = () => {
  const images = [
    '/path/to/your/personal/photo1.jpg',
    '/path/to/your/personal/photo2.jpg',
    // ... 添加更多个人照片
  ];

  // ... 现有代码 ...

  return (
    <div className={styles.carouselContainer}>
      {/* ... 现有代码 ... */}
    </div>
  );
};

export default ImageCarousel;