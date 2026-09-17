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
    this.retryTimer = null;
    this.connectAttempts = 0;
  }

  init(roomCode, isHost) {
    this.roomCode = roomCode.toUpperCase();
    this.isHost = isHost;
    this.clientLabel = isHost ? 'HOST' : `OP-${this.clientId.slice(-3).toUpperCase()}`;
    this.connectAttempts = 0;
    if (this.retryTimer) {
      clearInterval(this.retryTimer);
      this.retryTimer = null;
    }

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
      if (this.peer && !this.peer.destroyed) {
        try { this.peer.destroy(); } catch(e) {}
      }

      const peerId = isHost ? `ZERO-HOUR-${this.roomCode}` : null;
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun.cloudflare.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log('[Network] PeerJS ID Opened:', id, 'Role:', this.clientLabel);
        this.updateRoomDisplay();

        if (this.isHost) {
          this.setNetworkBanner(`🟢 <strong style="color:#00ffaa">HOST READY:</strong> Room "${this.roomCode}" active. Tell friends to input code <strong>${this.roomCode}</strong> and click JOIN ROOM.`);
        } else {
          this.setNetworkBanner(`🔄 Connecting to Host for Room <strong>${this.roomCode}</strong>...`);
          this.connectToHost();
          this.startAutoRetry();
        }
      });

      this.peer.on('connection', (conn) => {
        console.log('[Network] Inbound Peer connected to Host:', conn.peer);
        this.connections.push(conn);
        this._setupConnectionEvents(conn, false);
      });

      this.peer.on('error', (err) => {
        console.warn('[Network] PeerJS error:', err);
        if (err.type === 'unavailable-id') {
          const altCode = `${this.roomCode}${Math.floor(Math.random() * 900 + 100)}`;
          const msg = `⚠️ ROOM CODE "${this.roomCode}" IS ALREADY IN USE! Change room code to <strong>${altCode}</strong> and click CREATE ROOM.`;
          this.setNetworkBanner(`<span style="color:#ff6b6b">${msg}</span>`);
        } else if (err.type === 'peer-unavailable') {
          const msg = `🔄 Host not detected yet for room "${this.roomCode}". Ensure the Host clicked "CREATE ROOM (HOST)" on their PC! (Retrying automatically...)`;
          this.setNetworkBanner(`<span style="color:#ffcc00">${msg}</span>`);
        }
        this.updateRoomDisplay();
      });

    } catch (err) {
      console.warn('[Network] Could not initialize PeerJS. Falling back to BroadcastChannel:', err);
    }

    this.updateRoomDisplay();
  }

  connectToHost() {
    if (this.isHost || !this.peer || this.peer.destroyed) return;
    if (this.hostConnection && this.hostConnection.open) return;

    this.connectAttempts++;
    const hostId = `ZERO-HOUR-${this.roomCode}`;
    console.log(`[Network] Attempting to connect to Host: ${hostId} (attempt ${this.connectAttempts})...`);

    try {
      if (this.hostConnection) {
        try { this.hostConnection.close(); } catch(e) {}
      }
      this.hostConnection = this.peer.connect(hostId, {
        reliable: true,
        metadata: { clientId: this.clientId, label: this.clientLabel }
      });
      this._setupConnectionEvents(this.hostConnection, true);
    } catch(err) {
      console.warn('[Network] Connect error:', err);
    }
  }

  startAutoRetry() {
    if (this.retryTimer) clearInterval(this.retryTimer);
    this.retryTimer = setInterval(() => {
      if (this.isHost) {
        clearInterval(this.retryTimer);
        return;
      }
      if (!this.hostConnection || !this.hostConnection.open) {
        console.log('[Network] Retry timer checking connection to Host...');
        this.connectToHost();
      } else {
        clearInterval(this.retryTimer);
        this.retryTimer = null;
      }
    }, 2500);
  }

  setNetworkBanner(htmlContent) {
    const banner = document.getElementById('lobby-network-banner');
    if (banner) {
      banner.innerHTML = `<span>${htmlContent}</span>`;
    }
  }

  isConnected() {
    if (this.isHost) return true;
    return !!(this.hostConnection && this.hostConnection.open);
  }

  _setupConnectionEvents(conn, isOutbound) {
    conn.on('open', () => {
      console.log('[Network] Connection opened with:', conn.peer, 'isHost:', this.isHost, 'isOutbound:', isOutbound);
      if (this.retryTimer) {
        clearInterval(this.retryTimer);
        this.retryTimer = null;
      }
      this.updateRoomDisplay();

      if (this.isHost) {
        this.setNetworkBanner(`🟢 <strong style="color:#00ffaa">PEER CONNECTED!</strong> Active operatives in room "${this.roomCode}".`);
        // Immediately push current authoritative room state to the newly connected peer
        this._handleIncomingMessage({
          type: 'PEER_CONNECTED',
          peerId: conn.peer,
          clientId: conn.metadata ? conn.metadata.clientId : conn.peer,
          label: conn.metadata ? conn.metadata.label : 'OPERATIVE'
        });
      } else {
        this.setNetworkBanner(`🟢 <strong style="color:#00ffaa">CONNECTED TO HOST!</strong> Room "${this.roomCode}" synced. Assign your station below.`);
        // As Client: send initial handshake and request current room state
        this.broadcast({
          type: 'PEER_HANDSHAKE',
          clientId: this.clientId,
          label: this.clientLabel
        });
        this.broadcast({
          type: 'REQUEST_ROOM_STATE',
          clientId: this.clientId
        });

        // Trigger game engine to claim any queued role
        if (window.game && window.game.onNetworkConnected) {
          window.game.onNetworkConnected();
        }
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
      let statusBadge = '';
      if (this.isHost) {
        const activePeers = this.connections.filter(c => c.open).length;
        statusBadge = activePeers > 0 
          ? `<span style="color:#00ffaa; margin-left:6px;">● ONLINE (${activePeers} OPERATIVE${activePeers > 1 ? 'S' : ''})</span>`
          : `<span style="color:#ffcc00; margin-left:6px;">○ WAITING FOR PEERS</span>`;
      } else {
        const isConn = this.hostConnection && this.hostConnection.open;
        statusBadge = isConn 
          ? `<span style="color:#00ffaa; margin-left:6px;">● CONNECTED TO HOST</span>`
          : `<span style="color:#ffcc00; margin-left:6px;">🔄 CONNECTING...</span>`;
      }
      el.innerHTML = `ROOM: <strong class="text-highlight">${this.roomCode}</strong> (${this.isHost ? 'HOST' : 'CLIENT'}) ${statusBadge}`;
    }
  }
}

const network = new NetworkEngine();
window.network = network;
