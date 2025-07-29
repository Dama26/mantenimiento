// // src/hooks/useAuth.js
// import { useState, useEffect } from 'react';
// import { login as authLogin, logout as authLogout } from '../services/auth';
// import { setToken, setUser, getUser, removeToken } from '../services/token';

// export const useAuth2 = () => {
//   // const [user, setCurrentUser] = useState(null);
//   // const [error, setError] = useState(null);
//   // const [loading, setLoading] = useState(false);

//   //   useEffect(() => {
//   //   const storedUser = getUser();
//   //   if (storedUser) {
//   //     setCurrentUser(storedUser);
//   //   }
//   // }, []);


//   const login = async (email, password) => {
//     // setLoading(true);
//     try {
//       const { token, user: userData } = await authLogin(email, password);
//       setToken(token);
//       setUser(userData);
//       return true;
//     } catch (err) {
//       console.error
//       return false;
//     } finally {
//     }
//   };

//   const logout = () => {
//     authLogout();
//   };

//   return { login, logout };
// };