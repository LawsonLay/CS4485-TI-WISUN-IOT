import React, { useState, useEffect } from 'react';

export default function StorkTab() {
  const [isServerAvailable, setIsServerAvailable] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://localhost:8080/", { mode: 'no-cors' });
        setIsServerAvailable(response.ok || response.status === 0); // `status === 0` happens due to `no-cors`
      } catch (error) {
        setIsServerAvailable(false);
      }
    };

    checkServer();
  }, []);

  if (isServerAvailable) {
    return (
      <iframe
        src="http://localhost:8080/"
        style={{ width: '100%', height: '88vh', marginTop: '-20px', position: 'fixed' }}
      />
    );
  } else {
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh', fontSize: '24px', color: 'red' }}>
        <h1>404 - Page Not Found</h1>
        <p>Please make sure that Stork is installed and running!</p>
      </div>
    );
  }
}