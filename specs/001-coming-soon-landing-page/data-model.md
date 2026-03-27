# Data Model: GitStore.dev Coming Soon Landing Page

**Date**: 2026-03-27
**Feature**: 001-coming-soon-landing-page

## Overview

This document defines the data entities for the GitStore.dev landing page. Since this is a static site with form submission via third-party service (Formspree), there is minimal data modeling required. The primary entity is the email signup submission.

---

## Entities

### Early Adopter Signup

**Purpose**: Represents a visitor's interest in GitStore, captured via the email signup form.

**Attributes**:

| Attribute | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| `email` | string | Yes | RFC 5322 email format | User's email address for launch notifications |
| `timestamp` | datetime | Auto | ISO 8601 format | Submission time (handled by Formspree) |
| `_gotcha` | string | No | Must be empty | Honeypot field for bot detection |
| `_subject` | string | Auto | Fixed value | Email subject line (configured client-side) |

**Validation Rules**:
1. **Email Format**: Must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Client-side validation before submission
   - Server-side validation by Formspree
2. **Honeypot**: `_gotcha` field must be empty string
   - If filled, submission is silently rejected (bot detected)
3. **Duplicate Handling**: Formspree does not prevent duplicates by default
   - Clarification decision: Show success message regardless (silent acceptance)
   - Manual cleanup of duplicates in Formspree dashboard (low priority)

**State Transitions**:
- **Submitted** → Initial state when user clicks submit button
- **Validating** → Client-side validation running
- **Sending** → POST request in flight to Formspree
- **Success** → 200 response received, confirmation message displayed
- **Error** → Non-200 response, error message displayed

**Error States**:
- **Invalid Email** (client-side): Format validation failed, show error below input field
- **Bot Detected** (client-side): Honeypot field filled, silently reject (no user feedback)
- **Service Unavailable** (server-side): Formspree returns 500/503, show graceful error message

---

## Storage

**Primary Storage**: Formspree cloud service (external)
- No local database required
- Data stored in Formspree account, accessible via dashboard
- Exports available as CSV for email list management

**Client-Side State**: None persisted
- No localStorage or cookies used
- Form state cleared after successful submission

---

## Data Flow

```
User enters email
  ↓
Client validates format
  ↓
Check honeypot field
  ↓ (empty = human)
POST to Formspree API
  ↓
Formspree stores submission
  ↓
Formspree sends notification email (to configured address)
  ↓
Return success/error to client
  ↓
Display confirmation or error message
```

---

## Privacy & Compliance

**Data Collection**:
- Only email address collected
- No personal identifiable information (PII) beyond email
- No tracking cookies or analytics (MVP scope)

**Usage**:
- Email used solely for launch notifications
- No third-party sharing
- User can request removal via email (manual process for MVP)

**Assumptions**:
- No formal privacy policy required for MVP (spec assumption)
- Basic GDPR/CCPA compliance via minimal data collection
- Detailed compliance deferred to post-launch

---

## Schema Representation

**JSON Payload** (client to Formspree):
```json
{
  "email": "user@example.com",
  "_gotcha": "",
  "_subject": "New GitStore.dev Early Adopter Signup"
}
```

**Formspree Response** (success):
```json
{
  "ok": true,
  "next": "https://formspree.io/thanks"
}
```

**Formspree Response** (error):
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

---

## Future Considerations

**Post-MVP Enhancements** (deferred):
1. **Duplicate Prevention**: Add client-side check against cached submissions (localStorage)
2. **Email Verification**: Require double opt-in via confirmation link
3. **Segmentation**: Collect role (developer/business user) via dropdown
4. **Analytics**: Track conversion funnel (pageview → form interaction → submission)
5. **Export Automation**: Sync Formspree data to email marketing platform (Mailchimp, etc.)

**Not Needed for MVP**: All above enhancements violate simplicity principle until proven necessary by usage data.

---

## References

- **Formspree API Documentation**: https://help.formspree.io/hc/en-us/articles/360013580813-Formspree-API
- **Email Validation RFC**: https://datatracker.ietf.org/doc/html/rfc5322
- **Honeypot Technique**: https://en.wikipedia.org/wiki/Honeypot_(computing)#Spam_filtering
