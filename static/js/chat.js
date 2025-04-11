// async function loadSessions() {
//     try {
//         const response = await fetch('/api/sessions/');
//         const data = await response.json();
        
//         if (response.ok) {
//             // Clear the current list
//             topicsList.innerHTML = '';
            
//             // Add each session to the list
//             data.sessions.forEach(session => {
//                 const topicItem = createTopicItem(
//                     session.topic, 
//                     session.id, 
//                     session.created_at,
//                     session.id === sessionId // Is this the active session?
//                 );
//                 topicsList.appendChild(topicItem);
//             });
//         } else {
//             console.error('Failed to load sessions:', data.error);
//         }
//     } catch (error) {
//         console.error('Error loading sessions:', error);
//     }
// }

// // Helper function to create a topic item element
// function createTopicItem(topicName, sessionId, createdAt, isActive = false) {
//     const topicItem = document.createElement('div');
//     topicItem.classList.add('topic-item');
//     if (isActive) topicItem.classList.add('active');
    
//     topicItem.innerHTML = `
//         <div class="topic-name">${topicName}</div>
//         <div class="topic-date">${formatDate(createdAt)}</div>
//     `;
    
//     // Add click event to load this session
//     topicItem.addEventListener('click', () => {
//         loadSessionChat(sessionId);
//     });
    
//     return topicItem;
// }

// // Format date for display
// function formatDate(dateString) {
//     const now = new Date();
//     const date = new Date(dateString);
    
//     // If today, just show time
//     if (date.toDateString() === now.toDateString()) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // If this year, show month and day
//     if (date.getFullYear() === now.getFullYear()) {
//         return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
    
//     // Otherwise show full date
//     return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
// }

// // Function to load a session's messages
// async function loadSessionChat(clickedSessionId) {
//     if (clickedSessionId === sessionId) return; // Already loaded
    
//     showLoading();
    
//     try {
//         const response = await fetch(`/api/sessions/${clickedSessionId}/messages/`);
//         const data = await response.json();
        
//         if (response.ok) {
//             // Update the session ID
//             sessionId = clickedSessionId;
            
//             // Update the UI with session info
//             currentTopicTitle.textContent = data.session.topic;
//             proficiencyBadge.textContent = data.session.proficiency.charAt(0).toUpperCase() + 
//                                            data.session.proficiency.slice(1);
            
//             // Clear the chat container
//             chatContainer.innerHTML = '';
            
//             // Add all messages
//             data.messages.forEach(msg => {
//                 addMessage(msg.content, msg.is_user);
                
//                 // Update confidence if it's an AI message
//                 if (!msg.is_user && msg.confidence_score !== null) {
//                     updateConfidenceMeter(msg.confidence_score);
//                 }
//             });
            
//             // Update topic list UI to reflect active session
//             document.querySelectorAll('.topic-item').forEach(item => {
//                 item.classList.remove('active');
//             });
            
//             // Find and mark the clicked session as active
//             const items = document.querySelectorAll('.topic-item');
//             for (let i = 0; i < items.length; i++) {
//                 if (items[i].querySelector('.topic-name').textContent === data.session.topic) {
//                     items[i].classList.add('active');
//                     break;
//                 }
//             }
//         } else {
//             console.error('Failed to load session chat:', data.error);
//         }
//     } catch (error) {
//         console.error('Error loading session chat:', error);
//     } finally {
//         hideLoading();
//     }
// }

// // Update the addTopicToHistory function to refresh the sessions list
// function addTopicToHistory(topicName, sessionId, isActive = true) {
//     // Instead of manually adding, now we'll just reload all sessions
//     loadSessions();
// }

// document.addEventListener('DOMContentLoaded', () => {
//     // DOM Elements
//     const chatContainer = document.getElementById('chat-container');
//     const userInput = document.getElementById('user-input');
//     const sendBtn = document.getElementById('send-btn');
//     const loadingIndicator = document.getElementById('loading-indicator');
//     const confidenceBar = document.getElementById('confidence-bar');
//     const confidencePercentage = document.getElementById('confidence-percentage');
//     const currentTopicTitle = document.getElementById('current-topic-title');
//     const proficiencyBadge = document.getElementById('proficiency-badge');
//     const topicPlaceholder = document.getElementById('topic-placeholder');
//     const topicsList = document.getElementById('topics-list');
//     const newTopicBtn = document.getElementById('new-topic-btn');

