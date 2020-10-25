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

        // get input value
        const chatInput = chatForm.chat.value.trim();
        console.log(chatInput);

        chatForm.reset();
    });
};
main();
