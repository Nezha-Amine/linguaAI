import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isBotLoading, setIsBotLoading] = useState(false); // Loading state for bot response
    const [recognition, setRecognition] = useState(null);

    const startListening = () => {
        const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognitionInstance.lang = 'es-ES';
        recognitionInstance.start();

        recognitionInstance.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setMessage(speechToText);
        };

        recognitionInstance.onend = () => setIsListening(false);
        setRecognition(recognitionInstance);
        setIsListening(true);
    };

    const stopListening = () => {
        if (recognition) recognition.stop();
        setIsListening(false);
    };

    const startChat = async () => {
        const res = await axios.post('http://localhost:5000/start_chat');
        setHistory(res.data.history);
    };

    const sendMessage = async () => {
        const updatedHistory = [...history, { sender: 'user', text: message }];
        setHistory(updatedHistory);
        setMessage('');
        setIsBotLoading(true); // Show loading animation
    
        try {
            const res = await axios.post('http://localhost:5000/chat/chat', {
                message,
                history: updatedHistory,
            }, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the correct content type
                },
            });
    
            setHistory([...updatedHistory, { sender: 'assistant', text: res.data.response }]);
            setIsBotLoading(false); // Hide loading animation
    
            const ttsRes = await axios.post(
                'http://localhost:5000/chat/speak',
                { text: res.data.response },
                { responseType: 'blob' }
            );
            const audioBlob = new Blob([ttsRes.data], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error sending message:', error);
            setIsBotLoading(false); // Ensure animation stops on error
        }
    };
    

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full screen height
                width: '100vw',  // Full screen width
                backgroundColor: '#F5F2FC',
                padding: '20px',
                boxSizing: 'border-box',
                margin: '0',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '90%', // Occupy most of the screen
                    width: '100%', // Full width
                    maxWidth: '900px',  // Optional: Max width for the chatbot container
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    overflow: 'hidden',
                }}
            >
                <h1 style={{ textAlign: 'center', color: '#663591' }}>Learn Spanish with Chat Bot</h1>
               
                <div
                    style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        padding: '10px',
                        marginBottom: '20px',
                        width: '100%', // Ensure this takes full width
                    }}
                >
                    {history.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'assistant' ? 'flex-start' : 'flex-end',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '60%',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    backgroundColor: msg.sender === 'assistant' ? '#663591' : '#FD6A04',
                                    color: '#FFFFFF',
                                }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isBotLoading && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                marginBottom: '10px',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '60%',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    backgroundColor: '#663591',
                                    color: '#FFFFFF',
                                    fontStyle: 'italic',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="loading-dots">Loading</span>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px' }}>
    <button
        onClick={startListening}
        disabled={isListening}
        style={{
            backgroundColor: '#663591',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            flexShrink: 0,  // Prevents the button from shrinking
        }}
    >
        🎙️
    </button>
    <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        style={{
            flex: '1',  // Takes up the remaining space
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            width: '100%',  // Make sure the input takes full available space
        }}
    />
    <button
        onClick={sendMessage}
        style={{
            backgroundColor: '#FD6A04',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            flexShrink: 0,  // Prevents the button from shrinking
        }}
    >
        ➤
    </button>
</div>

            </div>
            <style>
                {`
                .loading-dots::after {
                    content: '...';
                    animation: dots 1.5s steps(3, end) infinite;
                }
                @keyframes dots {
                    0% { content: ''; }
                    33% { content: '.'; }
                    66% { content: '..'; }
                    100% { content: '...'; }
                }
                `}
            </style>
        </div>
    );
};

export default ChatBot;
