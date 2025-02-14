const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// *** FOR DEMO PURPOSES ONLY - DO NOT USE IN PRODUCTION ***
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Simulate successful login - In a real app, redirect to the dashboard
        // window.location.href = 'admin_dashboard.html'; // Replace with your dashboard page
        errorMessage.textContent = ''; // Clear any previous error
        alert('Login successful! Redirecting to dashboard...'); // Placeholder
        // In a real application, you would likely set a session token or cookie here.
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});
