# Farm Rental Platform

A comprehensive **multi-application rental platform** for agricultural properties, equipment, and agritourism bookings built with modern microservices architecture.

## 🎯 Project Overview

This is a **production-grade** 4-application platform designed using best practices:

1. **🔧 Backend** - Java Spring Boot 3.x Microservices
   - User Service
   - Farm Listing Service (PostGIS geospatial)
   - Booking Service (Complex pricing logic)
   - Search Service (Elasticsearch)
   - API Gateway

2. **🌐 Frontend** - React.js Web Application
   - Advanced agricultural filters
   - Interactive Mapbox maps
   - Responsive Tailwind CSS design
   - Real-time search

3. **👨‍💼 Admin Panel** - React.js Administrative Dashboard
   - Land deed verification
   - Document review system
   - User management
   - Analytics & reports

4. **📱 Mobile App** - React Native
   - Location-based farm discovery
   - Geolocation integration
   - Offline-ready architecture

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Client Applications                      │
│  Web Frontend  │  Admin Panel  │  Mobile App         │
└────────────────┬────────────────┬───────────────────┘
                 │                │
            ┌────▼────────────────▼──────┐
            │     API Gateway :8080      │
            └────┬─────────────────────┘
                 │
    ┌────────────┼────────────┬──────────┐
    │            │            │          │
┌───▼──┐    ┌───▼──┐    ┌───▼──┐   ┌──▼────┐
│User  │    │Farm  │    │Book  │   │Search │
│Svc   │    │List  │    │ing   │   │Svc    │
│:8081 │    │:8082 │    │:8083 │   │:8084  │
└──┬───┘    └──┬───┘    └──┬───┘   └───┬───┘
   └─────┬─────┴──────┬────┴──────┬────┘
        ┌┴────────────▼──────────────┐
        │   PostgreSQL + PostGIS     │
        │   Elasticsearch            │
        │   Apache Kafka             │
        │   Redis Cache              │
        └────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (with PostGIS)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
mvn clean package
mvn spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```

### 5. Mobile
```bash
cd mobile-app
npm install
npm start
```

---

## 📁 Project Structure

```
FarmRentalPlatform/
├── backend/                    # Java Spring Boot microservices
│   ├── pom.xml
│   ├── user-service/
│   ├── farm-listing-service/   # PostGIS, geospatial queries
│   ├── booking-service/        # Lease calculator, pricing
│   ├── search-service/         # Elasticsearch
│   ├── api-gateway/
│   └── kafka-events/
│
├── frontend/                   # React.js web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FarmFilterSidebar.jsx    ← Advanced filters
│   │   │   └── FarmBoundaryMap.jsx      ← Mapbox integration
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
│
├── admin-panel/                # React.js admin dashboard
│   ├── src/
│   │   ├── components/
│   │   │   └── LandVerificationPanel.jsx
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── mobile-app/                 # React Native mobile
│   ├── src/
│   │   ├── screens/
│   │   ├── services/
│   │   └── navigation/
│   └── package.json
│
├── docker-compose.yml          # Infrastructure (PostgreSQL, Kafka, etc.)
├── ARCHITECTURE.md             # Complete system design
├── BACKEND_SETUP.md            # Backend detailed guide
├── FRONTEND_SETUP.md           # Frontend detailed guide
└── QUICKSTART.md               # Quick start guide
```

---

## ✨ Key Features

### Backend (Java Spring Boot)

✅ **Farm Listing Service with PostGIS**
- Geospatial queries (radius search, boundary intersection)
- Farm polygon boundaries
- Advanced filtering (acreage, soil type, water source)
- Location-based search

✅ **Booking Service with Complex Pricing**
- Seasonal lease calculator
- 10% discount for long-term leases (>12 months)
- 15% premium for high-demand seasons (KHARIF/RABI)
- Machinery rental aggregation
- Detailed price breakdown

✅ **Kafka Event-Driven Architecture**
- FARM_LEASED
- MACHINERY_RESERVED
- USER_REGISTRATION
- FARM_LISTING_VERIFIED
- PAYMENT_PROCESSED

### Frontend (React.js)

✅ **FarmFilterSidebar Component**
- Acreage range slider (5-500 acres)
- Water availability filters
- Land suitability tags
- Budget range slider
- 400ms debounced API calls
- Responsive design

✅ **FarmBoundaryMap Component**
- Mapbox GL visualization
- Interactive farm boundaries
- Satellite view toggle
- Site visit request popup
- Location markers

✅ **Advanced Search**
- Combined filters
- Map-based view
- Grid/List toggle
- Pagination

### Admin Panel (React.js)

✅ **Land Verification Dashboard**
- Pending verification list
- Document preview (PDFs)
- Inline verification form
- Approve/Reject/Request actions
- Success notifications
- Audit trail

### Mobile App (React Native)

✅ **Farm Discovery**
- Location-based search
- Farm filtering
- Detail pages
- Offline support
- Push notifications

---

## 🔑 Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend Language** | Java 17 | Type-safe, performant |
| **Framework** | Spring Boot 3.x | Microservices, rapid development |
| **ORM** | Spring Data JPA | Database abstraction |
| **Geospatial** | PostGIS | Spatial queries |
| **Database** | PostgreSQL | Reliable, feature-rich |
| **Search** | Elasticsearch | Full-text, faceted search |
| **Messaging** | Apache Kafka | Asynchronous events |
| **Frontend** | React 18 | Component-based UI |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Build** | Vite | Fast bundling |
| **Maps** | Mapbox GL | Interactive mapping |
| **State** | Zustand | Lightweight state management |
| **Mobile** | React Native | Cross-platform |

---

## 📊 Database Schema Highlights

### Farm Listings
```sql
CREATE TABLE farm_listings (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  acreage DOUBLE PRECISION,
  water_source ENUM (BOREWELL, CANAL, RAINFALL_DEPENDENT),
  soil_type ENUM (BLACK_COTTON, ALLUVIAL, RED, SANDY),
  location GEOMETRY(Point, 4326),      -- Latitude/Longitude
  boundary GEOMETRY(Polygon, 4326),    -- Farm perimeter
  status ENUM (PENDING, ACTIVE, LEASED),
  created_date TIMESTAMP
);
```

---

## 💰 Lease Calculation Example

```
Input:
  Base Price: ₹10,000/acre
  Acreage: 50 acres
  Duration: 14 months (long-term)
  Season: KHARIF (high-demand)
  Machinery: ₹500,000