//     // Get session data from sessionStorage
//     const topic = sessionStorage.getItem('topic') || 'Unknown Topic';
//     const proficiency = sessionStorage.getItem('proficiency') || 'intermediate';
//     const hfToken = sessionStorage.getItem('hf_token');
    
//     // Set initial values
//     currentTopicTitle.textContent = topic;
//     proficiencyBadge.textContent = proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
//     topicPlaceholder.textContent = topic;
    
//     // Session management
//     let sessionId = null;
//     let confidenceScore = 70; // Default starting confidence

//     // Update confidence meter
//     function updateConfidenceMeter(score) {
//         confidenceScore = score;
//         confidenceBar.style.width = `${score}%`;
//         confidencePercentage.textContent = `${score}%`;
        
//         // Change color based on confidence level
//         if (score < 40) {
//             confidenceBar.style.background = 'var(--danger-color)';
//         } else if (score < 70) {
//             confidenceBar.style.background = 'var(--warning-color)';
//         } else {
//             confidenceBar.style.background = 'linear-gradient(to right, var(--warning-color), var(--success-color))';
//         }
//     }

//     // Add a message to the chat
//     function addMessage(content, isUser = false) {
//         const messageDiv = document.createElement('div');
//         messageDiv.classList.add('message');
//         messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        
//         messageDiv.innerHTML = `
//             <div class="message-content">
//                 <p>${content}</p>
//             </div>
//         `;
        
//         chatContainer.appendChild(messageDiv);
//         chatContainer.scrollTop = chatContainer.scrollHeight;
//     }

//     // Initialize session
//     async function initializeSession() {
//         showLoading();
        
//         try {
//             const response = await fetch('/api/start_session/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     topic,
//                     proficiency
//                 })
//             });
            
//             const data = await response.json();
            
//             if (response.ok) {
//                 sessionId = data.session_id;

//                 loadSessions();
                
//                 // Add this topic to the history list
//                 addTopicToHistory(topic, sessionId);
//             } else {
//                 console.error('Failed to initialize session:', data.error);
//                 addMessage('Sorry, I had trouble starting our session. Please try again.', false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             addMessage('Sorry, I had trouble connecting to the server. Please check your connection and try again.', false);
//         } finally {
//             hideLoading();
//         }
//     }

//     // Send message to API
//     async function sendMessage(message) {
//         if (!sessionId) {
//             console.error('No active session.');
//             return;
//         }
        
//         showLoading();
        
//         try {
//             const response = await fetch('/api/chat/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     session_id: sessionId,
//                     message,
//                     hf_token: hfToken
//                 })
//             });
            
//             const data = await response.json();
            
//             if (response.ok) {
//                 addMessage(data.response, false);
//                 updateConfidenceMeter(data.confidence_score);
//             } else {
//                 console.error('Failed to send message:', data.error);
//                 addMessage('Sorry, I had trouble processing your message. Please try again.', false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
            
//             // Fallback to direct API call if Django backend fails
//             fallbackToDirectAPI(message);
//         } finally {
//             hideLoading();
//         }
//     }

//     // Direct API call fallback (in case Django server fails)
//     async function fallbackToDirectAPI(message) {
//         try {
//             // Create a prompt for the Hugging Face API
//             const prompt = `
//             You are an AI student learning from a human teacher about ${topic}.
//             The human teacher has ${proficiency} knowledge about this topic.
            
//             Your goal is to learn from them while asking insightful questions that help them reinforce their knowledge.
            
//             If they explain something correctly, ask follow-up questions that help them elaborate further.
            
//             If they explain something incorrectly, don't correct them directly, but ask strategic questions
//             that help them realize their misunderstanding. For example, if they say plants use oxygen instead
//             of CO2 for photosynthesis, ask "That's interesting - if plants use oxygen, what do they release
//             during photosynthesis?"
            
