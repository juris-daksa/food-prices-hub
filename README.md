# Food Prices Hub

Food Prices Hub is a web application that allows users to track and compare food prices from various stores. 

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/juris-daksa/food-prices-hub.git
    ```
2. Provide a `.env` file (see [requirements](#requirements)).
3. For the API server:

    a. In a new terminal instance navigate to server directory.
    ```bash
    cd food-prices-hub/server
    ```
    b. Install dependencies
    ```bash
    npm install
    ```
    c. Start the app.
    ```bash
    npm start
    ```
4. For the client:

    a. Navigate to project directory.
    ```bash
    cd food-prices-hub
    ```
    b. Install dependencies.
    ```bash
    npm install
    ```
    c. Run Webpack.
    ```bash
    npx webpack
    ```
    d. Start the client.
    ```bash
    npm start
    ```
5. Finally, navigate to your client app in a browser (default URL is `http://localhost:3000`).


## Usage

1. Open your web browser and go to `http://localhost:3000`.
2. Use the search bar to find food items.
3. Sort the results by clicking on the column headers. 

## Requirements

- A PostgreSQL database instance is required.
- A `.env` file needs to be provided inside project root directory with the following environment variables:
    ```plaintext
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    
    API_SERVER_PORT=5000
    UI_LOCAL_HOST=http://localhost:3000
    UI_PUBLIC_HOST=http://public.host
    
    REACT_APP_API_HOST=http://localhost:5000    // Your database API endpoint
    ```
- Data. Use [food-prices-scraper](https://github.com/juris-daksa/food-prices-scraper) to collect some.
- Basic understanding of Latvian language.
## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.