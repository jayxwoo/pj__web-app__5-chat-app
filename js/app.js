// ========== imports ==========
import './default.js';
import { Chatter } from './chat.js';
import { ChatUI } from './ui.js';

// ========== DOM references ==========
const chatForm = document.querySelector('.chat-form');
const usernameForm = document.querySelector('.username-form');
const chatroomBtnContainer = document.querySelector('.chatroom-btn-container');
const chatListGroup = document.querySelector('.chat-list-group');

// ========== global variables ==========
const col = 'chats';

// ========== script ==========
// main
const main = function () {
    let localUsername = localStorage.getItem('username');

    if (!localUsername) {
        localUsername = 'anonymous';
    }

    const chatter = new Chatter(col, localUsername, 'general');
    const chatUI = new ChatUI(chatListGroup, 'default');

    // get chats
    chatter.getChats((doc) => {
        // render chats
        chatUI.renderChats(doc);
    });

    // create & add chats
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // create chats
        const message = chatForm.chat.value.trim();

        if (message === '') {
            alert('Please enter your message!');
        } else {
            const newChats = chatter.createChats(message);
    
            // add chats
            chatter.addChats(newChats);
    
            // reset form
            chatForm.reset();
        };

    });

    // update username
    usernameForm.addEventListener('submit', e => {
        e.preventDefault();

        // get username
        const newUsername = usernameForm.username.value.trim();

        // update username
        chatter.updateUsername(newUsername);

        // store username in local storage
        localStorage.setItem('username', newUsername);

        // reset username form
        usernameForm.reset()
    });

    // update chatroom
    chatroomBtnContainer.addEventListener('click', e => {
        if (e.target.tagName === "BUTTON") {
            // remove all active indicator
            Array.from(chatroomBtnContainer.children).forEach(btn => {
                btn.classList.remove('chatroom-btn--active');
            });

            // add an indicator to the clicked chatroom
            e.target.classList.add('chatroom-btn--active');

            // update chatroom
            const newChatroom = e.target.id;
            chatter.updateChatroom(newChatroom);

            // remove current chat UI
            chatListGroup.innerHTML = '';

            // get chats
            chatter.getChats((data) => {
                chatUI.renderChats(data);
            });
        };
    });

    // delete chats
    chatListGroup.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-delete-btn')) {
            const id = e.target.parentElement.parentElement.getAttribute('id');

            // delete chats from database
            chatter.deleteChats(id);

            // delete chats from UI
            chatUI.deleteChats(id);
        };
    });
};
main();
