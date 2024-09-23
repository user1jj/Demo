import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      {/* ... 现有导航链接 ... */}
      <Link href="/ai-chat">
        <a>AI聊天</a>
      </Link>
    </nav>
  );
};

export default Navbar;