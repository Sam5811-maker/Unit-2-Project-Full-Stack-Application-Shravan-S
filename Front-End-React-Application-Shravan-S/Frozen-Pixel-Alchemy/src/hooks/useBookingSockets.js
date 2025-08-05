import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect } from 'react';

const useBookingSocket = (setConfirmedBookings) => {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-booking'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/bookings', message => {
          console.log('Received booking:', message.body);
          const newBooking = JSON.parse(message.body);
          setConfirmedBookings(prev => [...prev, newBooking]);
        });
      },
      onStompError: frame => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      }
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [setConfirmedBookings]);
};

export default useBookingSocket;
