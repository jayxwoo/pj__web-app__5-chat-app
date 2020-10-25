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
        // get collection
        const col = await firebase.firestore().collection(this.col).get();
        console.log(col);

        // get document
        const docs = col.docs;
        console.log(docs);

        // get properties
        docs.forEach(doc => { 
            console.log(doc.data());
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
