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

      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE candidate: ", event.candidate);
        }
      };

      this.peer.ontrack = (event) => {
        console.log("New track: ", event.streams[0]);
      };
    }
  }

  validateOffer(offer) {
    return offer && typeof offer === 'object' && 'type' in offer && 'sdp' in offer;
  }

  async getAnswer(offer) {
    console.log('Received offer in getAnswer:', offer);
    if (!this.validateOffer(offer)) {
      throw new Error('Invalid offer');
    }
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    }
  }

  async setLocalDescription(description) {
    if (this.peer) {
      console.log('Setting local description:', description);
      if (!description || !description.type || !description.sdp) {
        throw new Error('Invalid description');
      }
      await this.peer.setRemoteDescription(new RTCSessionDescription(description));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }
}

export default new PeerService();
