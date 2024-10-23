"use client";

import Navbar from '@/navbar';  // Import the Navbar component
import styles from './DashboardPage.module.css';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className={styles.container}>
      <Navbar /> {/* Include the Navbar */}
      <div className={styles.content}>
        <h1 className={styles.title}>Balance Care</h1>
        <div className={styles.cards}>
            <div className={styles.card}>
              <h2>โปรไฟล์</h2>
              <p>จัดการข้อมูลส่วนตัวและรายละเอียดทางการแพทย์ของคุณ</p>
            </div>
            <div className={styles.card}>
              <h2>การนัดหมาย</h2>
              <p>ดูการนัดหมายที่กำลังจะมาถึงและกำหนดการนัดใหม่</p>
            </div>
            <div className={styles.card}>
              <h2>ประวัติการรักษา</h2>
              <p>ตรวจสอบประวัติการรักษาและการรักษาที่ผ่านมา</p>
            </div>
            <div className={styles.card}>
              <h2>กิจกรรมล่าสุด</h2>
              <p>ดูการติดต่อกับบริการด้านสุขภาพล่าสุดของคุณ</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;