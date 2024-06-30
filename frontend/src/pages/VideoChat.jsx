import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import peer from "../service/peer";
import ReactPlayer from "react-player"
import { useSelector } from "react-redux";

const VideoChat = () => {
   
  const { user } = useSelector((state) => state.user);
  const socket = useSocket();
  
  const params = useParams();
  const senderId = params.senderId;
  const receiverId = params.receiverId;
  const [users, setUsers] = useState([]);
  const [myStream,setMyStream]=useState(null);
  const [remoteSocketId,setRemoteSocketId]=useState(null);
  const [remoteStream,setRemoteStream]=useState(null)
   
   
//   const handleIncommingCall=useCallback(async({from,offer})=>{
//     console.log("incomingcall",from);
    
   
   
//     console.log("incomingcall",from);
//     setRemoteSocketId(from);
//     console.log("remotesocketid in handel icoming call2",remoteSocketId);

//     console.log("remotesocketid in handel icoming call",remoteSocketId);
//     const stream  = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     setMyStream(stream);
 
//     console.log("remotesocketid in handel icoming call3",remoteSocketId);
//   const ans=await peer.getAnswer(offer)
//       socket.emit("call:accepted",{to :from,ans})
// },[socket])
const handleIncommingCall = useCallback(async ({ from, offer }) => {
  console.log("incomingcall", from);
  setRemoteSocketId((prev) => {
    console.log("Previous remoteSocketId:", prev);
    return from;
  });

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setMyStream(stream);

  const ans = await peer.getAnswer(offer);
  socket.emit("call:accepted", { to: from, ans });
}, [socket]);

useEffect(() => {
  console.log("remoteSocketId changed:", remoteSocketId);
}, [remoteSocketId]);

const sendStreams=useCallback(()=>{
  for(const track of myStream.getTracks()){
    peer.peer.addTrack(track,myStream)
   }
    
},[myStream])
const handleCallAccepted = useCallback(async({from ,ans})=>{
   peer.setLocalDescription(ans);
   console.log("Call:Accepted!");
sendStreams()
   
},[sendStreams])

useEffect(() => {
  if (socket && user) {
    socket.emit("addUser", user._id);
    socket.on("getUsers", (users) => {
      console.log("active users in video", users);
      
    });

  }
}, [user]);

const handleNegotiationNeeded=useCallback(async ()=>{
 
  const offer=await peer.getOffer();
  console.log("get offer in handel nego needed",offer);
  console.log("remoteSocketid in hadle nedo needed",remoteSocketId);
   
   
  socket.emit("peer:nego:needed",{offer,to:remoteSocketId})

},[remoteSocketId,socket])

const handleNegoNeedIncoming=useCallback(async({from,offer})=>{
  console.log("handleneogneed incoming");
      const ans=await peer.getAnswer(offer);
      console.log("handleneogneed incoming2");
      socket.emit("peer:nego:done",{to:from,ans})
},[socket])

const handleNegoNeedFinal=useCallback(async({ans})=>{
  console.log("handleneogneed final");
await peer.setLocalDescription(ans)
},[])
 
useEffect(()=>{
  console.log("int useeffet nego1",remoteSocketId);
  peer.peer.addEventListener("negotiationneeded",handleNegotiationNeeded)
  console.log("int useeffet nego2",remoteSocketId);
return ()=>{
  peer.peer.removeEventListener("negotiationneeded",handleNegotiationNeeded)
}
},[handleNegotiationNeeded])


useEffect(()=>{
  peer.peer.addEventListener("track",async ev=>{
    const remoteStream=ev.streams
    console.log("Got tracks");
    setRemoteStream(remoteStream[0])
  })

},[])
  useEffect(() => {
   

     socket.on("incomming-call",handleIncommingCall)
     socket.on("call:accepted",handleCallAccepted)
    
      socket.on("peer:nego:needed",handleNegoNeedIncoming)
      socket.on("peer:nego:final",handleNegoNeedFinal)
      
      

     return ()=>{
      socket.off("incomming-call",handleIncommingCall)
      socket.off("call:accepted",handleCallAccepted)
     
      socket.off("peer:nego:needed",handleNegoNeedIncoming)
      socket.off("peer:nego:final",handleNegoNeedFinal)
      
     }
     
  }, [socket,handleIncommingCall,handleCallAccepted,handleNegoNeedIncoming,handleNegoNeedFinal,user]);
  
 
  const startVideoCall = async () => {
    try {
      const myStream  = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const offer=await peer.getOffer();
      console.log("receitver id in start video",receiverId);
      socket.emit("user:call",{receiverId,offer})
      setMyStream(myStream);
      
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

   
  return (
    <div className="video-chat-container">
      <div className="video-wrapper">
        
      </div>
      {!myStream && (
        <button onClick={startVideoCall} className="start-button">Start Video Call</button>
      )}
      {myStream && (
        <ReactPlayer
          playing
          muted
          height="100px"
          width="200px"
          url={myStream}
          
        />
 )}
 {remoteStream && (
        <ReactPlayer
          playing
          muted
          height="100px"
          width="200px"
          url={remoteStream}
          
        />
 )}


       
    </div>
  );
};

export default VideoChat;