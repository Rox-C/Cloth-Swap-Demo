import React, { useEffect, useState } from 'react';

function User() {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // 调试信息

    if (!token) {
      setError('Please log in to view user details.');
      setLoading(false);
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    console.log('Stored user data from localStorage:', storedUserData); // 调试信息

    if (storedUserData ) {
      setUserData(storedUserData);
      setLoading(false);
    } else {
      setError('Failed to load user data. Please try again later.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="user">
      <h1>用户</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
}

export default User;


