const backendBase=window.location.hostname==='localhost'?'http://localhost:5000':'https://major-project-backend-mern.herokuapp.com';
const frontendBase=window.location.hostname==='localhost'?'http://localhost:3000':'https://major-project-frontend-mern.herokuapp.com';

export const backendApi=`${backendBase}/api`;
export const frontendApi=`${frontendBase}`;