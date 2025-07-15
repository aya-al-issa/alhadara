// src/Context/UserTypeContext.js
import { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const UserTypeContext = createContext();

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState(() => Cookies.get('user_type') || null);

  const updateUserType = (type) => {
    if (type) {
      Cookies.set('user_type', type, { secure: true, sameSite: 'strict' });
    } else {
      Cookies.remove('user_type');
    }
    setUserType(type);
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserType: updateUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  return useContext(UserTypeContext);
}
