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

// Add items to the data array in items.json
$('#post-item').addEventListener('submit', (event) => {
    // If the user is NOT editing, this will check to make sure that there is NOT an
    // already existing item in the items.json file
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
        // postData object gets filled with correct input information
        postData.user = user;
        postData.title = $('#title').value;
        postData.image = $('#image').value;
        postData.description = $('#description').value;
        postData.tags = 'tag1, tag5';
        postData.type = $('#type').value;

        let strPostData = JSON.stringify(postData);
        
        // Sends post request to /shield/add with all input information
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
            if (returnedData.status === 200){
                // Gets and displays all items in the items.json file (including the new one just made)
                getItems();

                // Hides the form to add an item
                $('#post-item').style.display = 'none';
            }

        })
    }
});

// HTML item display template that is used when getItems is called
class HTML {
    insertHTML(data) {return `
        <article class="card item id="${data.title}"">
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
                <button id="${data.title}" class="delete">Delete</button>
        </article>
        `;
    }
}

// function to get all items from items.json file
const getItems = () => {
    // Fetches all data from items.json
    fetch('/shield')
    .then(response => {
        return response.json();
    })
    .then(data => {
        // Takes data from files and calls the HTML template to display the data
        $('#items').innerHTML = '';
        data.forEach(item =>{
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
getItems()

const editItems = (elementId) => {
    // Fetch all data once you have the correct item
    fetch('/shield')
        .then(response => {
            return response.json()
        })
        .then(data => {
            // Find the item in the data
            let correctItem = data.find(item => item.title === elementId)
            // Grab the edited input fields from the user
            $('#title').value = correctItem.title
            $('#description').value = correctItem.description
            $('#type').value = correctItem.type
            if (isEditing){
                // Listen for a edit-item submit event
                $('.edit-item').addEventListener('submit', (event) => {
                    // Change the edited items values 
                    correctItem.id = elementId
                    correctItem.title = $('#title').value
                    correctItem.image = $('#image').value
                    correctItem.description = $('#description').value
                    correctItem.type = $('#type').value

                    let strEditedItem = JSON.stringify(correctItem)
                    // Send a post request to /shield/edit with the correct/updated data
                    fetch('/shield/edit', {
                        method: "POST",
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: strEditedItem
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        console.log(data.status === 200)
                    })
                    .catch(err => {
                        console.log('editItem error', err)
                    })
                })
            }
        })
}

const deleteItem = (itemTitle) => {
    // Fetches all data from items.json
    fetch('/shield')
        .then(response => {
            return response.json()
        })
        .then(data => {
            const correctItem = data.find(item => item.title === itemTitle)
            let strCorrectItem = JSON.stringify(correctItem)
            fetch('/shield/delete', {
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
                if (data.status === 200){
                    getItems()
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
        // DELETE FUNCTIONALITY
        // $$('.delete').forEach(element => {
        //     console.log(element)
        //     element.addEventListener('click', (event) => {
        //         // get the id (title) of the clicked item
        //         element.id = event.target.id;
        //         // Fetch all data once you have the correct item
        //         fetch('/shield')
        //             .then(response => {
        //                 return response.json()
        //             })
        //             .then(data => {
        //                 // Find the item in the data
        //                 let correctItem = data.find(item => item.title === element.id)
        //                 let strCorrectItem = JSON.stringify(correctItem)
        //                 let correctItemIndex = data.indexOf(correctItem)
        //                 fetch('/shield/delete', {
        //                 method: "delete",
        //                 headers: {
        //                     'Accept': 'application/json',
        //                     'Content-Type': 'application/json'
        //                 },
        //                 body: strCorrectItem
        //                 }).then(response => {
        //                     return response.json()
        //                 }).then(data => {
        //                     if (data.status === 200){
        //                         console.log($('#' + data.correctItem.title))
        //                     }
        //                 }).catch(err => {
        //                     console.log(err)
        //                 })
        //             })
        //     });
        // });
}

// add function
$('#add').addEventListener('click', (event) => {
    $('#post-item').style.display = 'block';
});