# 🌟 Neon Payment Website

A stunning 3-page payment website with neon aesthetics, featuring bKash integration, custom cursor particles, and smooth animations.

## ✨ Features

- **🎨 Neon Design**: Pure black background with vibrant neon glows and effects
- **💳 Payment Integration**: bKash API integration with backend proxy (Nagad placeholder)
- **🎯 Custom Cursor**: Interactive fire/water particle effects following mouse movement
- **📱 Responsive**: Fully responsive design optimized for all devices
- **⚡ Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **🔒 Secure**: Backend proxy prevents credential exposure to client
- **📊 Invoice System**: Dynamic invoice generation with unique IDs

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd neon-payment-website

# Install client dependencies
npm install

# Install server dependencies  
cd server
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your bKash credentials (sandbox included)

# Return to root directory
cd ..
```

### Development

```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
# Terminal 1 - Client (http://localhost:8080)
npm run dev:client

# Terminal 2 - Server (http://localhost:3001)  
npm run dev:server
```

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── CustomCursor.tsx      # Custom cursor with particles
│   │   ├── NeonLogo.tsx          # Animated neon logo
│   │   ├── ParticleCanvas.tsx    # Fire/water particle system
│   │   └── PaymentMethodModal.tsx # How to pay modal
│   ├── pages/
│   │   ├── Home.tsx              # Name + amount form
│   │   ├── Pay.tsx               # Payment method selection
│   │   └── Success.tsx           # Success + invoice display
│   ├── store/
│   │   └── paymentStore.ts       # Zustand state management
│   └── ...
├── server/
│   ├── routes/
│   │   ├── bkash.js              # bKash API integration
│   │   └── nagad.js              # Nagad placeholder routes
│   ├── data/
│   │   └── payments.json         # Payment records storage
│   └── index.js                  # Express server
└── ...
```

## 🎨 Design System

The project uses a comprehensive neon design system defined in `src/index.css`:

- **Colors**: HSL-based neon palette (red, blue, pink, green, orange)
- **Effects**: Custom glow utilities with box-shadow layers
- **Animations**: Pulse, float, shimmer effects
- **Typography**: Neon text glow effects
- **Components**: Themed input fields, buttons, and cards

### Custom Utilities

```css
.neon-ring-red        # Neon red circular glow
.neon-blue-input      # Neon blue input styling
.neon-pink-btn        # Neon pink button with hover effects
.neon-green-card      # Neon green card glow
.neon-orange-card     # Neon orange card glow
.neon-text-glow       # Text shadow glow effect
.pulse-glow           # Animated pulsing glow
```

## 🔧 Configuration

### bKash Setup

1. Copy `server/.env.example` to `server/.env`
2. Add your bKash sandbox credentials:

```env
BKASH_USERNAME=
BKASH_PASSWORD=2_
BKASH_APP_KEY=
BKASH_APP_SECRET=
PORT=3001
```

### Particle Effects

Toggle between Fire and Water particle modes using the floating button in the bottom-right corner.

## 📱 Pages & Flow

### 1. Home (`/`)
- Neon logo with pulsing red ring
- Name input (min 2 chars, required)
- Amount input (number, >0, formats to 2 decimals)
- Neon pink "Pay Now" button
- Form validation with error toasts

### 2. Pay (`/pay`)
- Payment method selection
- bKash integration (functional)
- Nagad placeholder (toast message)
- "How to Pay" modal with step-by-step guide
- Real-time payment processing

### 3. Success (`/success`)
- Success animation with checkmark
- Thank you message
- Dynamic invoice ID display
- Copy invoice ID functionality
- "Make Another Payment" button

## 🔌 API Endpoints

### bKash Routes (`/api/bkash/`)

```bash
POST /api/bkash/token     # Get/refresh access token
POST /api/bkash/create    # Create payment session  
POST /api/bkash/execute   # Execute/complete payment
```

### Nagad Routes (`/api/nagad/`)

```bash
POST /api/nagad/token     # Placeholder for future implementation
POST /api/nagad/create    # Placeholder for future implementation
POST /api/nagad/execute   # Placeholder for future implementation
```

### Utility Routes

```bash
GET  /api/health          # Server health check
POST /api/payment/record  # Record payment to payments.json
```

## 🎯 Invoice System

Invoice IDs are generated using the format: `{slugifiedName}-{random4}`

- **slugifiedName**: Name converted to lowercase, non-alphanumeric chars removed, max 12 chars
- **random4**: 4-digit random number (1000-9999)
- **Example**: `john-doe-4827`

## 🔒 Security Features

- Backend API proxy prevents credential exposure
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Environment variable protection
- No sensitive data in client bundle

## 🚀 Deployment

### Client (Frontend)
The React app can be deployed to any static hosting service:
- Vercel, Netlify, GitHub Pages
- Build with `npm run build`

### Server (Backend)
The Express server can be deployed to:
- Heroku, Railway, Render
- VPS with PM2
- Docker containers

## 🎨 Customization

### Colors
Edit `src/index.css` to modify the neon color palette:

```css
--neon-red: 0 100% 50%;
--neon-blue: 220 100% 50%;
--neon-pink: 320 100% 60%;
```

### Particle Effects
Modify `src/components/ParticleCanvas.tsx` to change:
- Particle count and behavior
- Color schemes
- Physics parameters

### Animations
Update `tailwind.config.ts` to add new animations or modify existing ones.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the GitHub Issues
- Review the documentation
- Contact the development team

---

Built with ❤️ using React, Express, and lots of neon! ✨
