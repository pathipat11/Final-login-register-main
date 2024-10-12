"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ใช้ useParams แทน useRouter

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function EditUserPage() {
  const { id } = useParams(); // ดึง id จาก URL
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string>(""); // จัดการค่าของ First Name
  const [lastName, setLastName] = useState<string>("");   // จัดการค่าของ Last Name
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // เพิ่มสถานะสำหรับการบันทึก

  // Fetch ข้อมูลผู้ใช้ตาม id
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/auth/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setFirstName(data.user.firstName); // เซ็ตค่าเริ่มต้นให้กับฟิลด์ First Name
            setLastName(data.user.lastName);   // เซ็ตค่าเริ่มต้นให้กับฟิลด์ Last Name
          } else {
            console.error("User not found");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setLoading(false);
        });
    }
  }, [id]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลใน input fields
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  // ฟังก์ชันบันทึกการเปลี่ยนแปลง
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }
  
      // อัปเดต state ด้วยข้อมูลที่ได้รับจาก server
      setUser(result.user);  // ใช้ข้อมูลที่ได้รับมาอัปเดต state
      alert('บันทึกการเปลี่ยนแปลงสำเร็จ');
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง');
    }
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      width: '400px',
    },
    input: {
      padding: '12px',
      margin: '10px 0',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: '100%',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '20px',
    },
    loading: {
      fontSize: '1.2rem',
      color: '#555',
    },
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found!</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit User</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
    <label>Email: <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} /></label>
    <br />
    <label>First Name: <input type="text" value={user.firstName} onChange={(e) => setUser({...user, firstName: e.target.value})} /></label>
    <br />
    <label>Last Name: <input type="text" value={user.lastName} onChange={(e) => setUser({...user, lastName: e.target.value})} /></label>
    <br />
    <button onClick={handleSubmit} style={styles.button}>Save Changes</button>
  </form>
    </div>
  );
}
