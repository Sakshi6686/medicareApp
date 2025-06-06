import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import peer from "../service/peer";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

const VideoChat = () => {
  const { user } = useSelector((state) => state.user);
  const socket = useSocket();

  const { senderId, receiverId } = useParams();

  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const [incomingCall, setIncomingCall] = useState(null); // { from, offer }
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);

  // Handle incoming call - show popup instead of auto answering
  const handleIncommingCall = useCallback(({ from, offer }) => {
    console.log("Incoming call from:", from);
    setIncomingCall({ from, offer });
    setRemoteSocketId(from);
  }, []);

  // Accept call handler
  const acceptCall = async () => {
    if (!incomingCall) return;
    const { from, offer } = incomingCall;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);

      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));

      for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
      }

      const answer = await peer.peer.createAnswer();
      await peer.peer.setLocalDescription(answer);

      socket.emit("call:accepted", { to: from, ans: answer });
      setCallAccepted(true);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  // Reject call handler
  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("call:rejected", { to: incomingCall.from });
    setIncomingCall(null);
  };

  // When remote accepts our call
  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      setRemoteSocketId(from);
      await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));

      if (myStream) {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream);
        }
      }
      setCallAccepted(true);
    },
    [myStream]
  );

  // Handle call rejected event from remote
  useEffect(() => {
    if (!socket) return;

    const handleCallRejected = ({ from }) => {
      setCallRejected(true);
      alert(`User ${from} rejected your call.`);
      // Optional: reset states here if needed
    };

    socket.on("call:rejected", handleCallRejected);

    return () => socket.off("call:rejected", handleCallRejected);
  }, [socket]);

  // Handle negotiation needed (caller or callee)
  const handleNegotiationNeeded = useCallback(async () => {
    if (!remoteSocketId) return;

    const offer = await peer.peer.createOffer();
    await peer.peer.setLocalDescription(offer);

    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  // Incoming negotiation offer
  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.peer.createAnswer();
      await peer.peer.setLocalDescription(answer);
      socket.emit("peer:nego:done", { to: from, ans: answer });
    },
    [socket]
  );

  // Final negotiation answer
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }, []);

  // Send ICE candidates when generated
  useEffect(() => {
    if (!socket || !remoteSocketId) return;

    peer.setOnIceCandidateCallback((candidate) => {
      if (candidate) {
        socket.emit("ice-candidate", { to: remoteSocketId, candidate });
        console.log("Sent ICE candidate");
      }
    });
  }, [socket, remoteSocketId]);

  // Listen for incoming ICE candidates
  useEffect(() => {
    if (!socket) return;

    const handleICE = async ({ candidate }) => {
      try {
        await peer.peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE candidate from remote");
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    socket.on("ice-candidate", handleICE);
    return () => socket.off("ice-candidate", handleICE);
  }, [socket]);

  // Remote stream handler
  useEffect(() => {
    if (!peer.peer) return;

    const handleTrackEvent = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      console.log("Remote stream received");
    };

    peer.peer.addEventListener("track", handleTrackEvent);
    return () => peer.peer.removeEventListener("track", handleTrackEvent);
  }, []);

  // Set up signaling listeners
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("addUser", user._id);

    socket.on("incomming-call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket, user, handleIncommingCall, handleCallAccepted, handleNegoNeedIncoming, handleNegoNeedFinal]);

  // Handle negotiation needed event
  useEffect(() => {
    if (!peer.peer) return;

    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
  }, [handleNegotiationNeeded]);

  // Start video call (caller side)
  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);

      for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
      }

      const offer = await peer.peer.createOffer();
      await peer.peer.setLocalDescription(offer);

      socket.emit("user:call", { receiverId, offer });
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  return (
    <div className="video-chat-container" style={{ padding: 20 }}>
      {/* Incoming Call Popup */}
      {incomingCall && (
        <div
          className="incoming-call-popup"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: 20,
            background: "white",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <p>Incoming call from: {incomingCall.from}</p>
          <button
            onClick={acceptCall}
            style={{ marginRight: 10, padding: "8px 12px" }}
          >
            Accept
          </button>
          <button onClick={rejectCall} style={{ padding: "8px 12px" }}>
            Reject
          </button>
        </div>
      )}

      {/* Video Streams */}
      <div className="video-wrapper" style={{ display: "flex", gap: 20 }}>
        {myStream && (
          <ReactPlayer
            playing
            muted
            height="200px"
            width="300px"
            url={myStream}
            style={{ border: "1px solid black", marginBottom: 10 }}
          />
        )}
        {remoteStream && (
          <ReactPlayer
            playing
            muted={false}
            height="400px"
            width="600px"
            url={remoteStream}
            style={{ border: "1px solid black" }}
          />
        )}
      </div>

      {/* Start Call Button */}
      {!myStream && !incomingCall && !callAccepted && (
        <button
          onClick={startVideoCall}
          className="start-button"
          style={{ marginTop: 20, padding: "10px 15px" }}
        >
          Start Video Call
        </button>
      )}

      {callRejected && (
        <p style={{ color: "red", marginTop: 10 }}>
          The call was rejected by the user.
        </p>
      )}
    </div>
  );
};

export default VideoChat;
