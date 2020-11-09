// Chatter
export class Chatter {
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