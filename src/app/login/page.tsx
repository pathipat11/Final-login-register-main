"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar';
import styles from './LoginPage.module.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error state on new submission

    // Basic validation
    if (password.length < 5) {
      setError('รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save token and email in localStorage or sessionStorage
        if (rememberMe) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email);
        } else {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('userEmail', email);
        }

        if (email === 'admin@gmail.com') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'เข้าสู่ระบบล้มเหลว');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <form onSubmit={handleLogin} className={styles.form}>
          <h1 className={styles.title}>เข้าสู่ระบบ</h1>
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className={styles.label} htmlFor="rememberMe">จดจำฉัน</label>
          </div>
          <button type="submit" className={styles.button}>เข้าสู่ระบบ</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
