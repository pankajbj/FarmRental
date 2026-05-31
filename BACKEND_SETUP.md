# Backend Microservices - Setup & Development Guide

## 📦 Backend Stack

- **Language**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Build Tool**: Maven
- **Databases**: PostgreSQL with PostGIS, Elasticsearch
- **Messaging**: Apache Kafka
- **Service Mesh**: Netflix Eureka (optional)

---

## 🏗️ Microservices Overview

### 1. API Gateway (Port 8080)
Central entry point for all client requests. Routes requests to appropriate microservices.

**Key Features:**
- Request routing
- Authentication/Authorization filtering
- Rate limiting
- Load balancing

### 2. User Service (Port 8081)
Manages user profiles, authentication, and authorization.

**Endpoints:**
```
POST   /api/v1/users/register       # New user registration
POST   /api/v1/users/login          # User login
GET    /api/v1/users/{id}           # Get user profile
PUT    /api/v1/users/{id}           # Update profile
GET    /api/v1/users/verify/{id}    # Document verification
```

### 3. Farm Listing Service (Port 8082)
Core service for farm property management with geospatial capabilities.

**Key Features:**
- Create/Read/Update/Delete farm listings
- PostGIS-powered geospatial queries
- Complex filtering (acreage, soil type, water source)
- Boundary polygon management

**Endpoints:**
```
POST   /api/v1/farms                      # Create listing
GET    /api/v1/farms/{id}                 # Get listing
GET    /api/v1/farms/status/active        # List active farms
GET    /api/v1/farms/search/location      # Location-based search
GET    /api/v1/farms/search/acreage       # Acreage range search
GET    /api/v1/farms/search/soil-type     # Soil type filter
PUT    /api/v1/farms/{id}                 # Update listing
DELETE /api/v1/farms/{id}                 # Delete listing
```

### 4. Booking Service (Port 8083)
Manages lease agreements, bookings, and complex pricing calculations.

**Key Features:**
- Lease calculation with seasonal adjustments
- Long-term discount logic
- Machinery rental aggregation
- Site visit requests

**Endpoints:**
```
POST   /api/v1/bookings/calculate-quote   # Calculate lease price
POST   /api/v1/bookings                   # Create booking
GET    /api/v1/bookings/{id}              # Get booking details
GET    /api/v1/bookings/user/{userId}     # User's bookings
POST   /api/v1/bookings/{farmId}/site-visit
```

### 5. Search Service (Port 8084)
Elasticsearch-powered advanced search and filtering.

**Key Features:**
- Full-text search
- Complex filtering combinations
- Faceted search
- Autocomplete

### 6. Kafka Events
Asynchronous event publishing and consumption.

**Events:**
- `FarmLeasedEvent`
- `MachineryReservedEvent`
- `UserRegistrationEvent`
- `FarmListingVerifiedEvent`
- `PaymentProcessedEvent`

---

## 🗂️ File Structure

Each service follows standard Spring Boot structure:

```
service-name/
├── pom.xml                              # Maven configuration
├── src/
│   ├── main/
│   │   ├── java/com/farmrental/service/
│   │   │   ├── controller/              # REST endpoints
│   │   │   ├── service/                 # Business logic
│   │   │   ├── entity/                  # JPA entities
│   │   │   ├── repository/              # Data access
│   │   │   ├── dto/                     # Data transfer objects
│   │   │   ├── exception/               # Custom exceptions
│   │   │   ├── config/                  # Configuration classes
│   │   │   └── ServiceApplication.java  # Spring Boot main
│   │   └── resources/
│   │       ├── application.yml          # Configuration
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/            # Flyway migrations
│   └── test/
│       └── java/...                     # Unit tests
```

---

## 🔧 Configuration

### PostgreSQL Connection (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/farm_rental_db
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.spatial.dialect.postgis.PostgisDialect
        default_schema: public
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: farm-rental-group
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
```

### Elasticsearch Connection

```yaml
spring:
  elasticsearch:
    rest:
      uris: http://localhost:9200
```

---

## 🗄️ Database Setup

### Create Database and Enable PostGIS

```sql
-- Create database
CREATE DATABASE farm_rental_db;

