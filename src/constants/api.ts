// export const APIURL = 'https://dev.tirangaidms.com';

// Detect if running locally or on server
export const APIURL =
  window.location.hostname === 'localhost'? 'http://localhost:8080' : 'https://dev.tirangaidms.com';
