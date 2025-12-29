
# Lost and Found App

## Project setup

### Supabase setup[https://supabase.com](https://supabase.com)
2. When prompted, enter a project name (e.g., "lost-and-found-app")
3. Create a strong database password (you'll need this for database access)
4. Choose a region closest to your users
5. Wait for your project to be created

## Get your Supabase credentials

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

