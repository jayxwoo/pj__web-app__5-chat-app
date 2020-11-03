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

        return newChats;
    }

    // // add chats
    // addChats = function (newChats) {
    //     firebase.firestore().collection(this.col).add(newChats).then(() => {
    //         console.log('A new chat has been added!');
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // }
}

// main
const main = function () {
    const chatter = new Chatter(col, chatForm, 'JM', 'general');
    
    // get chats
    chatter.getChats();

    // create & add chats
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // create chats
        const message = chatForm.chat.value.trim();
        const created_at = firebase.firestore.Timestamp.fromDate(new Date());
        const newChats = chatter.createChats(message, created_at);

        // add chats
        firebase.firestore().collection(col).add(newChats);

        // reset form
        chatForm.reset();
    });
};
main();
