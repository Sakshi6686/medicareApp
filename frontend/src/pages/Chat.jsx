import React, { useState, useEffect } from 'react';
import Layout from '../component/layout';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertSlice';
import { useSocket } from "../context/SocketProvider";
  
 
const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const senderId = user?._id;
  const receiverId = params.id; 

 const socket=useSocket();
  const [users,setUsers]=useState([]);
  useEffect(() => {
    if (!user) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [user, dispatch]);

   

  useEffect(() => {
    if (socket && user) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (users) => {
        console.log("active users", users);
        setUsers(users);
      });

      socket?.on("getMessage",data=>{
        console.log("data",data);
        console.log(data);
        setMessages((prevMessages) => [
          ...prevMessages,
          data
        ]);
        console.log(messages);
      })
    }
  }, [socket, user]);



  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/message/${receiverId}`, { params: { senderId } });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    try {
      socket?.emit("sendMessage",{
        senderId,
        receiverId,
        message,


      })
      const res = await axios.post(`/api/message/send/${receiverId}`, {
        message,
        senderId,
      });
      if (res.data.success) {
        setMessages([...messages, { senderId, message }]);
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const handleVideoChat= async()=>{
          navigate(`/video-chat/${senderId}/${receiverId}`);
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.senderId === senderId ? 'sent' : 'received'}`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="input-container">
        <button onClick={handleVideoChat}>Video chat</button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;