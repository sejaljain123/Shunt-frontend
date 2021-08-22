import { io } from 'socket.io-client';
const socket = io('https://sp-hunt.herokuapp.com', {
  withCredentials: true,
});

export default socket;
