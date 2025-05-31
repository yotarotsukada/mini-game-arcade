# Setup Instructions for Remix Google Authentication

This guide will walk you through the necessary steps to set up and run this Remix application with Google Authentication.

## 1. Create the `.env` File

You'll need to create a `.env` file in the root directory of your project. This file will store your sensitive credentials and configuration.

Create a file named `.env` in the project root and add the following variables:

```
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
SESSION_SECRET="YOUR_STRONG_RANDOM_SESSION_SECRET"
```

## 2. Obtain Google OAuth Credentials

To enable Google login, you need to obtain OAuth 2.0 Client ID and Client Secret from the Google Cloud Console.

1.  **Go to the Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  **Create a new project** or select an existing one.
3.  **Navigate to "APIs & Services" > "Credentials"**.
    *   Click on "+ CREATE CREDENTIALS" and select "OAuth client ID".
    *   If prompted, configure the "OAuth consent screen" first.
        *   Choose "External" for User Type (unless you have a Google Workspace account and want to restrict it internally).
        *   Fill in the required application details (app name, user support email, developer contact information).
        *   For scopes, you can leave it as default for now, or add `email`, `profile`, `openid` if you want to be explicit.
        *   Add test users if your app is in "testing" mode (recommended during development).
4.  **Configure the OAuth Client ID**:
    *   Select **"Web application"** as the Application type.
    *   Give it a name (e.g., "Remix Auth App").
    *   **Authorized JavaScript origins**: Add the URL where your Remix app will be running during development.
        *   Example: `http://localhost:3000`
    *   **Authorized redirect URIs**: Add the callback URL that Google will redirect to after successful authentication. This must match the callback route implemented in the application.
        *   Example: `http://localhost:3000/auth/google/callback`
5.  **Create the credentials**. You will now see your `Client ID` and `Client Secret`.
6.  **Copy these values** into the respective `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` variables in your `.env` file.

## 3. Set the `SESSION_SECRET`

The `SESSION_SECRET` is used to sign and encrypt session cookies, ensuring their integrity and confidentiality.

*   This should be a **long, random, and strong string**. You can generate one using a password manager or a command-line tool like `openssl rand -hex 32`.
*   Replace `"YOUR_STRONG_RANDOM_SESSION_SECRET"` in your `.env` file with the generated secret.

## 4. Install Dependencies

If you haven't already, or if you are starting this project fresh, you'll need to install the necessary npm packages. The core dependencies for authentication were:

```bash
npm install remix-auth remix-auth-google remix-utils @remix-run/node
```
However, if you have the `package.json` from this project, simply running:
```bash
npm install
```
should install all required dependencies.

*(Note: During the development of this example, `remix-utils@^7.0.0` was used to resolve a peer dependency conflict with `react-router`. The `createCookieSessionStorage` was later sourced from `@remix-run/node` which is standard.)*

## 5. Run the Application

Once you have set up your `.env` file and installed the dependencies:

1.  **Start the Remix development server**:
    ```bash
    npm run dev
    ```
2.  **Open your browser** and navigate to the application, typically:
    [http://localhost:3000](http://localhost:3000)

You should now be able to see the application, log in using the "Login with Google" button, and see your user information displayed.

---

Remember to keep your `.env` file out of version control (e.g., add it to your `.gitignore` file) as it contains sensitive credentials.
