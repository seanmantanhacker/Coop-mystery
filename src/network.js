/* ==========================================================================
   OPERATION: ZERO HOUR - PEER-TO-PEER NETWORK ENGINE
   Supports WebRTC (PeerJS) & Local Multi-Tab BroadcastChannel Fallback
   Features: Unique Client IDs, Star Topology Re-Broadcast, Disconnect Events
   ========================================================================== */

class NetworkEngine {
  constructor() {
    this.peer = null;
    this.connections = []; // For Host: list of peer connections
    this.hostConnection = null; // For Client: connection to Host
    this.roomCode = null;
    this.isHost = false;
    this.broadcastChannel = null;
    this.onMessageCallbacks = [];
    this.onPeerDisconnectCallbacks = [];

    // Unique local client identification
    this.clientId = 'peer_' + Math.random().toString(36).substring(2, 8);
    this.clientLabel = 'OPERATIVE';
  }

  init(roomCode, isHost) {
    this.roomCode = roomCode.toUpperCase();
    this.isHost = isHost;
    this.clientLabel = isHost ? 'HOST' : `OP-${this.clientId.slice(-3).toUpperCase()}`;

    // 1. Setup Local BroadcastChannel (Guarantees instant zero-lag multi-tab testing)
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    this.broadcastChannel = new BroadcastChannel(`zero_hour_${this.roomCode}`);
    this.broadcastChannel.onmessage = (event) => {
      const data = event.data;
      if (!data || data.senderId === this.clientId) return; // Ignore own messages
      this._handleIncomingMessage(data);
    };

    // 2. Setup PeerJS for internet/LAN P2P across different machines
    try {
      const peerId = isHost ? `ZERO-HOUR-${this.roomCode}` : null;
      this.peer = new Peer(peerId, {
        debug: 1
      });

      this.peer.on('open', (id) => {
        console.log('[Network] PeerJS ID Opened:', id, 'Role:', this.clientLabel);
        this.updateRoomDisplay();

        if (!isHost) {
          // Connect to Host
          const hostId = `ZERO-HOUR-${this.roomCode}`;
          this.hostConnection = this.peer.connect(hostId, {
            metadata: { clientId: this.clientId, label: this.clientLabel }
          });
          this._setupConnectionEvents(this.hostConnection, true);
        }
      });

      this.peer.on('connection', (conn) => {
        console.log('[Network] Peer connected to Host:', conn.peer);
        this.connections.push(conn);
        this._setupConnectionEvents(conn, false);

        // Notify Host Game Engine of new peer connection
        this._handleIncomingMessage({
          type: 'PEER_CONNECTED',
          peerId: conn.peer,
          clientId: conn.metadata ? conn.metadata.clientId : conn.peer,
          label: conn.metadata ? conn.metadata.label : 'OPERATIVE'
        });
      });

      this.peer.on('error', (err) => {
        console.warn('[Network] PeerJS notice (Using BroadcastChannel fallback):', err);
      });

    } catch (err) {
      console.warn('[Network] Could not initialize PeerJS. Falling back to BroadcastChannel:', err);
    }

    this.updateRoomDisplay();
  }

  _setupConnectionEvents(conn, isOutbound) {
    conn.on('open', () => {
      console.log('[Network] Connection opened with:', conn.peer);
      if (isOutbound) {
        // Send initial handshake to Host
        this.broadcast({
          type: 'PEER_HANDSHAKE',
          clientId: this.clientId,
          label: this.clientLabel
        });
      }
    });

    conn.on('data', (data) => {
      if (!data || data.senderId === this.clientId) return;
      this._handleIncomingMessage(data);

      // Star-topology: If Host receives data from a client, relay it to other connected clients
      if (this.isHost) {
        this.connections.forEach(otherConn => {
          if (otherConn !== conn && otherConn.open) {
            otherConn.send(data);
          }
        });
      }
    });

    conn.on('close', () => {
      console.log('[Network] Connection closed:', conn.peer);
      this.connections = this.connections.filter(c => c !== conn);
      const lostClientId = conn.metadata ? conn.metadata.clientId : conn.peer;
      this.onPeerDisconnectCallbacks.forEach(cb => cb(lostClientId));
      this._handleIncomingMessage({
        type: 'PEER_DISCONNECTED',
        peerId: conn.peer,
        clientId: lostClientId
      });
    });
  }

  broadcast(message) {
    if (!message.senderId) {
      message.senderId = this.clientId;
      message.senderLabel = this.clientLabel;
    }
    console.log(`[Network Out ${this.clientLabel}]:`, message.type, message);

    // 1. Send to BroadcastChannel (Local Multi-Tab)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // 2. Send via PeerJS WebRTC
    if (this.isHost) {
      this.connections.forEach(conn => {
        if (conn.open) conn.send(message);
      });
    } else if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(message);
    }
  }

  onMessage(callback) {
    this.onMessageCallbacks.push(callback);
  }

  onPeerDisconnect(callback) {
    this.onPeerDisconnectCallbacks.push(callback);
  }

  _handleIncomingMessage(data) {
    console.log(`[Network In ${this.clientLabel}]:`, data.type, data);
    this.onMessageCallbacks.forEach(cb => cb(data));
  }

  updateRoomDisplay() {
    const el = document.getElementById('room-display');
    if (el) {
      el.innerHTML = `ROOM: <strong class="text-highlight">${this.roomCode}</strong> (${this.isHost ? 'HOST - COMMANDER' : 'CLIENT - OPERATIVE'})`;
    }
  }
}

const network = new NetworkEngine();
window.network = network;
