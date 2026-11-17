# Qonic Excel Add-In

Qonic is an Excel add-in that allows users to query model data and make modifications directly within Excel. Built using JavaScript and React, this add-in provides a seamless integration with Excel, enabling advanced data manipulation and interaction with your models.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Using your own app registration](#using-your-own-app-registration)
- [Hosting the add-in for your organization](#hosting-the-add-in-for-your-organization)
- [Troubleshooting](#troubleshooting)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

These steps run the add-in from your own computer, to try it out or work on it. To roll it out to other people, see [Hosting the add-in for your organization](#hosting-the-add-in-for-your-organization).

### 1. Prerequisites

-	[Node.js](https://nodejs.org/) (the version in `.nvmrc`)
-	A Qonic account

You don't need a client ID, a client secret or an application on the developer portal: by default the add-in signs in with Qonic's built-in Excel client.

### 2. Copy the environment template
```bash
cp .env.example .env
```

Leave `QONIC_CLIENT_ID` empty unless you [use your own app registration](#using-your-own-app-registration).

### 3. Install dependencies
```bash
npm install
```

## Getting Started

### 1. Start the dev server

This serves the add-in's files on `https://localhost:3000`. The add-in has no backend of its own: it calls the Qonic Public API directly. Keep the server running while you use the add-in.

```bash
npm run server
```

The first run installs a development certificate for `localhost` for the user who starts the server. Start the server under the same Windows account that runs Excel (see [Troubleshooting](#troubleshooting)).

### 2. Start the add-in

This opens Excel with the add-in loaded.

```bash
npm start
```

## Using your own app registration

Only do this if you want the sign-in to go through an application your organization owns on the [developer portal](https://developer.qonic.com/), for example when you [host the add-in yourself](#hosting-the-add-in-for-your-organization).

1. On the developer portal, create an application and tick **Public client (SPA / native app)**. The add-in can't keep a client secret, so it never sends one: an application that isn't a public client fails when the sign-in exchanges its code for a token.
2. Add the redirect URI the add-in uses. It must match exactly, including the port:
   - running locally: `https://localhost:3000/login.html`
   - hosted: `https://<your-host>/login.html`
3. Set the client ID in `.env`:
   ```bash
   QONIC_CLIENT_ID=YOUR_CLIENT_ID
   ```
4. Restart `npm run server` (or rebuild): the value is read when the server starts.

## Hosting the add-in for your organization

Running the dev server is for development. To give the add-in to other people, host its files on a web server and deploy it through Microsoft 365. Users then need no Node.js, no dev server, no admin rights and no development certificate.

1. **Pick the address.** The add-in must be served from the root of an HTTPS address with a trusted certificate, such as `https://excel.example.com/`, not from a subfolder like `https://example.com/excel/`.
2. **Register an application** as described in [Using your own app registration](#using-your-own-app-registration), with redirect URI `https://<your-host>/login.html`.
3. **Configure `.env`:**
   ```bash
   QONIC_CLIENT_ID=YOUR_CLIENT_ID
   ADDIN_URL=https://excel.example.com/
   ```
4. **Build:**
   ```bash
   npm run build
   ```
   This writes the add-in to `dist/`, including a `manifest.xml` that points to `ADDIN_URL`. The build stops with an error if `ADDIN_URL` is missing or isn't the root of an HTTPS address.
5. **Host** the contents of `dist/` as static files at `ADDIN_URL`. No server-side code is needed.
6. **Deploy** `dist/manifest.xml` from the [Microsoft 365 admin center](https://admin.microsoft.com/) under **Settings → Integrated apps → Upload custom apps**, and assign it to the users or groups that need it. It can take up to a day before the add-in shows up in Excel.

To update, rebuild and replace the hosted files. Upload the manifest again only when `manifest.xml` changed.

## Troubleshooting

**"Add-in content is blocked" / the task pane stays empty when running locally.** Windows doesn't trust the development certificate for the account that runs Excel. In the add-in folder, under that account, run:

```bash
npx office-addin-dev-certs verify
```

If it isn't installed, run `npx office-addin-dev-certs install`, then restart the dev server and Excel.

**The sign-in window closes or shows an error straight away.** The redirect URI is not registered for the client in use, so the Qonic sign-in rejects it with "redirect uris are not whitelisted". If you set `QONIC_CLIENT_ID`, add the exact redirect URI (see [Using your own app registration](#using-your-own-app-registration)), or empty `QONIC_CLIENT_ID` to use the built-in client, then restart the dev server.

**Sign-in seems to work but fails at the end.** Your application on the developer portal isn't a public client. Create one with **Public client (SPA / native app)** ticked.

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
