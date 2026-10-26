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
    errorMessage.querySelector('p')!.textContent = message;
  }
}

// Show email validation error
function showEmailError(message: string) {
  emailError.textContent = message;
  emailError.classList.remove('hidden');
  emailInput.classList.add('border-error');
  emailInput.setAttribute('aria-invalid', 'true');
  emailInput.classList.remove('border-neutral-100');
}

// Clear email validation error
function clearEmailError() {
  emailError.classList.add('hidden');
  emailInput.classList.remove('border-error');
  emailInput.removeAttribute('aria-invalid');
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
        Accept: 'application/json',
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

// Keep the workflow illustration local: it never changes a real catalog.
const demoStates = {
  stage: {
    branch: 'Draft workspace',
    kicker: '01 / PLAN YOUR CAMPAIGN',
    badge: 'Draft',
    title: 'A new season. A safe place to start.',
    description: 'Prepare your holiday collection away from the published catalog.',
    before: 'Autumn essentials',
    after: 'The holiday edit',
    extra: 'A little winter magic.',
    count: '+2 −1',
    resultTitle: 'Room to get it right',
    resultCopy: 'Keep campaign ideas separate from the published catalog.',
    icon: '⑂',
    command: 'git switch -c holiday-drop',
  },
  review: {
    branch: 'Draft workspace',
    kicker: '02 / CHECK THE PROPOSED CHANGES',
    badge: 'In review',
    title: 'Every edit has a story.',
    description: 'See what your team plans to change before accepting the update.',
    before: 'Autumn essentials',
    after: 'The holiday edit',
    extra: 'A little winter magic.',
    count: '+2 −1',
    resultTitle: 'Know what you’re approving',
    resultCopy: 'Your team’s review process decides which changes go ahead.',
    icon: '±',
    command: 'git diff main...holiday-drop',
  },
  recover: {
    branch: 'Catalog correction',
    kicker: '03 / RESTORE EARLIER CONTENT',
    badge: 'Revert',
    title: 'A way back, without losing the story.',
    description: 'Your technical team can bring back an earlier version of the collection.',
    before: 'The holiday edit',
    after: 'Autumn essentials',
    extra: 'Your everyday favorites.',
    count: '+2 −1',
    resultTitle: 'A clear record of the correction',
    resultCopy: 'Restored content goes through the same checks as any update.',
    icon: '↶',
    command: 'git revert <campaign-commit>',
  },
};
type DemoStep = keyof typeof demoStates;
const demoTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-demo]'));
function selectDemo(tab: HTMLButtonElement) {
  const step = tab.dataset.demo as DemoStep;
  const state = demoStates[step];
  document.dispatchEvent(new CustomEvent('catalog-step', { detail: step }));
  const values: Record<string, string> = {
    'demo-branch': state.branch,
    'demo-kicker': state.kicker,
    'demo-badge': state.badge,
    'demo-title': state.title,
    'demo-description': state.description,
    'diff-before': state.before,
    'diff-after': state.after,
    'diff-extra': state.extra,
    'diff-count': state.count,
    'demo-result-title': state.resultTitle,
    'demo-result-copy': state.resultCopy,
    'demo-result-icon': state.icon,
    'demo-command': state.command,
  };
  for (const [id, value] of Object.entries(values)) {
    document.getElementById(id)!.textContent = value;
  }
  demoTabs.forEach((button) => {
    const selected = button === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.getElementById('demo-panel')!.setAttribute('aria-labelledby', tab.id);
}
demoTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDemo(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % demoTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index + demoTabs.length - 1) % demoTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = demoTabs.length - 1;
    else return;
    event.preventDefault();
    selectDemo(demoTabs[nextIndex]);
    demoTabs[nextIndex].focus();
  });
});

import './theme';
import { initCatalogScene } from './catalog-scene';
void initCatalogScene();
