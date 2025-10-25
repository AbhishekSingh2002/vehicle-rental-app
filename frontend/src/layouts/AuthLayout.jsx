// frontend/src/layouts/AuthLayout.jsx
// Layout for authentication pages (login/register)

import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}