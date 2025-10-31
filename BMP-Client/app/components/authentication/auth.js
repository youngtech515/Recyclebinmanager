// Basic front-end form validation
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      const password = signupForm.password.value.trim();
      if (password.length < 6) {
        e.preventDefault();
        alert("Password must be at least 6 characters.");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      if (!email || !password) {
        e.preventDefault();
        alert("Please enter both email and password.");
      }
    });
  }
});
