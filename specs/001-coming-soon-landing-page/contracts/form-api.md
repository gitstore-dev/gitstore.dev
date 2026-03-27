# Email Signup Form API Contract

**Version**: 1.0.0
**Date**: 2026-03-27
**Provider**: Formspree
**Feature**: 001-coming-soon-landing-page

---

## Overview

This contract defines the interface between the GitStore.dev landing page client and the Formspree email capture service. The client submits email addresses via HTTP POST, and Formspree handles storage, notification, and duplicate detection.

---

## Base URL

```
https://formspree.io/f/{FORM_ID}
```

**FORM_ID**: Generated after creating form in Formspree dashboard (to be configured during implementation)

---

## Endpoints

### POST /f/{FORM_ID}

**Purpose**: Submit email signup

**Request**:

```http
POST https://formspree.io/f/{FORM_ID}
Content-Type: application/json
Accept: application/json
```

**Request Body** (JSON):

```json
{
  "email": "user@example.com",
  "_gotcha": "",
  "_subject": "New GitStore.dev Early Adopter Signup"
}
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid RFC 5322 email address |
| `_gotcha` | string | No | Honeypot field for spam detection (must be empty) |
| `_subject` | string | No | Custom email subject line (optional) |

**Request Headers**:

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Accept` | `application/json` | Yes (for JSON response) |

---

**Response** (Success - 200 OK):

```json
{
  "ok": true,
  "next": "https://formspree.io/thanks"
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `true` on success |
| `next` | string | Optional redirect URL (not used for AJAX submissions) |

---

**Response** (Client Error - 400 Bad Request):

```json
{
  "ok": false,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Error Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `false` on error |
| `errors` | array | List of validation errors |
| `errors[].field` | string | Field name that failed validation |
| `errors[].message` | string | Human-readable error message |

**Common Error Messages**:
- `"Email is required"` - Missing email field
- `"Email is invalid"` - Malformed email format
- `"Submission rejected"` - Honeypot field filled (bot detected)

---

**Response** (Server Error - 500/503):

```json
{
  "ok": false,
  "error": "Service temporarily unavailable"
}
```

**Error Handling**:
- Display user-friendly error message: "Unable to sign up right now. Please try again in a few minutes."
- Do not expose technical error details to user

---

## Validation Rules

### Email Field

**Client-Side**:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(email);
```

**Server-Side** (Formspree):
- Validates RFC 5322 compliance
- Rejects disposable email domains (optional setting)

### Honeypot Field

**Client-Side**:
```javascript
if (_gotcha !== '') {
  // Bot detected - silently reject
  return; // Do not submit
}
```

**Server-Side** (Formspree):
- If `_gotcha` is non-empty, submission is rejected

---

## Rate Limits

**Formspree Free Tier**:
- 50 submissions/month
- No rate limit per IP address
- Excess submissions return 402 Payment Required

**Handling**:
- Monitor submission count via Formspree dashboard
- Upgrade to paid tier if limit approached
- No client-side rate limiting needed (Formspree handles)

---

## Duplicate Handling

**Behavior**: Formspree does not prevent duplicate email submissions by default.

**Client Strategy** (per spec clarification):
- Always return success message on valid submission
- Do not check for duplicates client-side
- Manual cleanup of duplicates in Formspree dashboard (low priority)

**Future Enhancement** (post-MVP):
- Enable Formspree duplicate detection (paid feature)
- Or implement client-side localStorage check

---

## Security

### HTTPS

All requests MUST use HTTPS. Formspree enforces TLS 1.2+.

### CORS

Formspree automatically allows CORS from any origin. No additional configuration needed.

### CSRF Protection

Formspree does not require CSRF tokens for public forms. Honeypot field provides spam protection.

### Data Privacy

- Formspree stores submissions in encrypted database
- Email data not shared with third parties
- Compliant with GDPR/CCPA (Formspree responsibility)

---

## Example Implementations

### JavaScript (Fetch API)

```javascript
async function submitEmail(email) {
  const honeypot = document.querySelector('input[name="_gotcha"]').value;

  // Bot detection
  if (honeypot !== '') {
    console.warn('Bot detected');
    return;
  }

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
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
      showSuccessMessage();
    } else {
      showErrorMessage(data.errors[0].message);
    }
  } catch (error) {
    showErrorMessage('Unable to sign up. Please try again.');
  }
}
```

### TypeScript

```typescript
interface FormData {
  email: string;
  _gotcha: string;
  _subject: string;
}

