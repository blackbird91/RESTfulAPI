var $ = function (selector, parent) {
    return (parent ? parent : document).querySelector(selector);
};
// Get all matching elements
var $$ = function (selector, parent) {
    return (parent ? parent : document).querySelectorAll(selector);
};

// here we will add all user input data
let postData = {}

const url = '/shield/add';
const user = 'decryptr';

$('#post-item').addEventListener('submit', (event) => {
    event.preventDefault();

    // here we are adding the data
    postData.user = user;
    postData.title = $('#title').value;
    postData.image = $('#image').value;
    postData.description = $('#description').value;
    postData.tags = 'tag1, tag5';
    postData.type = $('#type').value;

    let strPostData = JSON.stringify(postData);

    fetch(url, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: strPostData
    }).then(response => {
        return response.json();
    }).then(returnedData => {
        getItems();
        $('#post-item').style.display = 'none';
    })
});

class HTML {
    insertHTML(data) {return `
        <article class="card item">
            <header class="card__header">
                <h1 class="item_title" id="item_title">${data.title}</h1>
                <h1 class="item_description" id="item_description">${data.description}</h1>
            </header>
            <h1 class="item_tags" id="item_tags">${data.tags}</h1>
            <div class="proposal_footer">
                <h1 class="item_votes" id="item_votes">${data.votes}</h1>
                <h1 class="item_date" id="item_date">${data.date}</h1>
            </div>
        </article>
        `;
    }
}

// for (var key in json) {
//     if (json.hasOwnProperty(key)) {
//       alert(json[key].id);
//       alert(json[key].msg);
//     }
//     }

const getItems = () => {
    fetch('/shield')
    .then(response => {
        return response.json();
    })
    .then(data => {
        $('#items').innerHTML = '';
        data.forEach(item =>{
            console.log(item)
            const html = new HTML;
            $('#items').innerHTML += html.insertHTML(item);
        })
    });
}

getItems();



// add function
$('#add').addEventListener('click', (event) => {
    $('#post-item').style.display = 'block';
});