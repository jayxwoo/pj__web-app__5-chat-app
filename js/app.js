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
        this.unsub;
    }

    // get chats
    getChats = async function (callback) {
        // a real-time listener; onSnapshot
        this.unsub = firebase.firestore().collection(this.col).where('chatroom', '==', this.chatroom).orderBy('created_at').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(docChange => {
                if (docChange.type === 'added') {
                    callback(docChange.doc);
                };
            });
        });
    }

    // create chats
    createChats = function (message) {
        const created_at = new Date();

        const newChats = {
            message: message,
            created_at: created_at,
            username: this.username,
            chatroom: this.chatroom
        };

        return newChats;
    }

    // add chats
    addChats = async function (newChats) {
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
        this.unsub();
    }

    // delete chats
    deleteChats = async function (id) {
        firebase.firestore().collection(this.col).doc(id).delete().then(() => {
            console.log('Chat is deleted!');
        }).catch((err) => {
            console.log(err);
        });
    }
}   

// ChatUI
class ChatUI {
    constructor(chatListGroup) {
        this.chatListGroup = chatListGroup;
    }

    // render chats
    renderChats = function (doc) {
        // render
        const html = `
        <li class="chat-list-item" id="${doc.id}">
            <span class="chat-username">${doc.data().username}</span>
            <span class="chat-text">${doc.data().message} <span class="chat-time">${dateFns.distanceInWordsToNow(doc.data().created_at.toDate(), {addSuffix: true})}</span><i class="fas fa-times-circle chat-delete-btn" role="button" aria-label="delete button"></i></span>
        </li>`;

        this.chatListGroup.innerHTML += html;

        // scroll to the last chat
        this.chatListGroup.lastChild.scrollIntoView();
    }

    // deleteChats
    deleteChats = function (id) {
        Array.from(this.chatListGroup.children).forEach(chat => {
            if (chat.getAttribute('id') === id) {
                chat.remove();
            };
        });
    }
}

// main
const main = function () {
    const chatter = new Chatter(col, 'default', 'general');
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
