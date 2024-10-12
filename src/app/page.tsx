"use client";

import Navbar from '@/navbar';  // Import the Navbar component
import styles from './HomePage.module.css';

const DashboardPage = () => {
  return (
    <div className={styles.container}>
      <Navbar /> {/* Include the Navbar */}
      <div className={styles.content}>
        <h1 className={styles.title}>Balance Care</h1>
        <header className={styles.header}>
        <h1 className={styles.title}>ยินดีต้อนรับสู่บริการด้านสุขภาพของเรา</h1>
        <p className={styles.description}>สุขภาพของคุณคือความสำคัญของเรา สมัครสมาชิกหรือเข้าสู่ระบบเพื่อเข้าถึงการดูแลเฉพาะคุณ</p>
        <div className={styles.buttons}>
        </div>
        </header>
        </div>
      </div>
  );
};

export default DashboardPage;
