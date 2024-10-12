import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Assuming the email is stored in the token payload or retrieved separately
      // Here we mock getting email from the token or another source
      const storedEmail = localStorage.getItem('userEmail'); // Assuming userEmail is stored
      setUserEmail(storedEmail); // Set email to be displayed
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); // Clear email on logout
    setUserEmail(null); // Reset user email to null after logout
    window.location.href = '/'; // Redirect to home page after logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Balance Care</div>
      <ul className={styles.navLinks}>
        <li><Link href="/">หน้าหลัก</Link></li>

        {userEmail ? (
          <>
            <li>
              <span className={styles.userEmail}>สวัสดีคุณ {userEmail}</span>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>ออกจากระบบ</button>
            </li>
          </>
        ) : (
          <>
            <li ><Link className='login' href="/login">เข้าสู่ระบบ</Link></li>
            <li ><Link className='register' href="/register">สมัครสมาชิก</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
