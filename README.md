# Expresser Sweepstakes Admin

A Progressive Web App (PWA) built with Vue.js, Vuetify, and Supabase for managing sweepstakes entries. This admin interface allows administrators to view entries, select winners randomly, export data to CSV, and manage the sweepstakes database.

## 🚀 Features

- **Dark Mode Mobile-First Design** - Optimized for iPhone usage with a beautiful dark theme
- **Progressive Web App** - Installable on mobile devices with offline capabilities
- **Real-time Database** - Connected to Supabase for real-time data management
- **Random Winner Selection** - Fair and random winner drawing with automatic marking
- **CSV Export** - Download all entries as a CSV file
- **Database Management** - Clear database functionality for new contests
- **Responsive Design** - Works perfectly on all device sizes

## 🛠 Tech Stack

- **Frontend**: Vue.js 3 + TypeScript
- **UI Framework**: Vuetify 3 (Material Design)
- **Build Tool**: Vite
- **Database**: Supabase
- **Deployment**: GitHub Pages
- **PWA**: Vite PWA Plugin

## 📱 Live Demo

The app is deployed at: [https://flintshadey.github.io/expressersweepstakesadmin](https://flintshadey.github.io/expressersweepstakesadmin)

## 🏗 Setup & Development

### Prerequisites

- Node.js (version 18.3 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/FlintShadey/expressersweepstakesadmin.git
   cd expressersweepstakesadmin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   The app uses environment variables for Supabase configuration. Create a `.env` file:

   ```env
   VITE_SUPABASE_URL=https://ceyopueguqklwwdjkvcf.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🗄 Database Schema

The app connects to a Supabase database with the following table structure:

```sql
CREATE TABLE public.sweepstakes_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone_number character varying NOT NULL,
  entry_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  entry_source character varying NOT NULL DEFAULT 'web'::character varying,
  is_winner boolean DEFAULT false,
  notes text,
  CONSTRAINT sweepstakes_entries_pkey PRIMARY KEY (id)
);
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The project is configured for automatic deployment to GitHub Pages:

1. **GitHub Actions Workflow** - Automatically builds and deploys on pushes to main branch
2. **Base Path Configuration** - Properly configured for GitHub Pages subdirectory deployment
3. **Production Environment** - Uses production environment variables

### Manual Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 📱 PWA Features

- **Installable** - Can be installed as a native app on mobile devices
- **Offline Support** - Basic offline functionality with service worker
- **Mobile Optimized** - Designed primarily for iPhone usage
- **Dark Theme** - Beautiful dark mode interface
- **Fast Loading** - Optimized for quick loading on mobile networks

## 🎮 Usage

### Admin Dashboard

1. **View Statistics** - See total entries, winners, today's entries, and win rate
2. **Quick Actions**:
   - **Draw Winner** - Randomly select a winner from non-winning entries
   - **Export CSV** - Download all entries as a CSV file
   - **Clear Database** - Remove all entries (with confirmation)

### Entry Management

- **View All Entries** - Browse all sweepstakes entries in a data table
- **Search Functionality** - Search through entries by name, phone, etc.
- **Mark Winners** - Manually mark entries as winners
- **Delete Entries** - Remove individual entries

## 🔧 Configuration

### Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Build Configuration

The app is configured with:

- **Base Path** - `/expressersweepstakesadmin/` for GitHub Pages
- **PWA Configuration** - Service worker and manifest generation
- **TypeScript Support** - Full TypeScript configuration
- **ESLint & Prettier** - Code quality and formatting

## 🛡 Security

- **Environment Variables** - Sensitive data stored in environment variables
- **Supabase RLS** - Row Level Security should be configured in Supabase
- **HTTPS Only** - Designed to work over HTTPS connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For support and questions, please contact the development team.

---

**Expresser Sweepstakes Admin** - Making sweepstakes management simple and mobile-friendly!
