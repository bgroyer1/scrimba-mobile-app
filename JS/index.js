//not sure what initalize app does still, but it gets the whole process started somehow?
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
//get database i vaguely understand, ref seems to be used to call to your database, push pushes things to database, and onValue lets you access the database?

//super important that this is an object with the key of databaseURL. spent a lot of time fixing this mistake. it links to my personal realtime database
const appSettings = {
    databaseURL: "https://realtime-database-5a417-default-rtdb.firebaseio.com/"
}

//storing a bunch of the stuff above to variables
//first uses the initalizeApp function and feeds it my appSettings variable, which contains my database. LInking them i guess?
const app = initializeApp(appSettings)
//take the above varaiable, use it in the imported getDatabase function
const database = getDatabase(app)
//i think this is what creates the labels in the database? this is what you push to, and tells you where to push it??
const shoppingListInDB = ref(database, "shoppingList")

//we moved the appendListItem function into the onValue function. I guess the function still displays the list item because we're pushing the value to the database?
//switched it to object.entries so i get both the key and value from the database and save it to an array
//pretty sure this is how i'll delete stuff?
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            //tried using Object.keys but forgot, the whole point of this is i'm switching it to an array. As we used entries above, we actually have
            //an array with subarrays, so [0] will be the key and [1] will be the value for each object
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendListItem(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = ""
    }
})

const addBtn = document.querySelector("#add-button")
const deleteBtn = document.querySelector("#delete-button")
const inputFld = document.querySelector("#input-field")
const shoppingListEl = document.querySelector("#shoppingListEl")

//make a habit of assigning things to variables, like i do with the .value here/ 
//push is what's adding the inputValue to the database.
addBtn.addEventListener("click", () => {
    let inputValue = inputFld.value 
    push(shoppingListInDB, inputValue)
    clearInputField()
})

//smaller functions with specific uses seem to be the ideal programming method! 
function clearInputField() {
    inputFld.value = ""
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}


//using the document.createElement to make the list item now
//the paramaeter item will be given the argument currentItem in the onValue function

function appendListItem(item) {
     let newEl = document.createElement("li")
     let itemID = item[0]
     let itemValue = item[1]
     newEl.textContent = `${itemValue}`
     newEl.addEventListener("click", () => {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
     })
     shoppingListEl.append(newEl)
}

