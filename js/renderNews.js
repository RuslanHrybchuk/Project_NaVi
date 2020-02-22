if (isOnline()) {
    getNewsFromServer();
}


function postNews(name, subject, message) {
    const rootNode = document.getElementById('content');

    let container = document.createElement('div');
    container.classList.add('newsContainer');


    let contentHeader = document.createElement('h3');
    contentHeader.classList.add('newsContentHeader');
    contentHeader.innerText = subject;

    let contentText = document.createElement('div');
    contentText.classList.add('newsContentText');
    contentText.innerText = message;
    
    container.appendChild(contentHeader);
    container.appendChild(contentText);


    let bottomDiv = document.createElement('div');
    bottomDiv.classList.add('bottomDiv');


    let nameBlock = document.createElement('span');
    nameBlock.classList.add('newsNameBlock');
    nameBlock.innerText = name;

    let dateNow = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }; // optional date fomat
    dateNow = dateNow.toLocaleDateString('en-US');

    let dateSpan = document.createElement('span');
    dateSpan.innerText = dateNow;
    dateSpan.classList.add('newsDateSpan');

    bottomDiv.appendChild(nameBlock);
    bottomDiv.appendChild(dateSpan);

    container.appendChild(bottomDiv);

    rootNode.appendChild(container);
}


function isOnline() {
    return window.navigator.onLine;
}

function getNewsFromServer() {

    $.ajax({
        url: "http://localhost:3000/newsPost",
        type: "GET",
        success: function(res) {
            for(let i = res.length-1; i > -1; i--){
                postNews(res[i].name, res[i].subject, res[i].message);
            }
        }
      });
}