interface SuccessResponse {
  ok: true;
  next: string;
}

interface ErrorResponse {
  ok: false;
  errors: Array<{ field: string; message: string }>;
}

type FormResponse = SuccessResponse | ErrorResponse;

async function submitEmail(email: string): Promise<boolean> {
  const honeypot = (document.querySelector('input[name="_gotcha"]') as HTMLInputElement).value;

  if (honeypot !== '') {
    console.warn('Bot detected');
    return false;
  }

  const formData: FormData = {
    email,
    _gotcha: honeypot,
    _subject: 'New GitStore.dev Early Adopter Signup',
  };

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data: FormResponse = await response.json();

    if (data.ok) {
      showSuccessMessage();
      return true;
    } else {
      showErrorMessage(data.errors[0].message);
      return false;
    }
  } catch (error) {
    showErrorMessage('Unable to sign up. Please try again.');
    return false;
  }
}
```

---

## Testing

### Manual Testing

1. **Happy Path**:
   - Enter valid email: `test@example.com`
   - Verify success message displayed
   - Check Formspree dashboard for submission

2. **Invalid Email**:
   - Enter invalid email: `notanemail`
   - Verify error message displayed

3. **Bot Detection**:
   - Fill honeypot field programmatically
   - Verify submission rejected silently

4. **Service Unavailability**:
   - Mock 503 response
   - Verify graceful error message displayed

### Automated Testing (Playwright)

```typescript
test('Email signup success', async ({ page }) => {
  await page.goto('https://gitstore.dev');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## Configuration

### Formspree Setup

1. Create account at https://formspree.io
2. Create new form: "GitStore.dev Early Adopters"
3. Configure notification email: `YOUR_EMAIL@example.com`
4. Copy form ID (e.g., `mabcdefg`)
5. Replace `YOUR_FORM_ID` in code with actual ID

### Environment Variables

**Production**:
```bash
VITE_FORMSPREE_FORM_ID=mabcdefg
```

**Usage in Code**:
```typescript
const formEndpoint = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`;
```

---

## Monitoring

### Metrics to Track

1. **Submission Success Rate**: Count of 200 responses / total requests
2. **Error Rate**: Count of 4xx/5xx responses / total requests
3. **Bot Detection Rate**: Count of honeypot rejections / total attempts
4. **Average Response Time**: P50, P95, P99 latencies

### Alerting (Post-MVP)

- Alert if error rate > 10% over 1 hour
- Alert if Formspree quota > 80% consumed
- Alert if response time P95 > 2 seconds

---

## Migration Path

**Future Considerations** (if outgrowing Formspree):

1. **Custom Backend**: Build simple API with database
2. **Email Marketing Platform**: Direct integration with Mailchimp/ConvertKit
3. **Serverless Function**: AWS Lambda or Cloudflare Workers for form handling

**Migration Strategy**:
- Export existing emails from Formspree (CSV)
- Update client to point to new endpoint (minimal code change)
- Maintain same contract interface for backward compatibility

---

## Repository Context

**Project Structure**:
- **OSS Project**: `gitstore-dev/gitstore` - The e-commerce engine (linked from landing page)
- **This Project**: `gitstore-dev/gitstore.dev` - Landing page repository
- **MCP Tools**: GitHub MCP available for fetching OSS project data if needed

**GitHub Link**: Points to `https://github.com/gitstore-dev/gitstore` (the OSS project, not this website repo)

---

## References

- **Formspree API Documentation**: https://help.formspree.io/hc/en-us/articles/360013580813
- **RFC 5322 Email Format**: https://datatracker.ietf.org/doc/html/rfc5322
- **Honeypot Spam Protection**: https://en.wikipedia.org/wiki/Honeypot_(computing)#Spam_filtering
- **OSS Project Repository**: https://github.com/gitstore-dev/gitstore

---

## Version History

- **1.0.0** (2026-03-27): Initial contract for email signup via Formspree
