let useLocalStorage = true;
let localCounter = 0;
let db = null;

class StorageElement {
    constructor(name, subject, message, localCounter) {
        this.name = name;
        this.subject = subject;
        this.message = message;
        this.localCounter = localCounter;
    }
}
  
class IndexedDbElement extends StorageElement {
    constructor(name, subject, message, localCounter) {
        super(name, subject, message, localCounter);
    }
}

function getFeedback() {

    let name = document.getElementById('contact_name');
    let subject = document.getElementById('contact_subject');
    let message = document.getElementById('contact_message');

    alert('     Новину надіслано!');

    if (isOnline()) {
        postToServer(name.value, subject.value, message.value);
    } else {
        if(useLocalStorage){
            postToLocal(name.value, subject.value, message.value, localCounter);
            localCounter++;
        } else {
            let storedElement = new IndexedDbElement(name.value, subject.value, message.value, localCounter);   
            postToIndexedDB(storedElement);
            localCounter++;
        }
    }
    name.value = '';
    subject.value = '';
    message.value = '';
}

function postToLocal(name, subject, message, localCounter) {
    let storage = window.localStorage;

    storage.setItem(`NewsName${localCounter}`, name);
    storage.setItem(`NewsSubject${localCounter}`, subject);
    storage.setItem(`NewsMessage${localCounter}`, message);
}

function postToServer(name, subject, message){
    
    let temp = JSON.stringify({
        name: name,
        subject: subject,
        message: message
    });

        fetch('http://localhost:3000/newsPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: temp
      });
}


function postFromLocal() {
    let storage = window.localStorage;

    if (checkLocalStorage()) {
        for(let i = 0; i < localCounter; i++){
            let name = storage.getItem(`NewsName${i}`);
            let subject = storage.getItem(`NewsSubject${i}`);
            let message = storage.getItem(`NewsMessage${i}`);

            postToServer(name, subject, message);
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
                postFromLocal();
            }
        } else {
                postFromIndexedDB();
        }
    }
}

function clearLocalStorage() {
    window.localStorage.clear();
}

window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);



function checkLocalStorage() {
    if ('NewsName0' in window.localStorage) {
        return true;
    } else return false;
}

initDB();

function postToIndexedDB(storedElement) {
    let transaction = db.transaction("news", "readwrite");
    let feedback = transaction.objectStore("news");

    let feedData = {
        id: `${storedElement.localCounter+Date.now()}`,
        name: `${storedElement.name}`,
        subject: `${storedElement.subject}`,
        message: `${storedElement.message}`,
    };

    feedback.add(feedData);
}

function postFromIndexedDB () {
    let transaction = db.transaction("news", "readonly");
    let feedback = transaction.objectStore("news");
    const request = feedback.openCursor();

    request.onsuccess = e => {
        const cursor = e.target.result;

        if(cursor) {
            postToServer(cursor.value.name, cursor.value.subject, cursor.value.message);
            cursor.continue();
        }
    }
    clearIndexedDB();
}

function clearIndexedDB(){
    let transaction = db.transaction("news", "readwrite");
    let feedback = transaction.objectStore("news");
    feedback.clear();
}

function initDB(){
    const request = indexedDB.open("myAwesomeNewsDataBase");  // (dbName, dbVersion)

    // on upgrade needed
    request.onupgradeneeded = e => {
        db = e.target.result;

        const indexedDBnews = db.createObjectStore("news", {keyPath: "id"});

        alert('Upgrading...');
    }

    // on success      
    request.onsuccess = e => {
        db = request.result; 
    }

    // on error
    request.onerror = e => {
        alert('IndexeDB init error');
    }

    return db;
}