import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import PasswordReset from './PasswordReset';

function AuthLayout() {
  const [view, setView] = useState('login');

  return (
    <>
      {view === 'login' && <Login onToggleView={setView} />}
      {view === 'signup' && <Signup onToggleView={setView} />}
      {view === 'reset' && <PasswordReset onToggleView={setView} />}
    </>
  );
}

export default AuthLayout;