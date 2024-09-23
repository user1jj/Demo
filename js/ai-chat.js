const initChat = () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (!chatMessages || !userInput || !sendButton) {
        console.error('聊天元素未找到，可能尚未加载');
        return;
    }

    const MAX_MESSAGES = 20;
    const SYSTEM_MESSAGE = {
        role: "system",
        content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
    };

    let messages = [SYSTEM_MESSAGE];

    const renderMessages = () => {
        chatMessages.innerHTML = messages.slice(1).map(msg => {
            const content = msg.content.replace(/\n/g, '<br>');
            const formattedContent = content.replace(/(\d+\.\s*\*\*[^*]+\*\*)/g, '<strong>$1</strong>');
            return `<div class="message ${msg.role === 'user' ? 'user-message' : 'ai-message'}">
                ${formattedContent}
            </div>`;
        }).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const addMessage = (content, isUser = false) => {
        messages.push({ role: isUser ? 'user' : 'assistant', content });
        if (messages.length > MAX_MESSAGES) {
            messages = [SYSTEM_MESSAGE, ...messages.slice(-MAX_MESSAGES + 1)];
        }
        renderMessages();
        localStorage.setItem('chatMessages', JSON.stringify(messages.slice(1)));
    };

    const loadMessages = () => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            messages = [SYSTEM_MESSAGE, ...JSON.parse(savedMessages)];
            renderMessages();
        } else {
            // 如果没有保存的消息，添加初始化消息
            addMessage("你好！我是你的二次元AI助手。有什么关于动漫、漫画或者二次元文化的问题，都可以问我哦！", false);
        }
    };

    const chatWithKimi = async (input) => {
        try {
            const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'sk-3MU0dVPgX2iBnmq28oiiO7IXEecbigiWDD0Fa0YVOkxTIx9B'
                },
                body: JSON.stringify({
                    model: "moonshot-v1-8k",
                    messages: messages,
                    temperature: 0.3,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error chatting with Kimi:", error);
            throw new Error("抱歉，我遇到了一些问题。请稍后再试。");
        }
    };

    const handleSend = async () => {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, true);
        userInput.value = '';
        userInput.disabled = true;
        sendButton.disabled = true;

        try {
            const aiResponse = await chatWithKimi(userMessage);
            addMessage(aiResponse);
        } catch (error) {
            addMessage(error.message);
        } finally {
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    };

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    loadMessages();
};

// 将初始化函数暴露给全局作用域
window.initAIChat = initChat;

// 移除 DOMContentLoaded 事件监听器
// document.addEventListener('DOMContentLoaded', initChat);