Calculation:
  Base Cost = 10,000 × 50 × 14 = ₹7,000,000
  After Discount (10%) = ₹6,300,000
  After Premium (15%) = ₹7,245,000
  + Machinery Cost = ₹500,000
  Subtotal = ₹7,745,000
  Deposit (3 months) = ₹1,500,000
  Processing Fees (5%) = ₹387,250
  
GRAND TOTAL = ₹9,632,250
```

---

## 🔌 API Endpoints

### Farm Service
```
GET    /api/v1/farms/status/active
GET    /api/v1/farms/{id}
GET    /api/v1/farms/search/location?latitude=X&longitude=Y&radiusKm=50
GET    /api/v1/farms/search/acreage?min=10&max=100
GET    /api/v1/farms/search/soil-type?type=BLACK_COTTON
POST   /api/v1/farms
PUT    /api/v1/farms/{id}
DELETE /api/v1/farms/{id}
```

### Booking Service
```
POST   /api/v1/bookings/calculate-quote
POST   /api/v1/bookings
GET    /api/v1/bookings/{id}
GET    /api/v1/bookings/user/{userId}
POST   /api/v1/bookings/{farmId}/site-visit-request
```

### Admin Service
```
GET    /api/v1/admin/verifications/pending
POST   /api/v1/admin/verifications/submit
GET    /api/v1/admin/statistics/users
GET    /api/v1/admin/statistics/bookings
```

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system design, database schema, event definitions
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend configuration, testing, deployment
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Frontend components, state management, optimization
- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step setup guide

---

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🐳 Docker Support

All services are Docker-ready:

```bash
# Start infrastructure
docker-compose up -d

# Access points:
# PostgreSQL: localhost:5432
# Elasticsearch: localhost:9200
# Kafka: localhost:9092
# Redis: localhost:6379
# pgAdmin: http://localhost:5050
# Kafdrop: http://localhost:9000
```

---

## 🚀 Deployment

### Production Build
```bash
# Backend
mvn clean package -DskipTests -P prod

# Frontend
npm run build

# Mobile
expo build:android
expo build:ios
```

---

## 📋 Checklist for Getting Started

- [ ] Clone the repository
- [ ] Install prerequisites (Java 17, Node 18, Docker)
- [ ] Run `docker-compose up -d`
- [ ] Setup PostgreSQL & enable PostGIS
- [ ] Build backend with Maven
- [ ] Start all 4 applications
- [ ] Access frontend at http://localhost:5173
- [ ] View API docs at http://localhost:8080/swagger-ui.html
- [ ] Explore admin panel at http://localhost:5174
- [ ] Test mobile app with Expo

---

## 🎯 Reference Project

**Inspired by**: NoBroker.in  
- Brokerage-free property platform
- Focus on landlord-tenant connections
- Document verification system
- Location-based discovery

---

## 📞 Support & Questions

Refer to the comprehensive documentation:
1. Start with [QUICKSTART.md](./QUICKSTART.md)
2. For backend details: [BACKEND_SETUP.md](./BACKEND_SETUP.md)
3. For frontend details: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
4. For architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📝 License

MIT License - Feel free to use this for learning, development, and deployment.

---

## ✅ Status

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready

---

**Built with ❤️ for modern agricultural rental platforms**
