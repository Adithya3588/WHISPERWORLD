import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { rtdb } from '../firebase/config';
import { ref, push, onChildAdded } from 'firebase/database';

const socket = io('http://localhost:5000', { autoConnect: false });
interface ChatProps {
  currentUserCode: string;
}
export const Chat: React.FC<ChatProps> = ({ currentUserCode }) => {
  const { userCode } = useParams<{ userCode: string }>();
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean; time: string }[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userCode) return;
    
    socket.connect();
    socket.emit('joinRoom', userCode);

    const chatRef = ref(rtdb, `chats/${userCode}`);
    
    onChildAdded(chatRef, (snapshot) => {
      const data = snapshot.val();

      // Skip displaying if this message is already fromMe (already pushed)
      if (data.fromMe) return;

      setMessages((prev) => [...prev, { ...data, fromMe: false }]);
    });

    return () => {
      socket.emit('leaveRoom', userCode);
      socket.disconnect();
      setMessages([]);
    };
  }, [userCode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !userCode) return;

    const msg = {
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
     from: currentUserCode,
          // Sender identity
      to: userCode,               // Receiver (room)
     
      fromMe: true,
    };

    // Push to Firebase
    const chatRef = ref(rtdb, `chats/${userCode}`);
    push(chatRef, msg);

    // Notify other peer
   socket.emit('sendMessage', {
      text: msg.text,
      time: msg.time,
      
      from: msg.from,
      to: msg.to,
      room: userCode
    });

    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-rose-100 to-sky-100 p-6">
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-pink-200">
        <h2 className="text-2xl font-bold mb-5 text-pink-700 text-center">
          🎀 Chat with Anonymous #{userCode}
        </h2>

        <div className="space-y-2 max-h-64 overflow-y-auto mb-4 bg-white/70 p-3 rounded-xl border border-sky-200">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-3 py-2 rounded-lg shadow-sm max-w-[75%] text-sm text-gray-700 relative
                ${msg.fromMe
                    ? 'bg-gradient-to-l from-pink-300 via-rose-200 to-yellow-200'
                    : 'bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200'}`}
              >
                {msg.text}
                <div className="text-[10px] text-gray-600 text-right mt-1">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border-2 border-rose-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            placeholder="💬 Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            ➤ Send
          </button>
        </div>
      </div>
    </div>
  );
};
