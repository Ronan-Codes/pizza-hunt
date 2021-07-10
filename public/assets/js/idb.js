// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt'(create or connect) and set it to version 1(determines if db structure has changed between connections)
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store(table) called 'new_pizza', set it to have an auto incrementing primary ker of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
    // ??? For that reason, when we create the new_pizza object store, we also instruct that store to have an auto incrementing index for each new set of data we insert. Otherwise we'd have a hard time retrieving data.
};

// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneeded event above) or simply established a connection, save a reference to db in global variable
    db = event.target.result;
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        
        // uploads the savedRecord data
        uploadPizza();
        // user's won't have to worry about staying in app. Leftover indexedDB data will upload when they return to app
    }
};
/* With this first event handler, onsuccess, we set it up so that when we finalize the 
connection to the database, we can store the resulting database object to the global variable 
db we created earlier. This event will also emit every time we interact with the database, so 
every time it runs we check to see if the app is connected to the internet network. If so, 
we'll execute the uploadPizza() function. But because we haven't created the function yet, 
we'll leave it commented out for now. */

request.onerror = function(event) {
    // log error here 
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there's no internet connection
// saveRecord() will be used in add-pizza.js file's form submission function if fetch() function's .catch() method is executed
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    
    // get all records from store and set to a variable 
    const getAll = pizzaObjectStore.getAll(); 
    // getAll() is async and needs event handler to retrieve data

    // upon a succesful .getAll() execution, run this function 
    getAll.onsuccess = function() {
        // if there was data in indexedDB's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, test/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
              .then(response => response.json())
              .then(serverResponse => {
                  if(serverResponse.message) {
                      throw new Error(serverResponse);
                  }
                //   open one more transaction to clear objectStore after upload
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store 
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted');
              })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

// // listen for app coming back online
window.addEventListener('online', uploadPizza);

// same as
// window.addEventListener('online', (event) => {
//     uploadPizza()
// });

