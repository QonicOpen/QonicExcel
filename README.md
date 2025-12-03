# Qonic Excel Add-In

Qonic is an Excel add-in that allows users to query model data and make modifications directly within Excel. Built using JavaScript and React, this add-in provides a seamless integration with Excel, enabling advanced data manipulation and interaction with your models.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and set up the Qonic Excel add-in, follow these steps:

### 1. Prerequisites

-	[Node.js](https://nodejs.org/)
-	A Qonic Application in the [Developer Portal](https://developer.qonic.com)

You’ll need:
- Client ID and Client Secret
- Whitelisted Redirect URI: https://localhost:3000/login.html

### 2.  Copy the environment template
```bash
cp .env.example .env
```

### 3. Configure .env
```bash
# From your Developer Portal application
QONIC_CLIENT_ID=YOUR_CLIENT_ID
QONIC_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### 3. Install Dependencies:
```bash
npm install
```

## Getting Started

To start the development server and run the add-in, use the following commands:

### 1. Start the Dev Server

The server is responsible for running the backend necessary for the add-in.

```bash
npm run server
```

### 2. Start the Add-in

This command starts your add-in and opens Excel with the add-in loaded.

```bash
npm start
```

## Usage

Once the add-in is loaded into Excel:

1. **Login**

   A login screen will appear when you open the add-in. Enter your credentials to authenticate.

2. **Select Model:**

   Choose the model you want to interact with from the dropdown list.

3. **Query Data:**

   Use the query interface to fetch model data. You can apply filters and criteria as needed.

4. **Modify Data:**

   After fetching data, you can make changes directly in Excel, and these changes will be synced back to the underlying model.

5. **Save and Sync:**

   Ensure that your modifications are saved and synchronized back to the data model by clicking the "Save" button.

## Development

For developers who want to contribute or modify the add-in:

- **Code Structure:**

  The project is organized into the following key folders:

  ```plaintext
  ├── assets/                # Contains static assets such as images and icons
  ├── src/                   # Main source code directory for the add-in
  │   ├── taskpane/          # Contains the main task pane functionality and related components
  │   │   ├── excel/         # Excel-specific utilities and functions
  │   │   ├── utils/         # General utility functions used across the task pane
  │   │   ├── components/    # React components used within the task pane
  ├── commands/              # Scripts and HTML files related to Excel commands
  ├── login/                 # Contains scripts and HTML for the login functionality

# Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix (git checkout -b feature-name).
3. Commit your changes (git commit -am 'Add some feature').
4. Push to the branch (git push origin feature-name).
5. Open a Pull Request.

# License

TODO