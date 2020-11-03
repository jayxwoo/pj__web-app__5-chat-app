// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const chatForm = document.querySelector('.chat-form');

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
    getChats = async function () {
        // a real-time listener; onSnapshot
        firebase.firestore().collection(this.col).orderBy('created_at').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(docChange => {
                console.log(docChange.doc.data());
            });
        });
    }

    // create chats
    createChats = function (message, created_at) {
        const newChats = {
            message : message,
            created_at : created_at,
            username : this.username,
            chatroom : this.chatroom
        };

        console.log(newChats);
    }
}

// main
const main = function () {
    const chatter = new Chatter(col, chatForm, 'JM', 'general');
    
    // get chats
    chatter.getChats();

    // create & add chats
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // create
        const message = chatForm.chat.value.trim();
        const created_at = new Date();
        chatter.createChats(message, created_at);

        // reset form
        chatForm.reset();
    });
};
main();
