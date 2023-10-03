let index = 0

class Book {
    constructor(name = 'Unknown',
                readPages = 0,
                numberOfPages = 0,
                author = 'Unknown',
                isRead = false,
                imageLink = 'assets/fallback_image.jpg') {
        this.name = name
        this.numberOfReadPages = readPages
        this.totalNumberOfPages = numberOfPages
        this.author = author
        this.isRead = isRead
        this.imageLink = imageLink
    }

}

class Library {
    constructor() {
        // Initialize an empty array called 'books' as a property of the Library object
        this.books = []

        // Check if there is data stored in the browser's localStorage with the key 'libraryData'
        if (localStorage.getItem('libraryData')) {
            // If there is data, parse it from JSON format and assign it to the 'books' property
            this.books = JSON.parse(localStorage.getItem('libraryData'))
        }
        // If there is no data in localStorage, create four Book objects with sample data
        else {
            const book1 = new Book('The Great Gatsby', 218, 218, 'F. Scott Fitzgerald', true, 'https://i.pinimg.com/originals/4f/b2/59/4fb259929a311cf10d3391f448a7ae17--high-schools-lwren-scott.jpg')
            const book2 = new Book('To Kill a Mockingbird', 267, 281, 'Harper Lee', false, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/728px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg?20190729060537')
            const book3 = new Book('Atomic Habits', 320, 320, 'James Clear', true, 'https://imgs.search.brave.com/Xz7th_2_xAiAhIunSGR0llb54eamhYvsdDpFDbmr4ZA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9waWN0/dXJlcy5hYmVib29r/cy5jb20vaXNibi85/NzgxODQ3OTQxODMx/LXVzLmpwZw')
            const book4 = new Book('Dune', 350, 688, 'Frank Herbert', false, 'https://q3v5z9r8.rocketcdn.me/wp-content/uploads/2022/07/dune-deluxe-edition-frank-herbert-matt-griffin-amazon-bookstr.jpg')
            this.books = [book1, book2, book3, book4]
        }
    }

    // Method to add books to the library
    addBooks(...books) {
        for (const book of books) {
            this.books.push(book)
            updateLocalStorage()
            this.displayBook(book)
        }
    }

    removeBook(index) {
        this.books.splice(index, 1)
        updateLocalStorage()
        document.getElementsByClassName('book-list')[0].children[index].remove()
        this.updateIndices(index)
    }

    updateIndices(startIndex) {
        for (let i = startIndex; i < this.books.length; i++) {
            document.getElementsByClassName('book-list')[0].children[i].dataset.index = i
        }
        index = this.books.length
    }

    // Method to display the added book in the book list
    displayBook(book) {
        const bookListElement = document.getElementsByClassName('book-list')[0]
        const bookItem = document.createElement('li')
        bookItem.classList.add('book-card')
        bookItem.dataset.index = index++

        bookItem.innerHTML = `
        <img src="${book.imageLink}" class="book-cover" alt="${book.name}">
        <h3 class="book-card-title">${book.name}</h3>
        <p class="book-card-item">${book.author}</p>
        <div class="page-count">
            <input class="read-pages" type="number" class="read-input" min="0" max="${book.totalNumberOfPages}" step="1"
             value="${book.numberOfReadPages}" data-read-pages="${book.numberOfReadPages}" data-index="${bookListElement.children.length}">

            <span class="read-pages" data-max="${book.totalNumberOfPages}" data-index= "${bookListElement.children.length}"
                <input class="read-pages" type="number" class="read-input" min="0" max="${book.totalNumberOfPages}" step="1"
                 value="${book.numberOfReadPages}" data-index="${bookListElement.children.length}">
            </span>
            / <span class="total-pages">${book.totalNumberOfPages}</span>            
        </div>
        <div class="btn-container">
            <btn class="book-card-btn read-card-btn ${book.isRead ? "read-btn" : "not-read-btn"} ">${book.isRead ? "Read" : "Not Read"}</btn>
            <btn class="book-card-btn  remove-btn">Remove</btn>
        </div>
        `
        // Add a click event listener to the Read Button element within the book card
        bookItem.lastElementChild.firstElementChild.addEventListener('click', setReadStatus)

        // Add a click event listener to the Remove Button element within the book card
        bookItem.lastElementChild.lastElementChild.addEventListener('click', handleRemoveBtn)

        // Add an error event listener to handle image loading errors and provide a fallback image
        bookItem.firstElementChild.addEventListener('error', handleImageError)
        bookListElement.appendChild(bookItem)
    }

    displayAllBooks() {
        for (const book of this.books) {
            this.displayBook(book)
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem('libraryData', JSON.stringify(myLibrary.books))
}

function handleImageError() {
    // Displaying fallback image on loading error
    this.src = 'assets/fallback_image.jpg'
}

// This function marks a book as 'Read' and update its read status in the library.

function setReadStatus(event) {
    // Get the book object associated with the clicked element
    const book = myLibrary.books[event.target.parentElement.parentElement.dataset.index]

    // Check if the number of read pages is less than the total number of pages
    if (book.numberOfReadPages < book.totalNumberOfPages) {
        // If so, mark the book as 'Read'
        book.isRead = true
    }

    // Set the number of read pages to the total number of pages in the book
    book.numberOfReadPages = book.totalNumberOfPages

    // Replace the CSS class to visually indicate that the book is now 'Read'
    event.target.classList.replace('not-read-btn', 'read-btn')

    // Update the text content of the button to 'Read'
    event.target.innerHTML = 'Read'

    // Update the input field for the number of pages read to match the total number of pages
    event.target.parentElement.previousElementSibling.firstElementChild.value = book.totalNumberOfPages
}

function handleReadBtn(readPages = -1, totalPages = 0) {
    readBtn.disabled = readBtn.checked = (readPages >= totalPages)
    if (readPages === -1) readBtn.disabled = true
}

function handleRemoveBtn(event) {
    const bookIndex = event.target.parentElement.parentElement.dataset.index
    myLibrary.removeBook(bookIndex)
}

function areRequiredFieldsEmpty(form) {
    for (const element of form.elements) {
        // Check if the element is required and its value is empty or only whitespace.
        if (element.required && element.value.trim() === '') {
            // Clear the element's value.
            element.value = ''
            element.setCustomValidity('')
            element.reportValidity()
            return true
        }
    }
}

function handleFormSubmit() {
    if(areRequiredFieldsEmpty(form)) return;

    // Parse the values of readPagesInput and totalPagesInput as integers.
    let readPages = parseInt(readPagesInput.value),
        totalPages = parseInt(totalPagesInput.value)

    // Determine the image link for the book cover, using a fallback if none is provided.
    let imageLink = bookCoverUrlInput.value === '' ? 'assets/fallback_image.jpg' : bookCoverUrlInput.value

    // If readPagesInput is empty, set readPages to 0.
    if (readPagesInput.value === '') {
        readPages = 0
    }

    // Create a new Book object with the form inputs.
    const book = new Book(
        titleInput.value,
        readPages,
        totalPages,
        authorInput.value,
        readPages === totalPages,
        imageLink
    )

    // Add the new book to the library.
    myLibrary.addBooks(book)

    // Close the modal after successfully adding the book.
    closeModal()
}

function closeModal() {
    for (let inputField of inputFields) inputField.value = ""
    handleReadBtn()
    modal.close()
}

const logInBtn = document.getElementsByClassName('header-btn')[0]
const addBookBtn = document.getElementsByClassName('add-book-btn')[0]
const modal = document.getElementById('modal')
const inputFields = document.getElementsByClassName('modal-form-input')
const [titleInput, authorInput, totalPagesInput, readPagesInput, bookCoverUrlInput] = inputFields
const readBtn = document.getElementById('readBtn')
const submitFormBtn = document.getElementsByClassName('submit-btn')[0]
const cancelFormBtn = document.getElementsByClassName('cancel-btn')[0]
const form = document.getElementById('modalForm')


// Add an event listener that triggers when the DOM content is fully loaded
// This listener updates book data based on edited read page numbers

document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements with the class 'read-pages' and store them in 'readPagesInputElements'
    const readPagesInputElements = document.getElementsByClassName('read-pages')

    for (let inputElement of readPagesInputElements) {
        // Add a 'change' event listener to each input element
        inputElement.addEventListener('change', function () {
            let readStatusElement = inputElement.parentElement.nextElementSibling.firstElementChild
            let book = myLibrary.books[this.dataset.index]
            const newValue = parseInt(inputElement.value, 10)

            // Check if the new value is a valid number less than the total number of pages
            if (!isNaN(newValue) && newValue < book.totalNumberOfPages) {
                // Update the book's number of read pages, set it as unread, and update the display
                book.numberOfReadPages = Math.max(newValue, 0)
                book.isRead = false
                readStatusElement.innerHTML = 'Not Read'
                readStatusElement.classList.remove('read-btn')
                readStatusElement.classList.add('not-read-btn')
                inputElement.valueAsNumber = newValue
            }
            // Check if the new value is equal to or greater than the total number of pages
            else if (newValue >= book.totalNumberOfPages) {
                // Update the book's number of read pages, set it as read, and update the display
                book.numberOfReadPages = book.totalNumberOfPages
                book.isRead = true
                readStatusElement.innerHTML = 'Read'
                readStatusElement.classList.remove('not-read-btn')
                readStatusElement.classList.add('read-btn')
                inputElement.valueAsNumber = book.totalNumberOfPages
            }
            // If the input value is not a valid number, reset it to the previous value
            else {
                inputElement.valueAsNumber = book.numberOfReadPages
            }
        })
    }
})

logInBtn.addEventListener('click', () => {
    const popupWidth = 500
    const popupHeight = 600

    const leftPosition = (window.innerWidth - popupWidth) / 2
    const topPosition = (window.innerHeight - popupHeight) / 2

    window.open('about:blank', 'blank', `width=${popupWidth},
    height=${popupHeight},left=${leftPosition},top=${topPosition}`)

})

submitFormBtn.addEventListener('click', () => {
    handleFormSubmit()
})

modal.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        handleFormSubmit()
    }
})

