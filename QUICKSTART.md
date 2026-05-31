# Quick Start Guide

## 🎯 Project Overview

A complete **4-Application Farm Rental Platform**:

1. **Backend** - Java Spring Boot Microservices
2. **Frontend** - React.js Web Application  
3. **Admin Panel** - React.js Administrative Dashboard
4. **Mobile App** - React Native Mobile Application

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Java 17** or higher
- **Node.js 18+** and npm
- **PostgreSQL 15+** (with PostGIS)
- **Docker & Docker Compose**
- **Apache Kafka 3.x**
- **Elasticsearch 8.x**
- **Git**

---

## 🚀 Quick Start (Docker Compose)

### 1. Start Infrastructure

```bash
cd FarmRentalPlatform
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- PostGIS extension
- Elasticsearch (port 9200)
- Kafka (port 9092)

### 2. Build & Start Backend

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Services will start on:
- API Gateway: http://localhost:8080
- Farm Listing Service: http://localhost:8082
- Booking Service: http://localhost:8083

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

### 4. Start Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```

Access at: http://localhost:5174

### 5. Start Mobile App

```bash
cd mobile-app
npm install
npm start
```

Scan QR code with Expo app or open in browser

---

## 📁 Project Structure

```
FarmRentalPlatform/
├── backend/                          # Java Spring Boot Microservices
│   ├── pom.xml (parent)
│   ├── user-service/
│   ├── farm-listing-service/        # Core: PostGIS, geospatial queries
│   ├── booking-service/             # Lease calculator, pricing logic
│   ├── search-service/              # Elasticsearch integration
│   ├── api-gateway/
│   └── kafka-events/                # Event definitions
│
├── frontend/                         # React.js Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── FarmFilterSidebar.jsx     # Advanced filters, debounce
│   │   │   └── FarmBoundaryMap.jsx       # Mapbox integration
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── FarmService.js
│   │   │   └── BookingService.js
│   │   └── hooks/
│   └── package.json
│
├── admin-panel/                      # React.js Admin Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   └── LandVerificationPanel.jsx # Document verification
│   │   ├── services/
│   │   │   └── AdminService.js
│   │   └── App.jsx
│   └── package.json
│
├── mobile-app/                       # React Native Mobile
│   ├── src/
│   │   ├── screens/
│   │   │   └── FarmListScreen.js    # Mobile farm listing
│   │   ├── services/
│   │   │   └── MobileFarmService.js
│   │   └── App.js
│   └── package.json
│
├── docker-compose.yml                # Infrastructure
├── ARCHITECTURE.md                   # Full system design
├── BACKEND_SETUP.md                  # Backend detailed guide
└── FRONTEND_SETUP.md                 # Frontend detailed guide
```

---

## 🔑 Key Features Implemented

### Backend (Java Spring Boot)

✅ **Farm Listing Service**
- PostGIS geospatial queries
- Farm boundary polygon support
- Advanced filtering (acreage, soil type, water source)
- Location-based search (radius)

✅ **Booking Service**
- Complex lease calculation logic
- 10% discount for long-term leases (>12 months)
- 15% premium for high-demand seasons
- Machinery rental aggregation
- Detailed price breakdown

✅ **Kafka Events**
- FARM_LEASED
- MACHINERY_RESERVED
- USER_REGISTRATION
- FARM_LISTING_VERIFIED
- PAYMENT_PROCESSED

### Frontend (React.js)

✅ **FarmFilterSidebar**
- Acreage range slider
- Water availability filters
- Land suitability tags
- Budget range slider
- 400ms debounce for API calls

✅ **FarmBoundaryMap**
- Mapbox GL visualization
- Farm polygon boundaries
- Marker with popup details
- Satellite view toggle
- Site visit request button

✅ **Farm Search & Discovery**
- Advanced filtering
- Location-based search
- Grid/List view options
- Pagination

### Admin Panel (React.js)

✅ **Land Verification Dashboard**
- Pending verifications list
- Document preview (Land Deed, Soil Reports)
- Inline modal with verification form
- Approve/Reject/Request Re-upload actions
- Success notifications

