// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const chatForm = document.querySelector('.chat-form');
const usernameForm = document.querySelector('.username-form');
const chatroomBtnContainer = document.querySelector('.chatroom-btn-container');
const chatListGroup = document.querySelector('.chat-list-group');

// ========== global variables ==========
const col = 'chats';

// ========== script ==========
// Chatter
class Chatter {
    constructor(col, username, chatroom) {
        this.col = col;
        this.username = username;
        this.chatroom = chatroom;
    }

    // get chats
    getChats = async function (callback) {
        // a real-time listener; onSnapshot
        firebase.firestore().collection(this.col).where('chatroom', '==', this.chatroom).orderBy('created_at').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(docChange => {
                if (docChange.type === 'added') {
                    callback(docChange.doc.data());
                };
            });
        });
    }

    // create chats
    createChats = function (message) {
        const created_at = new Date();

        const newChats = {
            message : message,
            created_at : created_at,
            username : this.username,
            chatroom : this.chatroom
        };

        return newChats;
    }

    // add chats
    addChats = function (newChats) {
        firebase.firestore().collection(this.col).add(newChats).then(() => {
            console.log('A new chat has been added!');
        }).catch((err) => {
            console.log(err);
        });
    }

    // update username
    updateUsername = function (newUsername) {
        this.username = newUsername;
        console.log(`Username is updated to '${this.username}'!`);
    }

    // update chatroom
    updateChatroom = function (newChatroom) {
        this.chatroom = newChatroom;
        console.log(`Chatroom is updated to '${this.chatroom}'!`);
    }
}

// ChatUI
class ChatUI {
    constructor(chatListGroup) {
        this.chatListGroup = chatListGroup;
    }

    // render
    render = function (data) {
        const html = `
        <li class="chat-list-item">
            <span class="chat-username">${data.username}</span>
            <span class="chat-text">${data.message} <span class="chat-time">${data.created_at.toDate().toLocaleString()}</span></span>
        </li>`;
        
        this.chatListGroup.innerHTML += html;
    }
}

// main
const main = function () {
    const chatter = new Chatter(col, 'default', 'general');
    const chatUI = new ChatUI(chatListGroup, 'default');
    
    // get chats
    chatter.getChats((data) => {
        chatUI.render(data);
    });

    // create & add chats
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // create chats
        const message = chatForm.chat.value.trim();
        const newChats = chatter.createChats(message);

        // add chats
        chatter.addChats(newChats);

        // reset form
        chatForm.reset();
    });

    // update username
    usernameForm.addEventListener('submit', e => {
        e.preventDefault();

        // get username
        const newUsername = usernameForm.username.value.trim();
        
        // update username
        chatter.updateUsername(newUsername);
    });

    // update chatroom
    chatroomBtnContainer.addEventListener('click', e => {
        // remove all active indicator
        Array.from(chatroomBtnContainer.children).forEach(btn => {
            btn.classList.remove('chatroom-btn--active');
        });

        // add an indicator to the clicked chatroom
        e.target.classList.add('chatroom-btn--active');

        // update chatroom
        const newChatroom = e.target.id;
        chatter.updateChatroom(newChatroom);

        // get chats
        chatter.getChats((data) => {
            chatUI.render(data);
        });
    });
};
main();
