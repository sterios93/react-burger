import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-d2dd7.firebaseio.com/',
});

export default instance;