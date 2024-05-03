export const baseApiUrl = 'http://127.0.0.1:8000/';

export function getCsrfToken() {
  
  const cookies = document.cookie.split(';');
    
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const cookieParts = cookie.split('=');
  
    if (cookieParts[0] === 'csrftoken') {
      return cookieParts[1];
    }
  }
  
  return null;
};

export function IsUserExist() {
  try{
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const cookieParts = cookie.split('=');
    
      if (cookieParts[0] === 'csrftoken') {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
}