export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT format: header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // convert to milliseconds
    return Date.now() > expiryTime;
  } catch (err) {
    console.error('Token parse error:', err);
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  window.location.href = '/login';
};