import { $, $$ } from '/js/selectors.js';
import { formatDate } from '/js/date-formatting.js';

// here we will add all user input data
let postData = {}
let isEditing = false
let fetchedItems = new Object();

const user = 'decryptr';

const url = 'http://127.0.0.1:3333';
let fetchURL = url + '/items';

$('#add').addEventListener('click', (event) => {
    $('#post-item-container').style.display = 'flex';
    $('#close').style.display = 'block';
});

$('#close').addEventListener('click', (event) => {
    $('#post-item-container').style.display = 'none';
});

// Add items to the data array in items.json
$('#post-item').addEventListener('submit', (event) => {
    event.preventDefault();
    // If the user is NOT editing, this will check to make sure that there is NOT an
    // already existing item in the items.json file
    if (!isEditing) {
        fetch(url + '/items')
            .then(response => {
                return response.json()
            })
            .then(itemData => {
                itemData.forEach(item => {
                    if ($('#title').value === item.title) {
                        return new Error('Item already exists!')
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })


        // postData object gets filled with correct input information
        postData.user = user;
        postData.title = $('#title').value;
        postData.image = $('#image').value;
        postData.description = $('#description').value;
        postData.tags = 'tag1, tag5';
        postData.type = $('input[name="type"]:checked').value;

        let strPostData = JSON.stringify(postData);

        // Sends post request to /post with all input information
        fetch(url + '/post', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: strPostData
        }).then(response => {
            return response.json();
        }).then(returnedData => {
            if (returnedData.status === 200) {
                // Gets and displays all items in the items.json file (including the new one just made)
                getItems();

                // Hides the form to add an item
                $('#post-item-container').style.display = 'none';
                $('.close').style.display = 'none';
            }

        })
    }
});

// HTML item display template that is used when getItems is called
class HTML {
    insertHTML(data) {
        const tags = data.tags.split(" ");

        let linkTags = '';

        tags.forEach(item => {
            linkTags += '<a class="tag" href="' + url + '/?tag=' + item + '">#' + item + '</a>';
        });

        return `
        <article class="item id="${data.title}">
            <div class="flex">
                <a class="image-anchor" href="${data.image}" target="_blank"><img class="image" src="/img/love-technology.jpg" alt="${data.title}"></a>

                <div class="content">
                    <span class="${data.type} item-type">${data.type}</span>
                                        <span class="user_info">
                        [ avatar ] @username | <span class="date" id="date">` + formatDate(data.date) + `</span>
                    </span>
                    <a href=""><h2 class="title">${data.title}</h2></a>

                    <p class="description">${data.description}</p>
                    <div class="tags"><b>Tags:</b> ${linkTags}</div>
                </div>

                <div class="stats">
                    <span class="votes" id="votes">${data.votes}</span>

                    <button id="${data.title}" class="edit"></button>
                    <button id="${data.title}" class="delete"></button>
                </div>
            </div>
        </article>
        `;
    }
}

// // function to get all items from items.json file
const getItems = () => {
    // Fetches all data from items.json
    fetch(fetchURL)
        .then(response => {
            return response.json();
        })
        .then(data => {
            fetchedItems = data;

            //Takes data from files and calls the HTML template to display the data
            $('#items').innerHTML = '';
            data.forEach(item => {
                const html = new HTML;
                $('#items').innerHTML += html.insertHTML(item);

                // EDIT FUNCTIONALITY
                $$('.edit').forEach(element => {
                    element.addEventListener('click', (event) => {
                        isEditing = true
                        $('#post-item').style.display = 'block'
                        // get the id (title) of the clicked item
                        element.id = event.target.id;
                        editItems(element.id)
                    });
                });
                $$('.delete').forEach(element => {
                    element.addEventListener('click', (event) => {
                        // get the id (title) of the clicked item
                        element.id = event.target.id;
                        deleteItem(element.id)
                    });
                });
            });
        });
}

getItems();

const editItems = (elementId) => {
    // Fetch all data once you have the correct item

    // Find the item in the data
    let correctItem = fetchedItems.find(item => item.title === elementId)
    // Grab the edited input fields from the user
    correctItem.title = $('#title').value;
    correctItem.description = $('#description').value;
    correctItem.type = $('input[name="type"]:checked').value;
    if (isEditing) {
        // Listen for a edit-item submit event
        $('.edit-item').addEventListener('submit', (event) => {
            // Change the edited items values 
            correctItem.id = elementId;
            correctItem.title = $('#title').value;
            correctItem.image = $('#image').value;
            correctItem.description = $('#description').value;
            correctItem.type = $('#type').value;

            let strEditedItem = JSON.stringify(correctItem)
            // Send a post request to /edit with the correct/updated data
            fetch(url + '/edit', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: strEditedItem
            }).then(response => {
                return response.json();
            })
                .then(data => {
                    console.log(data.status === 200);
                })
                .catch(err => {
                    console.log('editItem error', err);
                })
        });
    }
}

const deleteItem = (itemTitle) => {
    // Fetches all data from items.json
    const correctItem = fetchedItems.find(item => item.title === itemTitle);
    let strCorrectItem = JSON.stringify(correctItem);
    fetch(url + '/delete', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: strCorrectItem
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.status === 200) {
                getItems()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// HANDLING IMAGE UPLOAD

// $('#post-item').addEventListener('change', (e) => {
//     let theFile = e.target.files[0];

//     if (checkFileProperties(theFile)) {
//         handleUploadedFile(theFile);
//     }

// });

// function checkFileProperties(theFile) {
//     if (theFile.type !== "image/png" && theFile.type !== "image/jpeg") {
//         console.log('File type mismatch');
//         return false;
//     }

//     if (theFile.size > 500000) {
//         console.log('File too large');
//         return false;
//     }

//     return true;

// }

// function handleUploadedFile(file) {
//     $('#image-label').innerHTML = '';
//     fileName = file.name;
//     var img = document.createElement("img");
//     img.setAttribute('id', 'theImageTag');
//     img.file = file;
//     $('#image-label').appendChild(img);

//     var reader = new FileReader();
//     reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
//     reader.readAsDataURL(file);
// }