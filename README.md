# KTM Workshop Management System

A full-stack web application for managing KTM workshops, area in-charges, and revenue tracking.

## Features

- Workshop management with scoring system
- Area and Area In-Charge management
- Workshop In-Charge tracking
- Revenue tracking by quarter and year
- Automated profit and score calculations via PostgreSQL triggers

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Render

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd ktm-workshop-management
```

2. Install dependencies
```bash
npm install
```

3. Setup PostgreSQL database
- Create a database named `ktmdb_pg`
- Run the schema from `pgadmin.sql`

4. Configure environment variables
- Copy `.env.example` to `.env`
- Update with your local database credentials

5. Run the application
```bash
# Run backend only
npm run dev

# Run frontend only
npm run react

# Run both concurrently
npm run dev:all
```

6. Access the application
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001

## API Endpoints

### Workshops
- `GET /api/workshops` - Get all workshops
- `POST /api/workshops` - Create workshop
- `PUT /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop
- `GET /api/workshops/:id/revenue` - Get workshop revenue
- `PUT /api/workshops/:id/revenue` - Update workshop revenue

### Area In-Charges (AICs)
- `GET /api/aics` - Get all area in-charges
- `POST /api/aics` - Create area in-charge
- `PUT /api/aics/:id` - Update area in-charge
- `DELETE /api/aics/:id` - Delete area in-charge

### Workshop In-Charges (WICs)
- `GET /api/wics` - Get all workshop in-charges
- `POST /api/wics` - Create workshop in-charge
- `PUT /api/wics/:id` - Update workshop in-charge
- `DELETE /api/wics/:id` - Delete workshop in-charge

## Database Schema

The database includes:
- `area_incharge` - Area in-charge details
- `area` - Area information
- `workshop` - Workshop details with auto-calculated scores
- `workshop_ic` - Workshop in-charge information
- `manages` - Relationship between workshops and in-charges
- `revenue` - Revenue tracking with auto-calculated profit

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Render.

## License

MIT
