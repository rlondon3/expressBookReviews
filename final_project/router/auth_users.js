const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [
	{
		testuser: 'testpassword',
	},
];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	const user = users.find((u) => Object.keys(u)[0] === username);
	if (user && user[username] === password) {
		const token = jwt.sign({ username }, 'fingerprint_customer', {
			expiresIn: '1h',
		});

		req.session.token = token;

		return res.status(200).json({
			message: 'Login successful',
			token: token,
		});
	} else {
		return res.status(401).json({ message: 'Invalid username or password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	//Write your code here
	const { isbn } = req.params;
	const { review } = req.query;
	const username = req.session.username;

	if (!books[isbn]) {
		return res.status(404).json({ message: 'Book not found' });
	}

	if (!review) {
		return res.status(400).json({ message: 'Review text is required' });
	}

	if (!books[isbn].reviews[username]) {
		books[isbn].reviews[username] = review;
	} else {
		books[isbn].reviews[username] = review;
	}

	return res
		.status(200)
		.json({ message: 'Review successfully posted or updated' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const { isbn } = req.params;
	const username = req.session.username; // Get the username from session

	if (!books[isbn]) {
		return res.status(404).json({ message: 'Book not found' });
	}

	delete books[isbn].reviews[username];

	return res.status(200).json({ message: 'Review successfully deleted' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