### Mobile App (React Native)

✅ **Farm Discovery**
- Browse available farms
- Filter by water source
- Water availability indicators
- Pricing display
- Detail navigation

---

## 📡 API Endpoints

### Farm Listing Service

```
GET    /api/v1/farms/status/active
GET    /api/v1/farms/{id}
GET    /api/v1/farms/search/location?latitude=X&longitude=Y&radiusKm=50
GET    /api/v1/farms/search/acreage?minAcreage=10&maxAcreage=100
GET    /api/v1/farms/search/soil-type?soilType=BLACK_COTTON
POST   /api/v1/farms
PUT    /api/v1/farms/{id}
DELETE /api/v1/farms/{id}
GET    /api/v1/farms/owner/{ownerId}
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

## 🗄️ Database

### PostgreSQL Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE farm_rental_db;

# Connect to database
\c farm_rental_db

# Enable PostGIS
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

# Verify
SELECT PostGIS_Version();
```

---

## 🔧 Configuration Files

### Backend: application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/farm_rental_db
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.spatial.dialect.postgis.PostgisDialect
  kafka:
    bootstrap-servers: localhost:9092
  elasticsearch:
    rest:
      uris: http://localhost:9200
```

### Frontend: .env

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
VITE_APP_NAME=Farm Rental Platform
```

---

## 💻 Development Workflow

### Backend Development

```bash
# Start specific service
cd backend/farm-listing-service
mvn spring-boot:run

# Or use IDE
# File > Open > FarmRentalPlatform/backend
# Run > Run Application
```

### Frontend Development

```bash
cd frontend
npm run dev
# Hot reload enabled - changes reflect instantly
```

### Admin Panel Development

```bash
cd admin-panel
npm run dev
# Hot reload enabled
```

### Mobile App Development

```bash
cd mobile-app
npm start
# Scan QR with Expo Go app
```

---

## 📚 Documentation

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system design & technical details
2. **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend microservices guide
3. **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Frontend component guide

---

## 🧪 Testing

### Backend Tests

```bash
cd backend/farm-listing-service
mvn test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Check PostGIS
psql -U postgres -d farm_rental_db -c "SELECT PostGIS_Version();"
```

### Kafka Connection Error

```bash
# Check Kafka broker
kafka-broker-api-versions.sh --bootstrap-server localhost:9092

# Create topic if needed
kafka-topics.sh --bootstrap-server localhost:9092 --create --topic farm-events
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

---

## 📦 Deployment

### Production Build

```bash
# Backend
cd backend
mvn clean package -DskipTests -P prod

# Frontend
cd frontend
npm run build
# Output in dist/ folder

# Mobile
cd mobile-app
expo build:android
```

### Docker Deployment

All services are Docker-ready:

```bash
docker-compose -f docker-compose.yml up -d
```

---

## 🔗 Resource Links

- **Backend**: http://localhost:8080/swagger-ui.html
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **PostgreSQL**: localhost:5432
- **Elasticsearch**: http://localhost:9200
- **Kafka**: localhost:9092

---

## 📝 Sample Data

### Create Test Farm

```sql
INSERT INTO farm_listings (
  title, description, owner_id, price_per_month, acreage,
  water_source, soil_type, location, status
) VALUES (
  'Premium Farm - Bangalore',
  ' 50 acres with irrigation facility',
  'owner-001',
  50000.00,
  50.0,
  'BOREWELL',
  'BLACK_COTTON',
  ST_GeomFromText('POINT(77.5946 12.9352)', 4326),
  'ACTIVE'
);
```

---

## 🎯 Next Steps

1. **Explore the code** - Check documentation in each module
2. **Run tests** - Verify everything works: `mvn test`, `npm test`
3. **Create sample data** - Load test farms and users
4. **Test APIs** - Use Swagger UI or Postman
5. **Build features** - Add new microservices or UI components

---

## 📞 Support

For issues or questions:
1. Check relevant documentation (ARCHITECTURE.md, BACKEND_SETUP.md, FRONTEND_SETUP.md)
2. Review error logs
3. Verify all prerequisites are installed
4. Check service connectivity

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✅