cancelFormBtn.addEventListener('click', () => {
    closeModal()
})

addBookBtn.addEventListener('click', () => {
    modal.showModal()
})

modal.addEventListener('click', e => {
    const modalDimensions = modal.getBoundingClientRect()
    if (
        e.clientX < modalDimensions.left ||
        e.clientX > modalDimensions.right ||
        e.clientY < modalDimensions.top ||
        e.clientY > modalDimensions.bottom
    ) {
        closeModal()
    }
})

readBtn.addEventListener('click', () => {
    if (totalPagesInput.value !== '' && readBtn.checked) {
        readBtn.disabled = readBtn.checked = true

        readPagesInput.value = totalPagesInput.value
    }
})

readPagesInput.addEventListener('input', () => {
    // Check if the 'totalPagesInput' value is empty.
    if (totalPagesInput.value === '') return readPagesInput.value = ''
    let readPages = parseInt(readPagesInput.value), totalPages = parseInt(totalPagesInput.value)
    if (readPages > totalPages) readPagesInput.value = totalPages
    handleReadBtn(readPages, totalPages)
})

totalPagesInput.addEventListener('input', () => {
    // Check if the 'totalPagesInput' value is empty.
    if (totalPagesInput.value === '') {
        // If empty, clear the 'readPagesInput' value and update the 'Read' button.
        readPagesInput.value = ''
        handleReadBtn()
        return
    }

    let readPages = parseInt(readPagesInput.value),
        totalPages = parseInt(totalPagesInput.value)

    // Ensure that total pages number does not exceed 9999.
    totalPages = Math.min(totalPages, 9999)

    // Update the 'totalPagesInput' value
    totalPagesInput.value = totalPages

    // Ensure that read pages does not total pages
    readPagesInput.value = Math.min(readPages,totalPages)

    handleReadBtn(readPages, totalPages)
})

const myLibrary = new Library()
myLibrary.displayAllBooks()
