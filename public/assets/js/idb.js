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
        // we haven't created this yet, byt will soon, comment out for now
        // uploadPizza();
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