//             Human teacher: ${message}
            
//             AI student:
//             `;
            
//             const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf", {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${hfToken}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     inputs: prompt,
//                     parameters: {
//                         max_length: 200,
//                         temperature: 0.7,
//                         top_p: 0.9,
//                         do_sample: true
//                     }
//                 })
//             });
            
//             const data = await response.json();
            
//             if (data && data[0] && data[0].generated_text) {
//                 // Extract just the AI response part
//                 const fullResponse = data[0].generated_text;
//                 const aiResponsePart = fullResponse.split('AI student:')[1]?.trim() || 
//                                       "I'm having trouble processing that. Could you explain it again?";
                
//                 addMessage(aiResponsePart, false);
                
//                 // Simple confidence calculation for fallback mode
//                 const questionCount = (aiResponsePart.match(/\?/g) || []).length;
//                 const newConfidence = Math.min(confidenceScore + (questionCount > 0 ? 5 : -5), 100);
//                 updateConfidenceMeter(newConfidence);
//             } else {
//                 addMessage("I'm sorry, I'm having trouble connecting to my knowledge base. Could we try again later?", false);
//             }
//         } catch (error) {
//             console.error('Fallback API error:', error);
//             addMessage("I'm sorry, there seems to be a connection issue. Please check your internet connection and try again.", false);
//         }
//     }

//     // Handle form submission
//     function handleSubmit() {
//         const message = userInput.value.trim();
        
//         if (!message) return;
        
//         // Add user message to chat
//         addMessage(message, true);
        
//         // Clear input
//         userInput.value = '';
        
//         // Send to API
//         sendMessage(message);
//     }

//     // Event listeners
//     sendBtn.addEventListener('click', handleSubmit);
    
//     userInput.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSubmit();
//         }
//     });
    
//     // Auto-resize textarea
//     userInput.addEventListener('input', () => {
//         userInput.style.height = 'auto';
//         userInput.style.height = (userInput.scrollHeight) + 'px';
//     });
    
//     newTopicBtn.addEventListener('click', () => {
//         // Redirect back to landing page
//         window.location.href = '/';
//     });
    
//     // Utility functions
//     function showLoading() {
//         loadingIndicator.classList.add('active');
//     }
    
//     function hideLoading() {
//         loadingIndicator.classList.remove('active');
//     }
    
//     // Initialize the session on page load
//     initializeSession();
    
//     // Set initial confidence
//     updateConfidenceMeter(confidenceScore);

//     loadSessions();
// });



// document.addEventListener('DOMContentLoaded', () => {
//     // DOM Elements
//     const chatContainer = document.getElementById('chat-container');
//     const userInput = document.getElementById('user-input');
//     const sendBtn = document.getElementById('send-btn');
//     const loadingIndicator = document.getElementById('loading-indicator');
//     const confidenceBar = document.getElementById('confidence-bar');
//     const confidencePercentage = document.getElementById('confidence-percentage');
//     const currentTopicTitle = document.getElementById('current-topic-title');
//     const proficiencyBadge = document.getElementById('proficiency-badge');
//     const topicPlaceholder = document.getElementById('topic-placeholder');
//     const topicsList = document.getElementById('topics-list');
//     const newTopicBtn = document.getElementById('new-topic-btn');

//     // Get session data from sessionStorage
//     const topic = sessionStorage.getItem('topic') || 'Unknown Topic';
//     const proficiency = sessionStorage.getItem('proficiency') || 'intermediate';
//     const hfToken = sessionStorage.getItem('hf_token');
    
//     // Set initial values
//     currentTopicTitle.textContent = topic;
//     proficiencyBadge.textContent = proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
//     topicPlaceholder.textContent = topic;
    
//     // Session management
//     let sessionId = null;
//     let confidenceScore = 70; // Default starting confidence

//     // MOVE ALL YOUR FUNCTIONS HERE, inside the DOMContentLoaded event

