import { $, $$ } from '/js/selectors.js';
import { HTML } from '/js/item-template.js';
import { user } from '/js/proton.js';
import { url } from '/js/proton.js';
import { makeChart } from '/js/chart.js';

// here we will add all user input data
let postData = {}
let isEditing = false;
let fetchedItems = new Object();
let postType;
let pollOptions = []


let fetchURL = url + '/items';

$('#add').addEventListener('click', (event) => {
    $('#post-item-container').style.display = 'flex';
    $('#close').style.display = 'block';
    $('body').style.overflow = 'hidden';
});

$('#close').addEventListener('click', (event) => {
    $('#post-item-container').style.display = 'none';
    $('body').style.overflow = '';
});

$('#add_option').addEventListener('click', (event) => {
    event.preventDefault();
    if ($$('.voteInput').length < 9) {
        $('.options').innerHTML += '<input class="voteInput" type="text" required />';
        $('#remove_option').style = 'display: inline-block !important';
    } else { alert('Maximum number of options is 9.') }
});

$('#remove_option').addEventListener('click', (event) => {
    event.preventDefault();
    if ($$('.voteInput').length === 3) {
        $('.voteInput:last-of-type').remove();
        event.target.style = 'display: none !important';
    }
    if ($$('.voteInput').length > 2) {
        $('.voteInput:last-of-type').remove();
    }
});

$$('.vote-btn').forEach(el => {
    el.addEventListener('click', (e) => {
        console.log('I am in!'); //////////////// Not working? possibly because the buttons are dynamically generate, move this into a function and call it in template JS
        let obj = {}
        obj.id = parseInt(e.target.id);
        obj.vote = $('#post-' + obj.id + ' input[name="post' + obj.id + 'options"]:checked').value;
        const stringifiedObj = JSON.stringify(obj);

        fetch(url + '/vote', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringifiedObj
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log('Voted for option ' + obj.id)
        })
    });
});

$('#post-item').addEventListener('change', (event) => {
    postType = $('input[name="type"]:checked').value;
    pollOptions = [];
    $$('.voteInput').forEach((el, i) => {
        pollOptions.push(el.value);
    });
    if ($('input[name="type"]:checked').value === 'poll') {
        $('#description-container').style.display = 'none';
        $('#description').required = false;
        $('.options').style = '';
        $('#add-remove-inputs').style = 'display: block';
        $$('.voteInput').forEach((el, i) => {
            el.required = true;
        });
    } else {
        $('#description-container').style.display = 'block';
        $('#description').required = true;
        $('.options').style = 'display: none';
        $('#add-remove-inputs').style = '';
        $$('.voteInput').forEach((el, i) => {
            el.required = false;
        });
    }

    let theFile = event.target.files[0];
    console.log(theFile);

    // if (checkFileProperties(theFile)) {
    //     handleUploadedFile(theFile);
    // }
});

// Add items to the data array in items.json
$('#post-item').addEventListener('submit', (event) => {
    event.preventDefault();
    postData = {}
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

        // get the number of options added and push 0 for each of them to the votes array
        let votes = [];
        const voteInputsNr = $$('.voteInput').length;
        for (let i = 0; i < voteInputsNr; i++) {
            votes.push(0);
        }

        // postData object gets filled with correct input information
        postData.user = user;
        postData.title = $('#title').value;
        postData.image = $('#image').value;
        postData.description = $('#description').value;
        postType === 'poll' ? postData.options = pollOptions : null;
        postData.tags = 'tag1, tag5';
        postData.type = $('input[name="type"]:checked').value;
        postData.votes = votes;
        console.log(votes);
        console.log(postData);
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
                $('#close').style.display = 'none';
                $('body').style.overflow = '';
            }

        });
    }
});


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
                makeChart(data);

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

const vote = () => {
    $$('#voting input').forEach(element => {
        element.addEventListener('click', (event) => {
            console.log(event.target)
        });
    });
}

vote();

// const editItems = (elementId) => {
//     // Fetch all data once you have the correct item

//     // Find the item in the data
//     let correctItem = fetchedItems.find(item => item.title === elementId)
//     // Grab the edited input fields from the user
//     correctItem.title = $('#title').value;
//     correctItem.description = $('#description').value;
//     correctItem.type = $('input[name="type"]:checked').value;
//     if (isEditing) {
//         // Listen for a edit-item submit event
//         $('.edit-item').addEventListener('submit', (event) => {
//             // Change the edited items values 
//             correctItem.id = elementId;
//             correctItem.title = $('#title').value;
//             correctItem.image = $('#image').value;
//             correctItem.description = $('#description').value;
//             correctItem.type = $('#type').value;

//             let strEditedItem = JSON.stringify(correctItem)
//             // Send a post request to /edit with the correct/updated data
//             fetch(url + '/edit', {
//                 method: "POST",
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: strEditedItem
//             }).then(response => {
//                 return response.json();
//             })
//                 .then(data => {
//                     console.log(data.status === 200);
//                 })
//                 .catch(err => {
//                     console.log('editItem error', err);
//                 })
//         });
//     }
// }

const deleteItem = (itemTitle) => {
    // Fetches all data from items.json
    const promptString = prompt('Are you sure you want to delete this post?', 'YES');
    if (promptString != null && promptString === 'YES') {
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
    } else {

    }
}

// HANDLING IMAGE UPLOAD


function checkFileProperties(theFile) {
    if (theFile.type !== "image/png" && theFile.type !== "image/jpeg") {
        console.log('File type mismatch');
        return false;
    }

    if (theFile.size > 500000) {
        console.log('File too large');
        return false;
    }

    return true;

}

function handleUploadedFile(file) {
    $('#image-label').innerHTML = '';
    fileName = file.name;
    var img = document.createElement("img");
    img.setAttribute('id', 'theImageTag');
    img.file = file;
    $('#image-label').appendChild(img);

    var reader = new FileReader();
    reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

