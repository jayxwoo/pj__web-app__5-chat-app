// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const chatForm = document.querySelector('.chat-form');
const usernameForm = document.querySelector('.username-form');

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
        console.log(`Username is updated to '${this.username}'`);
    }
}

// main
const main = function () {
    const chatter = new Chatter(col, 'JM', 'general');
    
    // get chats
    chatter.getChats();

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
};
main();
