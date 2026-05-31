# Farm Rental Platform - Complete System Architecture

## 📋 Project Overview

A comprehensive multi-application rental platform for agricultural properties, equipment, and agritourism bookings. Built with modern microservices architecture and responsive frontends.

---

## 🏗️ System Architecture

### Core Services

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                   (Port 8080)                               │
└──────────────┬──────────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────────┬──────────────┐
    │          │          │              │              │
┌───▼──┐   ┌──▼───┐  ┌───▼──┐    ┌─────▼────┐  ┌─────▼────┐
│User  │   │Farm  │  │Book  │    │ Search   │  │Kafka     │
│Svc   │   │List  │  │ing   │    │Service   │  │Events    │
│:8081 │   │Svc   │  │Svc   │    │:8084     │  │:9092     │
│      │   │:8082 │  │:8083 │    │          │  │          │
└──────┘   └──────┘  └──────┘    └──────────┘  └──────────┘
    │          │          │              │
    └──────────┴──────────┴──────────────┘
               │
        ┌──────▼──────┐
        │  PostgreSQL  │
        │  with PostGIS│
        │  :5432       │
        └──────────────┘
               │
        ┌──────▼──────┐
        │ Elasticsearch│
        │  :9200       │
        └──────────────┘
```

---

## 📁 Project Structure

```
FarmRentalPlatform/
├── backend/
│   ├── pom.xml (parent)
│   ├── user-service/
│   │   ├── src/main/java/com/farmrental/userservice/
│   │   ├── pom.xml
│   │   └── application.yml
│   │
│   ├── farm-listing-service/
│   │   ├── src/main/java/com/farmrental/farmlistingservice/
│   │   │   ├── entity/FarmListing.java (with PostGIS spatial data)
│   │   │   ├── repository/FarmListingRepository.java (PostGIS queries)
│   │   │   ├── service/FarmListingService.java
│   │   │   ├── controller/FarmListingController.java
│   │   │   └── dto/FarmListingDTO.java
│   │   ├── resources/application.yml
│   │   └── pom.xml
│   │
│   ├── booking-service/
│   │   ├── src/main/java/com/farmrental/bookingservice/
│   │   │   ├── entity/Booking.java
│   │   │   ├── entity/LeaseAgreement.java
│   │   │   ├── service/FarmLeaseCalculatorService.java (complex pricing logic)
│   │   │   ├── dto/LeaseQuoteDTO.java
│   │   │   ├── controller/BookingController.java
│   │   │   └── exception/BookingExceptions.java
│   │   ├── resources/application.yml
│   │   └── pom.xml
│   │
│   ├── search-service/
│   │   ├── src/main/java/com/farmrental/searchservice/
│   │   │   ├── entity/FarmIndex.java (Elasticsearch mapping)
│   │   │   ├── service/SearchService.java
│   │   │   └── controller/SearchController.java
│   │   ├── resources/application.yml
│   │   └── pom.xml
│   │
│   ├── api-gateway/
│   │   ├── src/main/java/com/farmrental/apigateway/
│   │   │   ├── config/GatewayConfig.java
│   │   │   ├── filter/AuthFilter.java
│   │   │   └── controller/GatewayController.java
│   │   ├── resources/application.yml
│   │   └── pom.xml
│   │
│   └── kafka-events/
│       ├── src/main/java/com/farmrental/kafkaevents/
│       │   ├── events/KafkaEvents.java
│       │   │   ├── FarmLeasedEvent
│       │   │   ├── MachineryReservedEvent
│       │   │   ├── UserRegistrationEvent
│       │   │   ├── FarmListingVerifiedEvent
│       │   │   └── PaymentProcessedEvent
│       │   ├── producer/EventProducer.java
│       │   └── consumer/EventConsumer.java
│       └── pom.xml
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── FarmFilterSidebar.jsx (advanced agricultural filters)
│   │   │   ├── FarmBoundaryMap.jsx (Mapbox integration)
│   │   │   ├── SearchBar.jsx
│   │   │   └── FarmCard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── FarmDetailPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   └── MyBookingsPage.jsx
│   │   ├── services/
│   │   │   ├── FarmService.js
│   │   │   ├── BookingService.js
│   │   │   └── AuthService.js
│   │   ├── hooks/
│   │   │   ├── useFarmSearch.js
│   │   │   ├── useBooking.js
│   │   │   └── useAuth.js
│   │   └── App.jsx
│
├── admin-panel/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandVerificationPanel.jsx (document verification UI)
│   │   │   ├── StatsDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── FarmModeration.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Verifications.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   └── AdminService.js
│   │   └── App.jsx
│
├── mobile-app/
│   ├── package.json
│   ├── app.json
│   ├── src/
│   │   ├── screens/
│   │   │   ├── FarmListScreen.js (mobile farm listing)
│   │   │   ├── FarmDetailScreen.js
│   │   │   ├── MapScreen.js (location-based search)
│   │   │   ├── BookingScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── MyBookingsScreen.js
│   │   ├── components/
│   │   │   ├── FarmCard.js
│   │   │   ├── BottomTabNavigator.js
│   │   │   └── Header.js
│   │   ├── services/
│   │   │   └── MobileFarmService.js
│   │   ├── navigation/
│   │   │   └── RootNavigator.js
│   │   └── App.js
│
├── docker-compose.yml
├── ARCHITECTURE.md (this file)
├── API_DOCUMENTATION.md
└── SETUP_GUIDE.md
```

---

## 🔑 Key Technologies

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL with PostGIS (geospatial)
- **Search**: Elasticsearch
- **Messaging**: Apache Kafka
- **ORM**: Spring Data JPA with Hibernate Spatial
- **Service Registry**: Netflix Eureka

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Maps**: Mapbox GL
- **State Management**: Zustand
- **HTTP Client**: Axios

### Admin Panel
- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **Document Viewer**: React PDF
- **Notifications**: React Hot Toast

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Styling**: NativeWind (Tailwind for RN)
- **Geolocation**: React Native Geolocation Service

---

## 📚 API Endpoints

### Farm Listing Service

```
GET    /api/v1/farms                              # All active farms
GET    /api/v1/farms/{id}                         # Get farm details
GET    /api/v1/farms/status/active                # List active farms
GET    /api/v1/farms/search/location              # Search by geolocation
GET    /api/v1/farms/search/acreage               # Search by acreage range
GET    /api/v1/farms/search/soil-type             # Search by soil type
GET    /api/v1/farms/owner/{ownerId}              # Farmer's listings
POST   /api/v1/farms                              # Create listing
PUT    /api/v1/farms/{id}                         # Update listing
DELETE /api/v1/farms/{id}                         # Delete listing
```

### Booking Service

```
POST   /api/v1/bookings/calculate-quote           # Calculate lease price
POST   /api/v1/bookings                           # Create booking
GET    /api/v1/bookings/{id}                      # Get booking details
GET    /api/v1/bookings/user/{userId}             # User's bookings
POST   /api/v1/bookings/{farmId}/site-visit       # Request site visit
```

### Admin Service

```
GET    /api/v1/admin/verifications/pending        # Pending verifications
POST   /api/v1/admin/verifications/submit         # Submit verification
GET    /api/v1/admin/statistics/users             # User statistics
GET    /api/v1/admin/statistics/bookings          # Booking statistics
GET    /api/v1/admin/farms/moderation             # Farms for moderation
```

---

## 🚀 Kafka Events

### Published Events

1. **FARM_LEASED**
   - Triggered when booking is confirmed
   - Contains: farmId, lesseId, leaseAmount, period

2. **MACHINERY_RESERVED**
   - Triggered when machinery is rented
   - Contains: machineryId, reservationDate, dailyRate

3. **USER_REGISTRATION**
   - Triggered on new user signup
   - Contains: userId, email, userType, registrationDate

4. **FARM_LISTING_VERIFIED**
   - Triggered when admin approves listing
   - Contains: farmId, verificationNotes, approvalDate

5. **PAYMENT_PROCESSED**
   - Triggered on successful payment
   - Contains: paymentId, amount, status, referenceId

---

## 🗄️ Database Schema

### PostgreSQL Tables

```sql
-- Farm Listings (with geospatial data)
farm_listings
├── id (UUID)
├── title, description
├── owner_id
├── price_per_month, price_per_season
├── acreage, total_arable_land
├── water_source (ENUM)
├── electricity_phases
├── soil_type (ENUM)
├── has_fencing (boolean)
├── status (ENUM: PENDING, ACTIVE, LEASED)
├── location (GEOMETRY POINT) -- Latitude/Longitude
├── boundary (GEOMETRY POLYGON) -- Farm perimeter
├── verification_status
└── timestamps

