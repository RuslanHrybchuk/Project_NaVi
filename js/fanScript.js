let useLocalStorage = true;
let localCounter = 0;
let db = null;

if (!isOnline()) {
    if(useLocalStorage){
        if(checkLocalStorage()) {
            postFromLocal();
            setTimeout(2000);
            renderFromServer();
        }
    } else {
        if(initDB()){
            postFromIndexedDB();
            setTimeout(2000);
            renderFromServer();
        }
    }
} else {
    renderFromServer();
}

class StorageElement {
    constructor(name, email, subject, message, localCounter) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.localCounter = localCounter;
    }
}
  
class IndexedDbElement extends StorageElement {
    constructor(name, email, subject, message, localCounter) {
        super(name, email, subject, message, localCounter);
    }
}

function getFeedback() {

    let name = document.getElementById('contact_name');
    let email = document.getElementById('contact_email');
    let subject = document.getElementById('contact_subject');
    let message = document.getElementById('contact_message');

    alert('     Дякуємо за відгук! ^_^');

    if (isOnline()) {
        postToServer(name.value, email.value, subject.value, message.value);
        flushPage();
        setTimeout(2000);
        renderFromServer();
    } else {
        if(useLocalStorage){
            postToLocal(name.value, email.value, subject.value, message.value, localCounter);
            localCounter++;
        } else {
            let storedElement = new IndexedDbElement(name.value, email.value, subject.value, message.value, localCounter);   
            postToIndexedDB(storedElement);
            localCounter++;
        }
    }
    name.value = '';
    email.value = '';
    subject.value = '';
    message.value = '';
}

function postToLocal(name, email, subject, message, localCounter) {
    let storage = window.localStorage;

    storage.setItem(`name${localCounter}`, name);
    storage.setItem(`email${localCounter}`, email);
    storage.setItem(`subject${localCounter}`, subject);
    storage.setItem(`message${localCounter}`, message);
}

function postToServer(name, email, subject, message){
    
    let temp = JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
    });

        fetch('http://localhost:3000/fanPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: (temp)
      });
}



function renderFromServer(){
    $.ajax({
        url: "http://localhost:3000/fanPost",
        type: "GET",
        success: function(res) {
            for(i in res){
                postFeedback(res[i].name, res[i].email, res[i].subject, res[i].message);
            }
        }
      });
}

function postFeedback(name, email, subject, message) {
    const rootNode = document.getElementById('feedback');

    let container = document.createElement('div');
    container.classList.add('feedbackContainer');


    let nameBlock = document.createElement('div');
    nameBlock.classList.add('nameBlock');
    nameBlock.innerText = name;

    let dateNow = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }; // optional date fomat
    dateNow = dateNow.toLocaleDateString('en-US');

    let dateSpan = document.createElement('span');
    dateSpan.innerText = dateNow;
    dateSpan.classList.add('dateSpan');


    let br = document.createElement('br');

    nameBlock.appendChild(br);
    nameBlock.appendChild(dateSpan);


    let contentBlock = document.createElement('div');
    contentBlock.classList.add('contentBlock');

    let contentHeader = document.createElement('h3');
    contentHeader.classList.add('contentHeader');
    contentHeader.innerText = subject;

    let contentText = document.createElement('span');
    contentText.classList.add('contentText');
    contentText.innerText = message;
    
    contentBlock.appendChild(contentHeader);
    contentBlock.appendChild(contentText);

    container.appendChild(nameBlock);
    container.appendChild(contentBlock);
    rootNode.appendChild(container);
}

function flushPage(){
    $('.feedbackContainer').remove();
}


function postFromLocal() {
    let storage = window.localStorage;

    if (checkLocalStorage()) {
        for(let i = 0; i < localCounter; i++){
            let name = storage.getItem(`name${i}`);
            let email = storage.getItem(`email${i}`);
            let subject = storage.getItem(`subject${i}`);
            let message = storage.getItem(`message${i}`);

            postToServer(name, email, subject, message);
        }
    }

    clearLocalStorage();
}



function isOnline() {
    return window.navigator.onLine;
}

function handleConnectionChange(event){
    if(event.type == "offline") {
        alert("You lost connection.");
    }

    if(event.type == "online") {
        alert("You are now back online.");

        if(useLocalStorage){
            if(checkLocalStorage()) {
                setTimeout(7000);
                postFromLocal();
                setTimeout(2000);
                flushPage();
                renderFromServer();
            }
        } else {
                setTimeout(7000);
                postFromIndexedDB();
                setTimeout(2000);
                flushPage();
                renderFromServer();
        }
    }
}

function clearLocalStorage() {
    window.localStorage.clear();
}

window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);



function checkLocalStorage() {
    if ('name0' in window.localStorage) {
        return true;
    } else return false;
}

initDB();

function postToIndexedDB(storedElement) {
    let transaction = db.transaction("feedback", "readwrite");
    let feedback = transaction.objectStore("feedback");

    let feedData = {
        id: `${storedElement.localCounter+Date.now()}`,
        name: `${storedElement.name}`,
        email: `${storedElement.email}`,
        subject: `${storedElement.subject}`,
        message: `${storedElement.message}`,
    };

    feedback.add(feedData);
}

function postFromIndexedDB () {
    let transaction = db.transaction("feedback", "readonly");
    let feedback = transaction.objectStore("feedback");
    const request = feedback.openCursor();

    request.onsuccess = e => {
        const cursor = e.target.result;

        if(cursor) {
            postToServer(cursor.value.name, cursor.value.email, cursor.value.subject, cursor.value.message);
            cursor.continue();
        }
    }
    clearIndexedDB();
}

function clearIndexedDB(){
    let transaction = db.transaction("feedback", "readwrite");
    let feedback = transaction.objectStore("feedback");
    feedback.clear();
}

function initDB(){
    const request = indexedDB.open("myAwesomeDataBase");  // (dbName, dbVersion)

    // on upgrade needed
    request.onupgradeneeded = e => {
        db = e.target.result;

        const indexedDBfeedback = db.createObjectStore("feedback", {keyPath: "id"});

        alert('Upgrading...');
    }

    // on success      
    request.onsuccess = e => {
        db = request.result; 
    }

    // on error
    request.onerror = e => {
        alert('Error, Fucc you!');
    }

    return db;
}