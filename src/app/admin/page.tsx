"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Fetch users on component mount
  useEffect(() => {
    // Correct URL path, assuming this endpoint returns all users
    fetch('/api/auth/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data.users is an array
        if (Array.isArray(data.users)) {
          setUsers(data.users);  // Set the fetched users
        } else {
          console.error('Users not found or invalid response:', data);
          setUsers([]); // Fallback if the response doesn't contain valid users
        }
        setLoading(false);  // Set loading to false after fetching
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });

    // Fetch logged in user's email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้รายนี้?')) {
      try {
        const response = await fetch(`/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        alert('ลบผู้ใช้สำเร็จ');
        // Fetch updated user list after deletion
        const updatedUsers = await fetch('/api/auth/users').then((res) => res.json());
        setUsers(updatedUsers.users);  // Refresh the list
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ยินดีต้อนรับสู่หน้าแอดมิน</h1>
      {userEmail && <p style={styles.userEmail}>คุณล็อกอินในฐานะ: {userEmail}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ลำดับ</th>
            <th style={styles.th}>ชื่อ</th>
            <th style={styles.th}>อีเมล</th>
            <th style={styles.th}>ชื่อจริง</th>
            <th style={styles.th}>นามสกุล</th>
            <th style={styles.th}>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.firstName}</td>
                <td style={styles.td}>{user.lastName}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(user._id)} style={styles.editButton}>
                    แก้ไข
                  </button>
                  <button onClick={() => handleDelete(user._id)} style={styles.deleteButton}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={styles.td}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleLogout} style={styles.logoutButton}>
        ออกจากระบบ
      </button>
    </div>
  );
}

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
  userEmail: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '30px',
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  editButton: {
    marginRight: '10px',
    padding: '6px 12px',
    backgroundColor: '#ffb300',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