-- Bookings
bookings
├── id (UUID)
├── farm_id
├── lessee_id
├── owner_id
├── lease_start_date
├── lease_end_date
├── total_amount
├── status (ENUM: PENDING, CONFIRMED, ACTIVE, COMPLETED)
└── timestamps

-- Users
users
├── id (UUID)
├── email, phone
├── user_type (ENUM: LANDLORD, TENANT, AGGREGATOR)
├── ks_profile_verified
├── document_ids[]
└── timestamps
```

---

## 🔍 Geospatial Queries (PostGIS)

### Find farms intersecting user coordinate

```sql
SELECT fl.* FROM farm_listings fl 
WHERE fl.status = 'ACTIVE'
AND ST_Intersects(fl.boundary, ST_Buffer(CAST(? AS geometry), 0.05))
ORDER BY ST_Distance(fl.location, CAST(? AS geometry))
```

### Find farms within radius

```sql
SELECT fl.* FROM farm_listings fl 
WHERE fl.status = 'ACTIVE'
AND ST_DWithin(fl.location, ST_GeomFromText(?, 4326), ? * 1000)
ORDER BY ST_Distance(fl.location, ST_GeomFromText(?, 4326))
```

---

## 💰 Lease Calculation Logic

### FarmLeaseCalculatorService

**Input Parameters:**
- Base price per acre (₹)
- Total acreage
- Lease duration (months)
- Crop season (KHARIF, RABI, ZAID, YEAR_ROUND)
- Machinery list

**Calculation Steps:**

1. **Base Land Cost** = Base Price/Acre × Total Acreage × Duration (months)

2. **Apply Discounts/Premiums:**
   - Long-term lease (>12 months): **-10% discount**
   - High-demand seasons (KHARIF/RABI): **+15% premium**

3. **Machinery Costs** = Sum of monthly machinery rates × duration

4. **Deposit** = (Base Land Cost / Duration) × 3 months

5. **Processing Fees** = (Subtotal) × 5%

6. **Grand Total** = Adjusted Land Cost + Machinery Cost + Deposit + Processing Fees

**Example:**
```
Base Price: ₹10,000/acre
Acreage: 50
Duration: 14 months (long-term)
Season: KHARIF (high-demand)

