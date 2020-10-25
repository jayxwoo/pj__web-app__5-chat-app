// ========== imports ==========
import './default.js';

// ========== DOM references ==========


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


// main
const main = function () {
    // get chats
    const chatGetter = new ChatGetter(col);
    chatGetter.get();
};
main();
