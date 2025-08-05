import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';

const useBookingSocket = (setConfirmedBookings) => {
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws-booking', // native WebSocket
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/bookings', message => {
          const newBooking = JSON.parse(message.body);
          setConfirmedBookings(prev => [...prev, newBooking]);
        });
      },
      onStompError: frame => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      }
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [setConfirmedBookings]);
};

export default useBookingSocket;
