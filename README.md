# CivicConnect – Smart Municipal Complaint Portal

A simple, responsive website prototype for reporting and managing local civic issues.

## Features

### Citizen portal
- Choose from six complaint categories: Roads, Waste Management, Water Supply, Electricity, Trees & Parks, and Drainage.
- Enter a description and area/locality.
- Upload a photo of the issue.
- Submit a complaint and receive a unique ticket ID.
- Track a complaint using its ticket ID.

### Admin portal
- View complaints submitted from the citizen portal.
- See attached photos, citizen details, category, area and mapped department.
- Filter complaints by status and priority.
- Set priority to Critical, High, Medium or Low.
- Update status to Pending, In Progress or Resolved.
- View summary counts.

## Run locally

No build tools are required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Submit a sample complaint.
4. Open **Admin portal** to view and manage it.

For the best local development experience, use the VS Code Live Server extension.

## Publish on GitHub Pages

1. Create a GitHub repository, for example `civicconnect`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. Open **Settings → Pages** in the repository.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Important: prototype limitations

This version is a frontend demonstration. It stores complaint data in the browser's `localStorage`. Therefore:
- Data is not shared between different users, devices or browsers.
- The admin portal is a demo view, not a secure admin login.
- Images are stored in the browser and are subject to browser storage limits.
- There are no real SMS, email or push notifications.
- Severity is initially set to Medium; an admin can change it.

Before launching for real citizens, add a backend API, a shared database, secure citizen/admin authentication, role-based access, protected image storage, input validation, audit logs, backups and privacy safeguards. Never use this local-storage demo to collect real citizens' personal information.

## Suggested future stack

- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL or MongoDB
- Image storage: Cloudinary or secure object storage
- Authentication: secure session-based authentication or managed identity provider
- Hosting: frontend on Vercel / GitHub Pages and backend on a suitable server

## Department mapping in this prototype

| Category | Suggested department |
|---|---|
| Roads | Public Works Department |
| Waste Management | Solid Waste Management Department |
| Water Supply | Water Supply Department |
| Electricity | Electrical Department |
| Trees & Parks | Horticulture / Tree Department |
| Drainage | Drainage and Sewerage Department |

Department names should be adjusted to match the relevant municipal corporation's actual structure.
