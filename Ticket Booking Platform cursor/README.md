# EventHub - Modern Ticket Booking Platform

A full-stack event ticket booking platform built with Next.js 15, React Server Components, Tailwind CSS, shadcn/ui, and Supabase.

## 🚀 Features

### Core Functionalities
- **Landing Page**: Hero section, platform overview, feature highlights, testimonials
- **Event Discovery**: Search and filter by categories, ongoing/upcoming events tabs
- **Event Details**: Comprehensive event information with booking functionality
- **Multi-step Booking Flow**: Attendee form, payment integration, confirmation
- **Digital Tickets**: QR code generation and email delivery
- **Admin Panel**: Dashboard, event management, booking management, analytics
- **Responsive Design**: Mobile-first, accessible, and SEO-friendly

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React Server Components
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Forms**: React Hook Form with Zod validation
- **Payments**: PayU integration (configurable)
- **Email**: SendGrid integration
- **Charts**: Recharts for analytics
- **QR Codes**: QR code generation for tickets

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- SendGrid account (optional)
- PayU account (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ticket-booking-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Email Service (SendGrid)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com

   # Payment Gateway (PayU or similar)
   PAYU_MERCHANT_ID=your_payu_merchant_id
   PAYU_SECRET_KEY=your_payu_secret_key
   PAYU_SANDBOX_MODE=true

   # App Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase project:

   ```sql
   -- Events table
   CREATE TABLE events (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     date DATE NOT NULL,
     time TIME NOT NULL,
     venue TEXT NOT NULL,
     category TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     ticket_count INTEGER NOT NULL,
     available_tickets INTEGER NOT NULL,
     status TEXT DEFAULT 'upcoming',
     image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Bookings table
   CREATE TABLE bookings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     event_id UUID REFERENCES events(id),
     attendee_name TEXT NOT NULL,
     attendee_email TEXT NOT NULL,
     attendee_phone TEXT NOT NULL,
     attendee_gender TEXT NOT NULL,
     attendee_age INTEGER NOT NULL,
     attendee_address TEXT NOT NULL,
     payment_status TEXT DEFAULT 'pending',
     payment_amount DECIMAL(10,2) NOT NULL,
     qr_code TEXT NOT NULL,
     status TEXT DEFAULT 'confirmed',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Admin profiles table
   CREATE TABLE admin_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     role TEXT DEFAULT 'admin',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Analytics events table
   CREATE TABLE analytics_events (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     page TEXT NOT NULL,
     action TEXT NOT NULL,
     metadata JSONB,
     user_id UUID
   );

   -- Enable Row Level Security
   ALTER TABLE events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
   CREATE POLICY "Bookings are viewable by admin" ON bookings FOR SELECT USING (auth.role() = 'admin');
   CREATE POLICY "Admin profiles are viewable by admin" ON admin_profiles FOR SELECT USING (auth.role() = 'admin');
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── events/            # Event pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── booking-form.tsx  # Booking form
│   ├── event-card.tsx    # Event card component
│   └── ...
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   └── sample-data.ts    # Sample data
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎯 Key Features

### Event Discovery
- Search and filter events by category
- View ongoing and upcoming events
- Responsive event cards with pricing
- Real-time availability updates

### Booking System
- Multi-step booking process
- Form validation with Zod
- Secure payment processing
- Digital ticket generation
- Email confirmation

### Admin Panel
- Dashboard with metrics
- Event management (CRUD)
- Booking management
- Analytics and reporting
- User management

### Security & Performance
- Row Level Security (RLS)
- Input validation
- Optimized queries
- Image optimization
- Mobile responsive

## 🎨 Customization

### Styling
The project uses Tailwind CSS with shadcn/ui components. You can customize:

- Colors in `tailwind.config.js`
- Component styles in `components/ui/`
- Global styles in `app/globals.css`

### Sample Data
Edit `lib/sample-data.ts` to modify:
- Event categories
- Sample events
- Pricing ranges
- Event descriptions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Analytics

The platform includes built-in analytics tracking:
- Page views
- User interactions
- Event performance
- Revenue tracking

## 🔧 Configuration

### Payment Gateway
Currently configured for PayU, but easily adaptable to:
- Stripe
- PayPal
- Razorpay
- Other payment providers

### Email Service
Configured for SendGrid, but supports:
- Nodemailer
- AWS SES
- Mailgun
- Other email providers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Supabase for the backend services
- shadcn/ui for the beautiful components
- Tailwind CSS for the utility-first styling

---

Built with ❤️ using modern web technologies 