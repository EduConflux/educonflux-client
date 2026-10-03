import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatWsMessage {
  id?: number;
  classroomId: number;
  senderId?: number;
  senderName?: string;
  content: string;
  messageType?: string;
  createdAt?: string;
}

class WebSocketManager {
  private client: Client | null = null;
  private isConnected = false;
  private subscriptions: Map<string, any> = new Map();

  connect(): Promise<Client> {
    if (this.client && this.isConnected) {
      return Promise.resolve(this.client);
    }

    return new Promise((resolve) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      this.client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        debug: () => {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          this.isConnected = true;
          resolve(this.client!);
        },
        onDisconnect: () => {
          this.isConnected = false;
        },
        onStompError: (frame) => {
          console.warn('STOMP error:', frame.headers['message']);
        },
      });

      this.client.activate();
    });
  }

  async subscribeToClassroom(
    classroomId: number,
    onMessage: (msg: ChatWsMessage) => void
  ): Promise<() => void> {
    await this.connect();
    if (!this.client || !this.client.connected) {
      return () => {};
    }

    const destination = `/topic/classroom/${classroomId}/chat`;
    const sub = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const payload: ChatWsMessage = JSON.parse(message.body);
        onMessage(payload);
      } catch (err) {
        console.error('Failed to parse websocket message', err);
      }
    });

    this.subscriptions.set(destination, sub);

    return () => {
      sub.unsubscribe();
      this.subscriptions.delete(destination);
    };
  }

  async sendGroupMessage(classroomId: number, content: string): Promise<void> {
    await this.connect();
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/classroom/${classroomId}/chat`,
        body: JSON.stringify({ content }),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
      this.client = null;
    }
  }
}

export const wsManager = new WebSocketManager();
