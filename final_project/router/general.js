const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', (req, res) => {
	//Write your code here
	const users = {
		username: 'aliceNwonderland',
		password: 'password123',
	};
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required.' });
	}

	if (username === username.username) {
		return res.status(400).json({ message: 'User already exists.' });
	}
	return res.status(201).json({ message: 'User registered successfully.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	//Write your code here
	return books
		? res.status(200).json(books)
		: res.status(404).json({ message: 'No Books found!' });
});

async function getBooks() {
	try {
		const response = await axios.get('http://localhost:5000/');
		return response.data;
	} catch (error) {
		throw new Error(
			`Error fetching books: ${
				error.response ? error.response.data.message : error.message
			}`
		);
	}
}

getBooks()
	.then((books) => console.log('Books:', books))
	.catch((error) => console.error(error.message));

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	return isbn
		? res.status(200).json(isbn)
		: res.status(404).json({ message: 'ISBN not found!' });
});

async function getBookByIsbn(isbn) {
	try {
		const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
		return response.data;
	} catch (error) {
		throw new Error(
			`Error fetching book by ISBN: ${
				error.response ? error.response.data.message : error.message
			}`
		);
	}
}

// Usage
const isbn = '1';
getBookByIsbn(isbn)
	.then((book) => console.log('Book details:', book))
	.catch((error) => console.error(error.message));

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	//Write your code here
	const author = req.params.author;
	const booksByAuthor = Object.values(books).filter(
		(book) => book.author.toLowerCase() === author.toLowerCase()
	);

	return booksByAuthor.length > 0
		? res.status(200).json(booksByAuthor)
		: res
				.status(404)
				.json({ message: 'Author does not exist in our database!' });
});

async function getBooksByAuthor(author) {
	try {
		const response = await axios.get(
			`http://localhost:5000/author/${encodeURIComponent(author)}`
		);
		return response.data;
	} catch (error) {
		throw new Error(
			`Error fetching books by author: ${
				error.response ? error.response.data.message : error.message
			}`
		);
	}
}

// Usage
const author = 'Chinua Achebe';
getBooksByAuthor(author)
	.then((books) => console.log('Books by author:', books))
	.catch((error) => console.error(error.message));

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	//Write your code here
	const title = req.params.title;
	const bookTitle = Object.values(books).filter(
		(book) => book.title.toLowerCase() === title.toLowerCase()
	);

	return bookTitle.length > 0
		? res.status(200).json(bookTitle)
		: res
				.status(404)
				.json({ message: 'Book title does not exist in database!' });
});

async function getBooksByTitle(title) {
	try {
		const response = await axios.get(
			`http://localhost:5000/title/${encodeURIComponent(title)}`
		);
		return response.data;
	} catch (error) {
		throw new Error(
			`Error fetching books by title: ${
				error.response ? error.response.data.message : error.message
			}`
		);
	}
}

// Usage
const title = 'Things Fall Apart';
getBooksByTitle(title)
	.then((books) => console.log('Books by title:', books))
	.catch((error) => console.error(error.message));

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	const review = req.params.isbn;
	return review
		? res.status(200).json(review)
		: res.status(404).json({ message: 'No reviews found! ' });
});

module.exports.general = public_users;
