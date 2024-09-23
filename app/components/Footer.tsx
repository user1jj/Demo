import { useState, useEffect, useRef } from 'react';
import '../styles/Footer.css';

function Footer() {
  const [showQRCode, setShowQRCode] = useState(false);
  const qqContainerRef = useRef<HTMLDivElement>(null);

  const handleQQClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('QQ图标被点击');
    setShowQRCode(prevState => !prevState);
  }

  useEffect(() => {
    console.log('showQRCode 状态变化为:', showQRCode);

    const handleClickOutside = (event: MouseEvent) => {
      if (qqContainerRef.current && !qqContainerRef.current.contains(event.target as Node)) {
        setShowQRCode(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [showQRCode]);

  return (
    <footer>
      {/* ... 其他页脚内容 ... */}
      <div className="qq-container" ref={qqContainerRef}>
        <img 
          src="/qq-icon.png" 
          onClick={handleQQClick} 
          alt="QQ图标" 
          className="qq-icon" 
        />
        {showQRCode && (
          <img 
            src="/qq.jpg" 
            alt="QQ二维码" 
            className="qq-qrcode" 
          />
        )}
      </div>
    </footer>
  );
}

export default Footer;