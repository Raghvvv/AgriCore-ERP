# AgriCore-ERP

AgriCore-ERP is a comprehensive, full-stack web application designed to streamline farm management operations. It provides an intuitive interface for managing crops, inventory, and other farm-related activities.

## Features

*   **User Authentication:** Secure user registration and login functionality.
*   **Dashboard:** A central hub for viewing key farm metrics.
*   **Crop Management:** Track and manage crop cycles, from planting to harvest.
*   **Inventory Management:** Keep a detailed record of farm inventory, including supplies and equipment.
*   **Financial Tracking:** Monitor farm-related income and expenses.
*   **Livestock Management:** (Future implementation) Manage livestock records.

## Technologies Used

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server for modern web projects.
*   **Material-UI:** A popular React UI framework for creating beautiful and responsive layouts.
*   **React Router:** For handling client-side routing.

### Backend

*   **Node.js:** A JavaScript runtime environment for building server-side applications.
*   **Express.js:** A minimal and flexible Node.js web application framework.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JWT (JSON Web Tokens):** For securing API endpoints.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v14 or later)
*   npm (v6 or later)
*   MongoDB (local or a cloud-based instance)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/AgriCore-ERP.git
    cd AgriCore-ERP
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd AgriCore
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd ../FarmBackend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    *   Navigate to the `FarmBackend` directory.
    *   Create a `.env` file in the `FarmBackend` directory and add the following environment variables:

        ```
        PORT=8000
        MONGODB_URI=<your_mongodb_connection_string>
        CORS_ORIGIN=*
        ACCESS_TOKEN_SECRET=<your_access_token_secret>
        ACCESS_TOKEN_EXPIRY=1d
        REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
        REFRESH_TOKEN_EXPIRY=10d
        ```

    *   Start the server:

        ```bash
        npm run dev
        ```

        The backend server will be running on `http://localhost:8000`.

2.  **Start the frontend development server:**

    *   Navigate to the `AgriCore` directory.
    *   Start the development server:

        ```bash
        npm run dev
        ```

        The frontend application will be accessible at `http://localhost:5173`.

## Project Structure

The project is organized into two main directories:

*   `AgriCore`: Contains the React frontend application.
*   `FarmBackend`: Contains the Node.js and Express.js backend application.

A brief overview of the directory structure:

```
AgriCore-ERP/
├── AgriCore/         # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── ...
└── FarmBackend/      # Backend Node.js application
    ├── src/
    │   ├── controllers/
    │   ├── db/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    └── ...
```

## API Endpoints

The backend API provides the following endpoints:

*   **User Authentication:**
    *   `POST /api/v1/users/register`: Register a new user.
    *   `POST /api/v1/users/login`: Log in a user.
    *   `POST /api/v1/users/logout`: Log out a user.

*   **Crops:**
    *   `GET /api/v1/crops`: Get all crops.
    *   `POST /api/v1/crops`: Create a new crop.
    *   `GET /api/v1/crops/:id`: Get a specific crop.
    *   `PUT /api/v1/crops/:id`: Update a crop.
    *   `DELETE /api/v1/crops/:id`: Delete a crop.

*   **Inventory:**
    *   `GET /api/v1/items`: Get all inventory items.
    *   `POST /api/v1/items`: Create a new item.
    *   `GET /api/v1/items/:id`: Get a specific item.
    *   `PUT /api/v1/items/:id`: Update an item.
    *   `DELETE /api/v1/items/:id`: Delete an item.

*   **Categories:**
    *   `GET /api/v1/categories`: Get all categories.
    *   `POST /api/v1/categories`: Create a new category.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