//     // Load sessions function
//     async function loadSessions() {
//         try {
//             const response = await fetch('/api/sessions/');
//             const data = await response.json();
            
//             if (response.ok) {
//                 // Clear the current list
//                 topicsList.innerHTML = '';
                
//                 // Add each session to the list
//                 data.sessions.forEach(session => {
//                     const topicItem = createTopicItem(
//                         session.topic, 
//                         session.id, 
//                         session.created_at,
//                         session.id === sessionId // Is this the active session?
//                     );
//                     topicsList.appendChild(topicItem);
//                 });
//             } else {
//                 console.error('Failed to load sessions:', data.error);
//             }
//         } catch (error) {
//             console.error('Error loading sessions:', error);
//         }
//     }

//     // Helper function to create a topic item element
//     function createTopicItem(topicName, sessionId, createdAt, isActive = false) {
//         const topicItem = document.createElement('div');
//         topicItem.classList.add('topic-item');
//         if (isActive) topicItem.classList.add('active');
        
//         topicItem.innerHTML = `
//             <div class="topic-name">${topicName}</div>
//             <div class="topic-date">${formatDate(createdAt)}</div>
//         `;
        
//         // Add click event to load this session
//         topicItem.addEventListener('click', () => {
//             loadSessionChat(sessionId);
//         });
        
//         return topicItem;
//     }

//     // Format date for display
//     function formatDate(dateString) {
//         // Your existing formatDate function
//     }

//     // Function to load a session's messages
//     async function loadSessionChat(clickedSessionId) {
//         // Your existing loadSessionChat function
//     }

//     // Add topic to history list
//     function addTopicToHistory(topicName, sessionId, isActive = true) {
//         // Instead of manually adding, now we'll just reload all sessions
//         loadSessions();
//     }

//     // Update confidence meter
//     function updateConfidenceMeter(score) {
//         // Your existing updateConfidenceMeter function
//     }

//     // Add a message to the chat
//     function addMessage(content, isUser = false) {
//         // Your existing addMessage function
//     }

//     // Initialize session
//     async function initializeSession() {
//         // Your existing initializeSession function
//     }

//     // Send message to API
//     async function sendMessage(message) {
//         // Your existing sendMessage function
//     }

//     // Direct API call fallback
//     async function fallbackToDirectAPI(message) {
//         // Your existing fallbackToDirectAPI function
//     }

//     // Handle form submission
//     function handleSubmit() {
//         // Your existing handleSubmit function
//     }

//     // Utility functions
//     function showLoading() {
//         loadingIndicator.classList.add('active');
//     }
    
//     function hideLoading() {
//         loadingIndicator.classList.remove('active');
//     }
    
//     // Event listeners
//     sendBtn.addEventListener('click', handleSubmit);
    
//     userInput.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSubmit();
//         }
//     });
    
//     // Auto-resize textarea
//     userInput.addEventListener('input', () => {
//         userInput.style.height = 'auto';
//         userInput.style.height = (userInput.scrollHeight) + 'px';
//     });
    
//     newTopicBtn.addEventListener('click', () => {
//         // Redirect back to landing page
//         window.location.href = '/';
//     });
    
//     // Initialize the session on page load
//     initializeSession();
    
//     // Set initial confidence
//     updateConfidenceMeter(confidenceScore);

