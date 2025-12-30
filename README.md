


1. Once your project is created, go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" in the submenu
4. You'll find your "Project URL" and "anon public" key here
5. Copy these values to use in your .env file

### Configure your application

Update your `.env` file with the credentials from Supabase:

```
VITE_SUPABASE_URL=your_project_url_from_supabase
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase
```

## Development

```sh
# Install dependencies
npm i

# Start the development server
npm run dev
```

## Features

- User authentication with Supabase
- Report lost or found items with image upload
- Search and browse lost and found items
- Dashboard to manage your reported items