Base Land Cost = 10,000 × 50 × 14 = ₹7,000,000
After discount (10%) = ₹6,300,000
After premium (15%) = ₹7,245,000
Machinery Cost = ₹500,000
Subtotal = ₹7,745,000
Deposit = (7,000,000 / 14) × 3 = ₹1,500,000
Processing Fees (5%) = ₹387,250
GRAND TOTAL = ₹9,632,250
```

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Roles: ADMIN, LANDLORD, TENANT, AGGREGATOR
- OAuth2 integration ready

---

## 📱 Mobile App Features

- **Farm Discovery**: Browse & filter farms by location, size, water source
- **Geolocation-based Search**: Find farms near user location
- **Farm Details**: View boundary map, soil info, pricing
- **Site Visit Requests**: Schedule farm visits
- **Booking Management**: Track active and past bookings
- **Push Notifications**: Booking updates, rent reminders

---

## 🖥️ Admin Panel Features

- **Verification Dashboard**: Review pending farm listings
- **Document Review**: View land deeds and soil reports
- **Approval Workflow**: Approve/Reject/Request re-upload
- **User Management**: Manage landlords, tenants, aggregators
- **Reports & Analytics**: Booking stats, revenue tracking
- **Moderation Tools**: Flag fraudulent listings

---

## 🚀 Deployment

### Docker Compose

All services are containerized and orchestrated via Docker Compose:

```yaml
services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: farm_rental_db
      POSTGRES_PASSWORD: password
  
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
  
  kafka:
    image: confluentinc/cp-kafka:7.5.0
  
  api-gateway:
    build: ./backend/api-gateway
    ports: 8080:8080
  
  farm-listing-service:
    build: ./backend/farm-listing-service
    ports: 8082:8082
  
  # ... other services
```

---

## 🔧 Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Elasticsearch 8.x
- Apache Kafka 3.x
- Docker & Docker Compose

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd FarmRentalPlatform

# Start infrastructure
docker-compose up -d

# Build backend
cd backend && mvn clean package

# Start frontend dev server
cd frontend && npm install && npm run dev

# Start mobile app
cd mobile-app && npm install && npm start

# Start admin panel
cd admin-panel && npm install && npm run dev
```

---

## 📊 Technology Comparison

| Layer | Technology | Benefits |
|-------|-----------|----------|
| Geospatial | PostGIS | Production-ready spatial queries |
| Search | Elasticsearch | Fast full-text and filtering |
| Async | Kafka | Decoupled, scalable event handling |
| Frontend | React + Tailwind | Modern, responsive UI |
| Mobile | React Native | Code sharing, cross-platform |
| Maps | Mapbox GL | High-quality mapping |
| State | Zustand | Lightweight state management |

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributors

Farm Rental Platform Team

---

**Last Updated**: May 2026  
**Version**: 1.0.0
