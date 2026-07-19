# Product CRUD with RTK Query

A JavaScript-only React application connected to the iShop API.

## Run the project

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Reading and searching products works publicly. Protected create, update, and delete requests need a valid `accessToken` in local storage.

## RTK Query files

- `src/services/api.js` defines the shared RTK Query API.
- `src/services/product.js` injects all product CRUD endpoints.
- `src/lib/store.js` configures the Redux store, API reducer, and middleware.
- `src/StoreProvider.jsx` provides the Redux store to the application.
- `src/App.jsx` contains the product list, pagination, search, create/edit form, and delete confirmation.

The login interface has been removed. If an `accessToken` already exists in `localStorage`, it is automatically added to protected API requests as a bearer token.
# Mini_Project_React
