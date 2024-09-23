import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/AiChat.module.css';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 从本地存储加载聊天历史
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // 保存聊天历史到本地存储
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      content: userInput,
      sender: 'user',
    };

    setMessages([...messages, newMessage]);
    setUserInput('');
    setIsAiTyping(true);

    try {
      const response = await axios.post('/api/chat', { message: userInput });
      const aiReply: Message = {
        id: Date.now(),
        content: response.data.reply,
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiReply]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {messages.map(message => (
          <div key={message.id} className={`${styles.message} ${styles[message.sender]}`}>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
        {isAiTyping && <div className={styles.aiTyping}>AI正在输入...</div>}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入您的消息..."
        />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  );
};

export default AiChat;