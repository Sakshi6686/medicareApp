class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      this.onIceCandidateCallback = null;

      this.peer.onicecandidate = (event) => {
        if (event.candidate && this.onIceCandidateCallback) {
          this.onIceCandidateCallback(event.candidate);
        }
      };
    }
  }

  setOnIceCandidateCallback(callback) {
    this.onIceCandidateCallback = callback;
  }
}

export default new PeerService();
