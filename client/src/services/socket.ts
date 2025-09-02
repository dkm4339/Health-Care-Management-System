import { Message } from '@shared/schema';

class SocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private authHandlers: (() => void)[] = [];

  connect(userId: string) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.authenticate(userId);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'auth' && data.status === 'success') {
          this.authHandlers.forEach(handler => handler());
        } else if (data.type === 'new_message') {
          this.messageHandlers.forEach(handler => handler(data.message));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic if needed
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private authenticate(userId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'auth',
        userId,
      }));
    }
  }

  sendMessage(senderId: string, receiverId: string, content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'chat_message',
        senderId,
        receiverId,
        content,
      }));
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  onAuth(handler: () => void) {
    this.authHandlers.push(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandlers = [];
    this.authHandlers = [];
  }
}

export const socketService = new SocketService();
