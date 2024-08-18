# Brushtent
Brushtent is an online platform designed for users to share and discover Photoshop brush files. 

## Features
- **User Authentication**: User accounts with Auth.js using GitHub as an OAuth provider.
- **Brush Sharing**: Easily upload and share Photoshop brushes with the community.
- **Responsive Design**: Optimized for all devices with a mobile-first approach.

## Technology Stack
- **Frontend & Backend**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL using [Postgres.js](https://github.com/porsager/postgres) for ORM
- **Authentication**: [Auth.js](https://authjs.dev)

## Design Decisions

### Mobile-First Approach
The site’s design prioritizes mobile usability, ensuring an intuitive experience on small screens that scales up nicely for larger devices.

### Database Operations
To efficiently handle batch inserts, I switched from the pg library to Postgres.js, overcoming limitations with inserting multiple rows in a single query.

### UI
For a consistent and appealing UI, I predominantly used my own and modified components provided by Shadcn.

### Planned Changes
- **Payment Integration**: Add methods for purchasing premium brushes.
- **Search Functionality**: Implement advanced search to help users find specific brushes.
- **Editing Capabilities**: Allow users to modify their existing listings.

