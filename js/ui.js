// ChatUI
export class ChatUI {
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