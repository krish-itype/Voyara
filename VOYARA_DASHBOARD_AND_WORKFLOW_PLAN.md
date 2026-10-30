# Voyara Marketplace — Dashboard, Authority, and Workflow Plan

Last updated: 22 October 2026  
Status: Active source of truth for implementation

## 1. Product definition

Voyara is an enquiry-led travel marketplace connecting travelers with verified vendors who publish tours, villas, and special offers. The platform has exactly three dashboard roles:

1. **Traveler**
2. **Vendor**
3. **Admin**

Use these names everywhere in the UI. Do not label the Vendor dashboard as “Agency,” “Partner,” or “Travel Partner.” Internal database enum values may remain `TRAVELER`, `VENDOR`, and `ADMIN`.

## 2. Reference findings

The public Travealz site was reviewed as a product reference, not as code to copy.

- The homepage presents a marketplace where verified agencies publish tours and deals and travelers compare options.
- Public navigation separates Tours, Villas, Destinations, Specials, Vendor Login, and Traveler Login.
- Tour detail pages include price, country, duration, cities, itinerary, inclusions, exclusions, gallery, vendor information, reviews, vendor website, and an “Ask a Query” action.
- Villa pages include destination, city, price, bedrooms, guest capacity, description, policies, amenities/inclusions, gallery, vendor information, and enquiry actions.
- Traveler registration includes personal details, contact details, destination interests, and newsletter consent.
- Custom tour requests include travel dates, destination, adult/child/infant counts, budget, amount, and additional requests.
- Custom villa requests include dates, destination, bedrooms, and additional requests.
- Some listing details are gated behind traveler login.
- Vendor verification is an important public trust message.

Reference pages:

