# Setting up

Below are the instructions to setup the application locally.

## Prerequisites

Node.js, npm, MySql must be installed on the system.

## Cloning the Repository

```bash
git clone https://github.com/jagratijain/Voice-Agent-for-Interview-Scheduling.git
cd Voice-Agent-for-Interview-Scheduling
```

## Backend Configuration

**Environment File**: Navigate to the `backend` folder and create `.env` file. Add the following content to the file:

    PORT=
    
    #DB configs for MySql
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
  
## Running the Application

1. **Backend**:
    - Navigate to the `backend` directory.
    - Install dependencies: `npm install`.
    - Start the server: `npm run dev`.

2. **Frontend**:
    - Open a new terminal and navigate to the `frontend` directory.
    - Install dependencies: `npm install`.
    - Start the frontend application: `npm run dev`.
    - The application should now be running on `http://localhost:5173`.
