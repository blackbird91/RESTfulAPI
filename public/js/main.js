// const Item = require('../../models/items')

var $ = function (selector, parent) {
    return (parent ? parent : document).querySelector(selector);
};
// Get all matching elements
var $$ = function (selector, parent) {
    return (parent ? parent : document).querySelectorAll(selector);
};

// here we will add all user input data
let postData = {}
let isEditing = false

const user = 'decryptr';

$('#post-item').addEventListener('submit', (event) => {
    if (!isEditing){
        fetch('/shield')
            .then(response => {
                return response.json()
            })
            .then(itemData => {
                itemData.forEach(item => {
                    if ($('#title').value === item.title){
                        return new Error('Item already exists!')
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
        


        event.preventDefault();
        // here we are adding the data
        postData.user = user;
        postData.title = $('#title').value;
        postData.image = $('#image').value;
        postData.description = $('#description').value;
        postData.tags = 'tag1, tag5';
        postData.type = $('#type').value;

        let strPostData = JSON.stringify(postData);

        fetch('/shield/add', {
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
    }
});

class HTML {
    insertHTML(data) {return `
        <article class="card item">
            <header class="card__header">
                <h1 class="item_title" id="item_title">${data.title}</h1>
                <h2 class="item_description" id="item_description">${data.description}</h2>
            </header>
            <p class="item_tags" id="item_tags">${data.tags}</p>
            <div class="item_footer">
                <h3 class="item_votes" id="item_votes">${data.votes}</h3>
                <h3 class="item_date" id="item_date">${data.date}</h3>
            </div>
                <button id="${data.title}" class="edit">Edit</button>
                <button id="delete">Delete</button>
        </article>
        `;
    }
}

const getItems = () => {
    fetch('/shield')
    .then(response => {
        return response.json();
    })
    .then(data => {
        $('#items').innerHTML = '';
        data.forEach(item =>{
            const html = new HTML;
            $('#items').innerHTML += html.insertHTML(item);

            $$('.edit').forEach(element => {
                element.addEventListener('click', (event) => {
                    isEditing = true
                    $('#post-item').style.display = 'block'
                    element.id = event.target.id;
                    fetch('/shield')
                        .then(response => {
                            return response.json()
                        })
                        .then(data => {
                            let correctItem = data.find(item => item.title === element.id)
                            $('#title').value = correctItem.title
                            $('#description').value = correctItem.description
                            $('#type').value = correctItem.type
                            if (isEditing){
                                $('.edit-item').addEventListener('submit', (event) => {
                                    correctItem.id = element.id
                                    correctItem.title = $('#title').value
                                    correctItem.image = $('#image').value
                                    correctItem.description = $('#description').value
                                    correctItem.type = $('#type').value

                                    let strEditedItem = JSON.stringify(correctItem)

                                    fetch('/shield/edit', {
                                        method: "POST",
                                        headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                        },
                                        body: strEditedItem
                                    }).then(response => {
                                        return response.json()
                                    }).then(data => {
                                        console.log(data)
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                })
                            }
                        })
                });
            });
        });
    });
}
getItems();


// add function
$('#add').addEventListener('click', (event) => {
    $('#post-item').style.display = 'block';
});
