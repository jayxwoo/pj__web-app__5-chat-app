// ========== imports ==========
import './default.js';

// ========== DOM references ==========
const chatForm = document.querySelector('.chat-form');

// ========== global variables ==========
const col = 'chats';

// ========== script ==========
// get chats
class ChatGetter {
    constructor(col) {
        this.col = col;
    }

    get = async function () {
        // a real-time listener; onSnapshot
        firebase.firestore().collection(this.col).orderBy('created_at').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(docChange => {
                console.log(docChange.doc.data());
            });
        });
    }
}

// create chats
class ChatCreator {
    constructor(chatForm) {
        this.chatInput = chatForm.chat.value.trim();
        this.created_at = new Date();
        this.username = 'JM'; // update later
        this.chatroom = 'general'; // update later
    }

    create = function () {
        console.log(this.chatInput, this.created_at);
    }
}


// add chats
class ChatAdder {
    constructor(col) {
        this.col = col;
    }
}


// main
const main = function () {
    // get chats
    const chatGetter = new ChatGetter(col);
    chatGetter.get();

    // add chats
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // create
        const chatCreator = new ChatCreator(chatForm);
        chatCreator.create();

        // add

        chatForm.reset();
    });
};
main();