//     // Load previous sessions
//     loadSessions();
// });

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidencePercentage = document.getElementById('confidence-percentage');
    const currentTopicTitle = document.getElementById('current-topic-title');
    const proficiencyBadge = document.getElementById('proficiency-badge');
    const topicPlaceholder = document.getElementById('topic-placeholder');
    const topicsList = document.getElementById('topics-list');
    const newTopicBtn = document.getElementById('new-topic-btn');

    // Get session data from sessionStorage
    const topic = sessionStorage.getItem('topic') || 'Unknown Topic';
    const proficiency = sessionStorage.getItem('proficiency') || 'intermediate';
    const hfToken = sessionStorage.getItem('hf_token');
    
    // Set initial values
    currentTopicTitle.textContent = topic;
    proficiencyBadge.textContent = proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
    topicPlaceholder.textContent = topic;
    
    // Session management
    let sessionId = null;
    let confidenceScore = 70; // Default starting confidence

    // Update confidence meter
    function updateConfidenceMeter(score) {
        confidenceScore = score;
        confidenceBar.style.width = `${score}%`;
        confidencePercentage.textContent = `${score}%`;
        
        // Change color based on confidence level
        if (score < 40) {
            confidenceBar.style.background = 'var(--danger-color)';
        } else if (score < 70) {
            confidenceBar.style.background = 'var(--warning-color)';
        } else {
            confidenceBar.style.background = 'linear-gradient(to right, var(--warning-color), var(--success-color))';
        }
    }

    // Add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Format date for display
    function formatDate(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        
        // If today, just show time
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // If this year, show month and day
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        
        // Otherwise show full date
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Helper function to create a topic item element
    function createTopicItem(topicName, sessionId, createdAt, isActive = false) {
        const topicItem = document.createElement('div');
        topicItem.classList.add('topic-item');
        if (isActive) topicItem.classList.add('active');
        
        topicItem.innerHTML = `
            <div class="topic-name">${topicName}</div>
            <div class="topic-date">${formatDate(createdAt)}</div>
        `;
        
        // Add click event to load this session
        topicItem.addEventListener('click', function() {
            console.log(`Topic clicked: ${topicName}, Session ID: ${sessionId}`);
            loadSessionChat(sessionId);
        });
        
        return topicItem;
    }

    // Load sessions function
    async function loadSessions() {
        try {
            const response = await fetch('/api/sessions/');
            const data = await response.json();
            
            if (response.status === 200) {
                console.log(`Loaded ${data.sessions.length} sessions`);
                
                // Clear the current list
                topicsList.innerHTML = '';
                
                // Add each session to the list
                data.sessions.forEach(session => {
                    const topicItem = createTopicItem(
                        session.topic, 
                        session.id, 
                        session.created_at,
                        session.id === sessionId // Is this the active session?
                    );
                    topicsList.appendChild(topicItem);
                });
            } else {
                console.error('Failed to load sessions:', data.error);
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }

    // Function to load a session's messages
    async function loadSessionChat(clickedSessionId) {
        console.log(`Attempting to load session: ${clickedSessionId}`);
        if (clickedSessionId === sessionId) {
            console.log('Already on this session, not reloading');
            return; // Already loaded
        }
        
        showLoading();
        
        try {
            console.log(`Fetching messages for session ${clickedSessionId}`);
            const response = await fetch(`/api/sessions/${clickedSessionId}/messages/`);
            console.log(`Response status: ${response.status}`);
            
            if (response.status === 200) {
                const data = await response.json();
                console.log(`Successfully loaded session with ${data.messages.length} messages`);
                
                // Update the session ID
                sessionId = clickedSessionId;
                
                // Update the UI with session info
                currentTopicTitle.textContent = data.session.topic;
                proficiencyBadge.textContent = data.session.proficiency.charAt(0).toUpperCase() + 
                                            data.session.proficiency.slice(1);
                
                // Clear the chat container
                chatContainer.innerHTML = '';
                
                // Add all messages
                data.messages.forEach(msg => {
                    addMessage(msg.content, msg.is_user);
                    
                    // Update confidence if it's an AI message
                    if (!msg.is_user && msg.confidence_score !== null) {
                        updateConfidenceMeter(msg.confidence_score);
                    }
                });
                
                // Update topic list UI to reflect active session
                document.querySelectorAll('.topic-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Find and mark the clicked session as active
                const items = document.querySelectorAll('.topic-item');
                for (let i = 0; i < items.length; i++) {
                    if (items[i].querySelector('.topic-name').textContent === data.session.topic) {
                        items[i].classList.add('active');
                        break;
                    }
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to load session chat:', errorData.error);
            }
        } catch (error) {
            console.error('Error loading session chat:', error);
        } finally {
            hideLoading();
        }
    }

    // Add topic to history list
    function addTopicToHistory(topicName, sessionId, isActive = true) {
        // Instead of manually adding, now we'll just reload all sessions
        loadSessions();
    }

    // Initialize session
    async function initializeSession() {
        showLoading();
        
        try {
            const response = await fetch('/api/start_session/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    proficiency
                })
            });
            
            const data = await response.json();
            
            if (response.status === 200) {
                sessionId = data.session_id;
                console.log(`Session initialized with ID: ${sessionId}`);
                
                // Load sessions to update the sidebar
                loadSessions();
            } else {
                console.error('Failed to initialize session:', data.error);
                addMessage('Sorry, I had trouble starting our session. Please try again.', false);
            }
        } catch (error) {
            console.error('Error initializing session:', error);
            addMessage('Sorry, I had trouble connecting to the server. Please check your connection and try again.', false);
        } finally {
            hideLoading();
        }
    }

    // Send message to API
    async function sendMessage(message) {
        if (!sessionId) {
            console.error('No active session.');
            return;
        }
        
        showLoading();
        
        try {
            const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message,
                    hf_token: hfToken
                })
            });
            
            const data = await response.json();
            
            if (response.status === 200) {
                addMessage(data.response, false);
                updateConfidenceMeter(data.confidence_score);
            } else {
                console.error('Failed to send message:', data.error);
                addMessage('Sorry, I had trouble processing your message. Please try again.', false);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Fallback to direct API call if Django backend fails
            fallbackToDirectAPI(message);
        } finally {
            hideLoading();
        }
    }

    // Direct API call fallback (in case Django server fails)
    async function fallbackToDirectAPI(message) {
        try {
            console.log("Attempting direct API call to Hugging Face");
            
            // Create a prompt for the Hugging Face API
            const prompt = `
            You are an AI student learning from a human teacher about ${topic}.
            The human teacher has ${proficiency} knowledge about this topic.
            
            Your goal is to learn from them while asking insightful questions that help them reinforce their knowledge.
            
            If they explain something correctly, ask follow-up questions that help them elaborate further.
            
            If they explain something incorrectly, don't correct them directly, but ask strategic questions
            that help them realize their misunderstanding. For example, if they say plants use oxygen instead
            of CO2 for photosynthesis, ask "That's interesting - if plants use oxygen, what do they release
            during photosynthesis?"
            
            Human teacher: ${message}
            
            AI student:
            `;
            
            const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${hfToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true
                    }
                })
            });
            
            const data = await response.json();
            console.log("Received fallback API response");
            
            if (data && data[0] && data[0].generated_text) {
                // Extract just the AI response part
                const fullResponse = data[0].generated_text;
                const aiResponsePart = fullResponse.split('AI student:')[1]?.trim() || 
                                      "I'm having trouble processing that. Could you explain it again?";
                
                addMessage(aiResponsePart, false);
                
                // Simple confidence calculation for fallback mode
                const questionCount = (aiResponsePart.match(/\?/g) || []).length;
                const newConfidence = Math.min(confidenceScore + (questionCount > 0 ? 5 : -5), 100);
                updateConfidenceMeter(newConfidence);
            } else {
                addMessage("I'm sorry, I'm having trouble connecting to my knowledge base. Could we try again later?", false);
            }
        } catch (error) {
            console.error('Fallback API error:', error);
            addMessage("I'm sorry, there seems to be a connection issue. Please check your internet connection and try again.", false);
        }
    }

    // Handle form submission
    function handleSubmit() {
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Send to API
        sendMessage(message);
    }

    // Utility functions
    function showLoading() {
        loadingIndicator.classList.add('active');
    }
    
    function hideLoading() {
        loadingIndicator.classList.remove('active');
    }
    
    // Event listeners
    sendBtn.addEventListener('click', handleSubmit);
    
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });
    
    newTopicBtn.addEventListener('click', () => {
        // Redirect back to landing page
        window.location.href = '/';
    });
    
    // Initialize the session on page load
    initializeSession();
    
    // Set initial confidence
    updateConfidenceMeter(confidenceScore);

    // Load previous sessions
    loadSessions();
});