-- Connect to database
\c farm_rental_db;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify installation
SELECT PostGIS_Version();
```

### Sample Data Insert

```sql
INSERT INTO farm_listings (
  id, title, description, owner_id, price_per_month, acreage,
  water_source, soil_type, location, boundary, status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Premium Agriculture Land - Bangalore',
  'Well-maintained 50-acre farm with irrigation',
  'owner-123',
  50000.00,
  50.0,
  'BOREWELL',
  'BLACK_COTTON',
  ST_GeomFromText('POINT(77.5946 12.9352)', 4326),
  ST_GeomFromText('POLYGON((77.5946 12.9352, 77.5956 12.9352, 77.5956 12.9362, 77.5946 12.9362, 77.5946 12.9352))', 4326),
  'ACTIVE'
);
```

---

## 📝 Key Java Classes

### FarmListing Entity (PostGIS Integration)

```java
@Entity
@Table(name = "farm_listings")
public class FarmListing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotNull
    @Column(nullable = false)
    private Double acreage;

    @Enumerated(EnumType.STRING)
    private WaterSourceEnum waterSource;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;  // Mapbox compatible

    @Column(columnDefinition = "geometry(Polygon,4326)")
    private Polygon boundary;  // Farm perimeter

    // ... other fields
}
```

### Repository with PostGIS Queries

```java
@Repository
public interface FarmListingRepository extends JpaRepository<FarmListing, String> {
    
    @Query(value = "SELECT fl.* FROM farm_listings fl " +
            "WHERE ST_DWithin(fl.location, ST_GeomFromText(?1, 4326), ?2 * 1000)",
            nativeQuery = true)
    List<FarmListing> findFarmsByRadius(String centerPoint, Double radiusKm);
}
```

### FarmLeaseCalculatorService

```java
@Service
public class FarmLeaseCalculatorService {
    
    public LeaseQuoteDTO calculateLeaseQuote(
        BigDecimal basePricePerAcre,
        Double totalAcreage,
        Integer leaseDurationMonths,
        CropSeason cropSeason,
        List<String> machineryIds) {
        
        // Calculate base land cost
        BigDecimal baseCost = basePricePerAcre
            .multiply(BigDecimal.valueOf(totalAcreage))
            .multiply(BigDecimal.valueOf(leaseDurationMonths));
        
        // Apply discounts/premiums based on duration and season
        BigDecimal adjustedCost = applyAdjustments(baseCost, leaseDurationMonths, cropSeason);
        
        // Add machinery costs
        BigDecimal machineryCost = calculateMachineryCosts(machineryIds, leaseDurationMonths);
        
        // Build quote response
        return LeaseQuoteDTO.builder()
            .baseLandCost(adjustedCost)
            .machineryCost(machineryCost)
            .grandTotal(adjustedCost.add(machineryCost))
            .build();
    }
}
```

---

## 🧪 Testing

### Unit Tests

```java
@SpringBootTest
public class FarmLeaseCalculatorServiceTest {
    
    @Autowired
    private FarmLeaseCalculatorService service;
    
    @Test
    public void testLongTermDiscount() {
        LeaseQuoteDTO quote = service.calculateLeaseQuote(
            new BigDecimal("10000"),
            50.0,
            14,  // > 12 months
            CropSeason.KHARIF,
            new ArrayList<>()
        );
        
        // Verify 10% discount was applied
        assertTrue(quote.getAppliedDiscountPercentage() == 10.0);
    }
}
```

### Integration Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
public class FarmListingControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetActiveFarms() throws Exception {
        mockMvc.perform(get("/api/v1/farms/status/active"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }
}
```

---

## 🚀 Running Services

### Start All Services (Docker Compose)

```bash
cd FarmRentalPlatform
docker-compose up -d
```

### Start Individual Service

```bash
cd backend/farm-listing-service
mvn spring-boot:run
```

### Build for Production

```bash
mvn clean package -DskipTests -P prod
```

---

## 📊 Monitoring & Logging

### Application Logs

```yaml
logging:
  level:
    root: INFO
    com.farmrental: DEBUG
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

### Metrics (Actuator)

```
GET /actuator/health              # Service health
GET /actuator/metrics             # Performance metrics
GET /actuator/prometheus          # Prometheus metrics
```

---

## 🔗 Service Discovery

### Eureka Registration (Optional)

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka
  instance:
    preferIpAddress: true
```

---

## 📚 API Documentation

Generate OpenAPI docs with:

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Farm Rental Platform API")
                .version("1.0.0"));
    }
}
```

Access Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## 🐛 Troubleshooting

### PostGIS Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres -d farm_rental_db -c "SELECT PostGIS_Version();"

# Enable PostGIS if not already enabled
psql -U postgres -d farm_rental_db -c "CREATE EXTENSION postgis;"
```

### Kafka Connection Issues

```bash
# Check Kafka broker
kafka-broker-api-versions.sh --bootstrap-server localhost:9092

# Create topic if needed
kafka-topics.sh --bootstrap-server localhost:9092 --create --topic farm-events
```

---

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostGIS Documentation](https://postgis.net/documentation)
- [Hibernate Spatial Guide](https://hibernate.org/orm/spatial)
- [Kafka Documentation](https://kafka.apache.org/documentation)

---

**Last Updated**: May 2026  
**Version**: 1.0.0