- [Travealz homepage](https://travealz.com/)
- [Traveler registration and login](https://travealz.com/travelers/)
- [Tour detail example](https://travealz.com/tour/myproguide-thailand/ayutthaya-temples-one-day-tour-from-bangkok/)
- [Villa listing archive](https://travealz.com/villa/)
- [Specials archive](https://travealz.com/specials/)

Private Vendor and Admin dashboard screens were not publicly accessible. Their behavior below is the intended Voyara design based on the public marketplace workflow and our own security requirements.

## 3. Authority matrix

| Capability | Traveler | Vendor | Admin |
|---|---:|---:|---:|
| Browse approved public listings | Yes | Yes | Yes |
| View complete listing details | Yes, subject to login rules | Yes | Yes |
| Save favorites | Own favorites | No | No |
| Submit tour/villa request | Yes | No | View/oversee |
| Ask a vendor a question | Yes | Reply only | View/oversee |
| Create and edit listings | No | Own listings only | Any listing if necessary |
| Publish a listing directly | No | No | Yes, by approval |
| Submit draft for approval | No | Own drafts | No |
| Approve/reject vendors | No | No | Yes |
| Approve/reject listings | No | No | Yes |
| Manage own bookings | Yes | Assigned bookings | All bookings |
| Write a review | Completed-booking listings only | No | Moderate only |
| Manage categories/destinations | No | No | Yes |
| Manage users and suspension | No | No | Yes |
| Manage homepage/site settings | No | No | Yes |
| View audit logs | No | No | Yes |
| View another user’s private data | No | No | Only when operationally required |
| View passwords | Never | Never | Never |

## 4. Traveler dashboard

### Navigation

- Overview
- Explore
- Saved
- My Requests
- Messages
- My Trips
- Reviews
- Notifications
- Profile & Preferences

### Overview

- Greeting and profile completion
- Upcoming confirmed trips
- Open enquiries and latest replies
- Saved listing count
- Recommended approved tours/villas based on destination interests
- Quick actions: Explore, Request a Tour, Request a Villa

### Explore

- Browse approved Tours, Villas, and Specials
- Search by destination and keyword
- Filter by type, country, city, dates, guests, price, duration, bedrooms, and category
- Sort by recommended, newest, price, and duration
- Only `APPROVED` listings are public

### Saved

- Add/remove favorites
- Group saved tours and villas
- Open the listing or start an enquiry
- Traveler can only access their own favorites

### My Requests

Two request types:

1. Tour request: destination, date range, adults, children, infants, budget/currency, interests, and notes.
2. Villa request: destination, date range, bedrooms, guests, budget/currency, and notes.

Statuses: `NEW`, `IN_PROGRESS`, `CLOSED`.

The traveler can view their request, assigned/responding vendors, offers, and message history. They can close or cancel an unconfirmed request.

### Messages

- Conversation is attached to an enquiry/request
- Traveler communicates with the relevant vendor
- Read/unread state and timestamps
- No traveler-to-traveler messaging
- Messages cannot be silently edited by Admin

### My Trips

- Pending, Confirmed, Cancelled, Completed
- Booking code, listing, dates, guests, amount, payment state, vendor, and notes
- Payment is not part of the first marketplace release; start with enquiry and manual confirmation
- Later phase may add online payment without changing dashboard roles

### Reviews

- Traveler may review only an approved listing connected to their completed booking
- One review per traveler per listing
- Reviews enter `PENDING` moderation before public display
- Traveler can see moderation status

### Profile & Preferences

- First/last name, email, phone, avatar
- Country, city, postal code
- Interested destinations and travel interests
- Newsletter consent
- Password change and sign out other sessions (later security phase)
- Traveler can change only their own profile

## 5. Vendor dashboard

### Vendor account states

- `PENDING`: may complete profile and upload verification details, but cannot submit/publish listings
- `APPROVED`: full Vendor dashboard access
- `REJECTED`: may view the rejection reason and update/resubmit profile if Admin permits
- Suspended user: cannot access protected marketplace operations

### Navigation

- Overview
- Company Profile
- Listings
- Add Listing
- Enquiries
- Messages
- Bookings
- Availability
- Reviews
- Analytics
- Notifications
- Settings

### Overview

- Approval/status banner
- Listing totals by Draft, Pending, Approved, Rejected, Archived
- New enquiries and unread messages
- Pending/confirmed bookings
- Listing views, enquiry conversion, and popular listings (analytics phase)
- Quick actions: Add Tour, Add Villa, Reply to Enquiries

### Company Profile

- Agency/business name
- Description and logo
- Website
- Email and phone
- Address, city, country
- Registration/license number
- Verification documents (planned schema addition)
- Vendor status and rejection reason
- Public vendor profile is visible only after approval

### Listings

Vendor may create two listing types: `TOUR` and `VILLA`.

Common fields:

- Title, slug, summary, full description
- Category and destination
- Country, city/location, map coordinates
- Price, original price, special price, currency
- Guest capacity
- Cover image and gallery
- Availability
- Terms/policies
- Vendor website link (optional)

Tour fields:

- Duration
- Cities covered
- Day-by-day itinerary
- Included and excluded items
- Meeting point
- Departure dates
- Minimum travelers

Villa fields:

- Bedrooms, bathrooms, guest capacity
- Amenities
- Check-in/check-out policy
- Minimum stay
- Units/availability calendar

### Listing authority and state flow

```text
Vendor creates listing
        ↓
      DRAFT
        ↓ Vendor submits
     PENDING
        ↓ Admin decision
 APPROVED or REJECTED
        ↓
Public listing or returned to Vendor with a reason
```

- Vendor can freely edit `DRAFT` and `REJECTED` listings
- Vendor cannot directly publish
- Editing material fields of an `APPROVED` listing creates a new review requirement before the changes replace the live version
- Vendor can archive their listing; archived listings are hidden publicly
- Vendor can never edit another vendor’s listing

### Enquiries and messages

- Vendor sees enquiries only for their own listings or requests routed to them
- Vendor can reply, provide availability, and propose an offer
- Vendor moves enquiry from New to In Progress or Closed
- Vendor cannot delete the traveler’s messages
- Admin may oversee reports/disputes but should not impersonate either party

### Bookings and availability

- Vendor may accept/decline an enquiry before booking confirmation
- Vendor updates availability and available units
- Vendor sees booking contact details only when operationally required
- Vendor may update booking fulfillment status, but refunds/payment changes require Admin authority in a future payment phase

### Reviews

- Vendor can read reviews for their listings
- Vendor may submit one public response per review in a later phase
- Vendor cannot approve, hide, or edit traveler reviews

## 6. Admin dashboard

### Navigation

- Overview
- Vendor Approvals
- Listing Approvals
- Users
- Enquiries
- Bookings
- Reviews
- Categories
- Destinations
- Homepage & Content
- Contact & Newsletter
- Audit Log
- Settings

### Overview

- Pending vendors
- Listings awaiting review
- Open enquiries
- Total users by role
- Bookings by state
- Recent vendor applications
- Recent listing submissions
- Latest reported or failed operations

### Vendor approvals

- View company profile and verification details
- Approve or reject with required reason
- Suspend/reactivate the related user account
- Approval sets `verifiedAt`
- Every decision creates an `AdminAudit` entry
- Admin cannot recover or view a user password

### Listing approvals

- Preview exactly how the public page will look
- Inspect vendor, content, price, itinerary/amenities, policies, and images
- Approve and publish
- Reject with required correction notes
- Feature/unfeature an approved listing
- Archive unsafe or outdated content
- All decisions are audited

### Users

- Search/filter Traveler, Vendor, and Admin accounts
- View status and operational history
- Suspend/reactivate accounts
- Do not expose password hashes
- Admin creation remains a protected server-side operation; ordinary admins cannot promote users unless a future Super Admin role is intentionally added

### Marketplace moderation

- Moderate reviews
- Oversee enquiries/bookings for support and disputes
- Manage destinations and categories
- Manage featured listings and specials
- Resolve contact submissions
- Manage newsletter subscription status
- Manage site settings and public content
- View immutable audit history

## 7. Core marketplace workflows

### Vendor onboarding

```text
Register as Vendor → Vendor profile PENDING → Complete company details
→ Admin reviews → APPROVED or REJECTED → Approved Vendor can submit listings
```

### Listing publication

```text
Vendor creates Draft → adds details/images/availability → submits
→ Admin reviews → approve and publish OR reject with correction reason
→ Vendor corrects and resubmits
```

### Traveler enquiry

```text
Traveler browses approved listing → logs in → asks query/selects dates
→ Enquiry created → Vendor notified → Vendor replies
→ Traveler and Vendor agree → Booking created/confirmed → Trip completed
→ Traveler may review
```

### Custom request

```text
Traveler submits Tour/Villa request → Admin/routing rules select matching Vendors
→ Vendors send offers → Traveler compares and continues one conversation
→ Accepted offer becomes a Booking
```

The multiple-offer workflow is a later phase. The first release can route a request to one selected Vendor or let Admin assign it manually.

## 8. Security and ownership rules

- Authentication uses an HTTP-only JWT cookie
- Every protected API starts with `authenticate`
- Role checks use `authorize("TRAVELER")`, `authorize("VENDOR")`, or `authorize("ADMIN")`
- Role checks are not sufficient by themselves; every query must also enforce record ownership
- Vendors must be `APPROVED` before listing submission or marketplace operations
- Public listing queries must always enforce `status = APPROVED`
- Password hashes, JWT secrets, database credentials, and private verification documents are never returned by APIs
- Validation uses Zod on every write endpoint
- Rate-limit login, registration, enquiries, reviews, and public forms
- Admin decisions and sensitive status changes create `AdminAudit` records
- Use soft archive/status changes for business records; avoid destructive deletion of listings, bookings, messages, and audits

## 9. Route plan

### Frontend

- `/dashboard/traveler`
- `/dashboard/vendor`
- `/admin`
- `/admin/vendors`
- `/admin/listings`
- `/tours`
- `/tours/:slug`
- `/villas`
- `/villas/:slug`
- `/specials`
- `/requests/new`
- `/messages/:enquiryId`

The current `/dashboard` route may redirect to the correct role-specific dashboard.

### API groups

- `/api/auth/*`
- `/api/public/listings/*`
- `/api/traveler/profile/*`
- `/api/traveler/favorites/*`
- `/api/traveler/requests/*`
- `/api/vendor/profile/*`
- `/api/vendor/listings/*`
- `/api/vendor/enquiries/*`
- `/api/bookings/*`
- `/api/messages/*`
- `/api/reviews/*`
- `/api/admin/dashboard`
- `/api/admin/vendors/*`
- `/api/admin/listings/*`
- `/api/admin/users/*`
- `/api/admin/settings/*`

## 10. Database plan

The existing schema already contains Users, Vendor Profiles, Listings, Listing Images, Itinerary Days, Availability, Favorites, Enquiries, Messages, Bookings, Reviews, Admin Audits, Contact Submissions, Newsletter Subscribers, Categories, Destinations, and Site Settings.

Planned additions before their features are built:

- `TravelerProfile`: address, city, country, postal code, destination interests, newsletter preferences
- `VendorDocument`: verification file metadata and review status
- Listing structured fields for cities covered, included/excluded items, amenities, policies, meeting point, minimum travelers/stay, and vendor website
- `TripRequest`: custom Tour/Villa request independent of an existing listing
- `VendorOffer`: vendor response/quote to a custom request
- `Notification`: in-app notification and read state
- Optional listing revision model so approved content remains live while edited content is reviewed

Do not add every future table in one migration. Add each schema change with the feature that uses it.

## 11. Implementation order

### Completed

- MySQL and Prisma setup
- Base marketplace schema and first migration
- JWT cookie authentication
- Traveler and Vendor registration
- Role-protected routes
- Initial Traveler/Vendor dashboard shell
- Admin account seed command
- Admin live summary statistics
- Admin Vendor approval/rejection with audit logging

### Next — Phase 1: Vendor listing workflow

1. Vendor profile/status API guard
2. Vendor listing CRUD
3. Tour and Villa form with type-specific fields
4. Draft autosave/manual save
5. Image upload and ordering
6. Itinerary and availability editors
7. Submit for review
8. Vendor listing table with statuses and rejection notes

### Phase 2: Admin listing moderation

1. Pending listing queue
2. Listing preview
3. Approve/reject with required reason
4. Feature/archive controls
5. Audit records

### Phase 3: Public marketplace

1. Tours/Villas/Specials archives
2. Filters, sorting, pagination
3. Tour detail page
4. Villa detail page
5. Approved-only public API

### Phase 4: Traveler enquiries and messaging

1. Ask a Query
2. Tour and Villa custom request forms
3. Traveler request dashboard
4. Vendor enquiry inbox
5. Conversation/messages

### Phase 5: Favorites, bookings, and reviews

1. Favorites
2. Booking confirmation workflow
3. Traveler trips and Vendor bookings
4. Completed-trip review eligibility
5. Admin review moderation

### Phase 6: Operations and launch

1. Notifications and email delivery
2. Content/settings management
3. Security testing and rate limits
4. File storage configuration
5. Error monitoring, backups, and production deployment

## 12. Product decisions to preserve

- Role names are **Traveler**, **Vendor**, and **Admin**
- Vendors never publish directly
- Admin approves both Vendors and Listings
- Only approved listings are public
- Voyara begins as enquiry-led; payments are a later decision
- Private records are restricted by both role and ownership
- Rejections always contain a reason
- Sensitive Admin actions are audited
- This file is the source of truth; update it when a workflow decision changes
