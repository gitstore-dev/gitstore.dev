import './styles.css';
import { validateEmail } from './lib/validation';
import { isBotDetected } from './lib/honeypot';

// Get form elements
const form = document.getElementById('signup-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const emailError = document.getElementById('email-error') as HTMLParagraphElement;
const successMessage = document.getElementById('success-message') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;

// Get Formspree form ID from environment variable
const formspreeId = import.meta.env.VITE_FORMSPREE_FORM_ID;

if (!formspreeId) {
  console.warn('VITE_FORMSPREE_FORM_ID is not set. Form submission will not work.');
}

// Hide all messages
function hideAllMessages() {
  form.classList.remove('hidden');
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  emailError.classList.add('hidden');
}

// Show success message
function showSuccess() {
  form.classList.add('hidden');
  successMessage.classList.remove('hidden');
  errorMessage.classList.add('hidden');
}

// Show error message
function showError(message?: string) {
  errorMessage.classList.remove('hidden');
  if (message) {
    errorMessage.querySelector('p:last-child')!.textContent = message;
  }
}

// Show email validation error
function showEmailError(message: string) {
  emailError.textContent = message;
  emailError.classList.remove('hidden');
  emailInput.classList.add('border-error');
  emailInput.classList.remove('border-neutral-100');
}

// Clear email validation error
function clearEmailError() {
  emailError.classList.add('hidden');
  emailInput.classList.remove('border-error');
  emailInput.classList.add('border-neutral-100');
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  hideAllMessages();
  clearEmailError();

  // Get form data
  const email = emailInput.value.trim();
  const honeypot = (form.querySelector('input[name="_gotcha"]') as HTMLInputElement).value;

  // Validate email format
  if (!validateEmail(email)) {
    showEmailError('Please enter a valid email address');
    return;
  }

  // Check honeypot (bot detection)
  if (isBotDetected(honeypot)) {
    console.warn('Bot detected - submission rejected');
    // Silently reject - don't show error to bot
    return;
  }

  // Disable button and show loading state
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';

  try {
    // Submit to Formspree
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        _gotcha: honeypot,
        _subject: 'New GitStore.dev Early Adopter Signup',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      // Success - show success message
      showSuccess();
      // Clear form
      form.reset();
    } else {
      // Server-side validation error
      const errorMsg = data.errors?.[0]?.message || 'Please check your email and try again.';
      showEmailError(errorMsg);
    }
  } catch (error) {
    // Network error or service unavailable
    console.error('Form submission error:', error);
    showError('Please try again in a few minutes.');
  } finally {
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Real-time email validation
emailInput.addEventListener('blur', () => {
  const email = emailInput.value.trim();
  if (email && !validateEmail(email)) {
    showEmailError('Please enter a valid email address');
  } else {
    clearEmailError();
  }
});

// Clear error on input
emailInput.addEventListener('input', () => {
  if (!emailError.classList.contains('hidden')) {
    clearEmailError();
  }
});
