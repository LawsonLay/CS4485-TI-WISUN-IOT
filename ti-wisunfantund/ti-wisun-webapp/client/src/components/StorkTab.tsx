import React, { useState, useEffect } from 'react';
import {LoadingBars} from './LoadingBars'; // Import the LoadingBars component

export default function StorkTab() {
  // Status can be 'checking', 'local', 'remote', 'error'
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkServers = async () => {
      // 1. Check localhost
      try {
        const responseLocal = await fetch("http://localhost:8080/", { mode: 'no-cors' });
        if (responseLocal.ok || responseLocal.status === 0) {
          setStatus('local');
          return; // Local server found
        }
      } catch (error) {
        console.warn("Localhost check failed, trying remote:", error);
      }

      // 2. Check remote (only if local failed)
      const remoteController = new AbortController();
      const remoteSignal = remoteController.signal;
      const remoteTimeout = setTimeout(() => {
        remoteController.abort();
        console.warn("Remote check timed out after 5 seconds.");
        setStatus('error'); // Set status to error on timeout
      }, 5000); // 5 seconds timeout

      try {
        const responseRemote = await fetch("http://192.168.6.2:8080/", { mode: 'no-cors', signal: remoteSignal });
        clearTimeout(remoteTimeout); // Clear the timeout if fetch succeeds

        if (responseRemote.ok || responseRemote.status === 0) {
          // Open remote Stork in a new tab
          window.open("http://192.168.6.2:8080/", "_blank");
          setStatus('remote');
          return; // Remote server found
        }
        // If fetch "succeeded" but wasn't ok (and not status 0 for no-cors), fall through to error
      } catch (error: any) {
        clearTimeout(remoteTimeout); // Clear timeout in case of fetch error
        if (error.name === 'AbortError') {
          // Timeout already handled setting status to 'error'
          return;
        } else {
          console.warn("Remote check failed:", error);
        }
      }

      // 3. If local failed and remote failed or timed out
      // Ensure status isn't already set to 'error' by the timeout before setting it again
      if (status !== 'error') {
         setStatus('error');
      }
    };

    checkServers();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (status === 'checking') {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <LoadingBars style={{ width: '100px', height: '100px' }} /> {/* Use LoadingBars */}
        </div>
    );
  } else if (status === 'local') {
    return (
      <iframe
        src="http://localhost:8080/"
        style={{ width: '100%', height: '88vh', marginTop: '-20px', position: 'fixed' }}
        title="Stork Local" // Added title for accessibility
      />
    );
  } else if (status === 'remote') {
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh', fontSize: '24px', color: 'green' }}>
        <h1>Remote connection detected.</h1>
        <p>
          <a href="http://192.168.6.2:8080/" target="_blank" rel="noopener noreferrer">
            Click here if the Stork webpage does not open automatically.
          </a>
        </p>
      </div>
    );
  } else { // status === 'error'
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh', fontSize: '24px', color: 'red' }}>
        <h1>404 - Stork Not Found</h1>
        <p>Please make sure that Stork is installed and running locally or remotely.</p>
        <p>It can also be on a different IP if not deployed on a BeaglePlay and accessed via USB network.</p>
      </div>
    );
  }
}