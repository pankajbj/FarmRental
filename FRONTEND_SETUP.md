# Frontend Setup & Component Guide

## 🎨 Frontend Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Maps**: Mapbox GL
- **HTTP Client**: Axios
- **State Management**: Zustand
- **UI Components**: Custom Tailwind-based components

---

## 📁 Project Structure

```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── FarmFilterSidebar.jsx      # Advanced filter component
│   │   ├── FarmBoundaryMap.jsx        # Mapbox integration
│   │   ├── FarmCard.jsx               # Reusable farm card
│   │   ├── SearchBar.jsx
│   │   ├── Navigation.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── FarmDetailPage.jsx
│   │   ├── BookingPage.jsx
│   │   └── MyBookingsPage.jsx
│   ├── services/
│   │   ├── FarmService.js             # Farm API calls
│   │   ├── BookingService.js          # Booking API calls
│   │   └── AuthService.js             # Authentication
│   ├── hooks/
│   │   ├── useFarmSearch.js
│   │   ├── useBooking.js
│   │   └── useAuth.js
│   ├── store/
│   │   ├── farmStore.js               # Zustand store
│   │   └── userStore.js
│   └── styles/
│       └── globals.css
```

---

## 🚀 Installation & Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
VITE_APP_NAME=Farm Rental Platform
VITE_APP_VERSION=1.0.0
```

### Development Server

```bash
npm run dev
# Server runs at http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🧩 Core Components

### 1. FarmFilterSidebar Component

**Purpose**: Advanced agricultural filtering with debounced API calls

**Features**:
- Acreage range slider (5-500 acres)
- Water availability checkboxes
- Land suitability tags
- Budget range slider
- 400ms debounce for filter updates

**Usage**:
```jsx
<FarmFilterSidebar 
  onApplyFilters={(filters) => {
    // Handle filtered results
    searchFarms(filters);
  }}
/>
```

**Props**:
- `onApplyFilters`: Callback function with filter object

**Filter Object**:
```javascript
{
  acreageRange: [5, 500],
  waterAvailability: ['Borewell', 'Canal'],
  landSuitability: ['Organic', 'Livestock'],
  budgetRange: [10000, 100000]
}
```

### 2. FarmBoundaryMap Component

**Purpose**: Interactive Mapbox visualization of farm boundaries

**Features**:
- Display farm location marker
- Draw semi-transparent green polygon boundary
- Popup with farm details
- Satellite view toggle
- Site visit request button

**Usage**:
```jsx
<FarmBoundaryMap 
  farmData={{
    id: 'farm-123',
    title: 'Premium Farm',
    acreage: 50,
    location: { latitude: 12.9352, longitude: 77.5946 },
    boundary: {
      type: 'Polygon',
      coordinates: [[[77.59, 12.93], ...]]
    }
  }}
  onRequestSiteVisit={(farmId) => {
    console.log('Visit requested for:', farmId);
  }}
/>
```

**Props**:
- `farmData`: Farm object with location and boundary
- `onRequestSiteVisit`: Callback for site visit requests

### 3. Custom Hooks

#### useFarmSearch Hook

```jsx
import { useFarmSearch } from './hooks/useFarmSearch';

const MyComponent = () => {
  const { farms, loading, error, searchFarms } = useFarmSearch();

  useEffect(() => {
    searchFarms({ 
      acreageRange: [10, 100],
      waterAvailability: ['BOREWELL']
    });
  }, []);

  return (
    // Component JSX
  );
};
```

#### useBooking Hook

```jsx
const { calculateQuote, createBooking, bookings } = useBooking();

// Calculate lease price
const quote = await calculateQuote({
  basePricePerAcre: 10000,
  totalAcreage: 50,
  leaseDurationMonths: 12,
  cropSeason: 'KHARIF'
});

// Create booking
await createBooking({
  farmId: 'farm-123',
  userId: 'user-456',
  leaseStartDate: '2024-06-01',
  leaseEndDate: '2025-06-01'
});
```

---

## 🎯 Key Pages

### Home Page
- Hero section
- Featured farms carousel
- Quick search
- Statistics

### Search Page
- Side-by-side filter + results
- Map view of search results
- Grid/List view toggle
- Pagination

### Farm Detail Page
- Full farm information
- Interactive boundary map
- Photo gallery
- Reviews
- Booking calculator
- Request site visit

### Booking Page
- Lease calculator
- Price breakdown
- Payment details
- Confirmation

### My Bookings Page
- Active bookings
- Booking history
- Rental agreements
- Contact landlord

---

## 🔌 API Service Examples

### FarmService.js

```javascript
// Get nearby farms
const farms = await FarmService.searchFarmsByLocation(12.9352, 77.5946, 50);

// Search by acreage
const smallFarms = await FarmService.searchByAcreage(10, 50);

// Search by soil type
const organicFarms = await FarmService.searchBySoilType('ALLUVIAL');
```

### BookingService.js

```javascript
// Calculate lease quote
const quote = await BookingService.calculateLeaseQuote(
  10000,      // basePricePerAcre
  50,         // totalAcreage
  12,         // leaseDurationMonths
  'KHARIF',   // cropSeason
  []          // machineryIds
);

// Request site visit
await BookingService.requestSiteVisit('farm-123', {
  visitorName: 'John Doe',
  visitorEmail: 'john@example.com'
});
```

---

## 🎨 Tailwind CSS Configuration

### Custom Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'farm-green': '#16a34a',
        'farm-light-green': '#dcfce7',
        'soil-brown': '#92400e',
      },
      spacing: {
        'filter-width': '320px',
      }
    }
  }
}
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="
  w-full                    // Mobile: full width
  lg:w-80                   // Large screens: 320px width
  bg-white
  rounded-lg
  shadow-lg
  p-4
  md:p-6
  lg:p-8
">
</div>
```

---

## 🔄 State Management (Zustand)

### Farm Store

```javascript
// store/farmStore.js
import { create } from 'zustand';

export const useFarmStore = create((set) => ({
  farms: [],
  selectedFarm: null,
  loading: false,

  setFarms: (farms) => set({ farms }),
  selectFarm: (farm) => set({ selectedFarm: farm }),
  setLoading: (loading) => set({ loading }),

  searchFarms: async (filters) => {
    set({ loading: true });
    try {
      const results = await FarmService.searchFarms(filters);
      set({ farms: results });
    } finally {
      set({ loading: false });
    }
  }
}));
```

**Usage**:
```jsx
const { farms, selectedFarm, searchFarms } = useFarmStore();
```

---

## 📝 Component Examples

### Search Results Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {farms.map(farm => (
    <FarmCard 
      key={farm.id} 
      farm={farm}
      onSelect={handleSelectFarm}
    />
  ))}
</div>
```

### Filter with Debounce

```jsx
const handleFilterChange = useCallback((filters) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  const timer = setTimeout(() => {
    onApplyFilters(filters);
  }, 400);
  
  setDebounceTimer(timer);
}, [debounceTimer, onApplyFilters]);
```

---

## 🧪 Testing

### Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import FarmFilterSidebar from '../FarmFilterSidebar';

test('renders filter sidebar', () => {
  render(<FarmFilterSidebar onApplyFilters={jest.fn()} />);
  expect(screen.getByText('Farm Filters')).toBeInTheDocument();
});

test('applies filters on slider change', async () => {
  const mockCallback = jest.fn();
  render(<FarmFilterSidebar onApplyFilters={mockCallback} />);
  
  // Simulate slider interaction
  // Assert callback was called
  expect(mockCallback).toHaveBeenCalled();
});
```

---

## 📊 Performance Optimization

### Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const FarmDetailPage = lazy(() => import('./pages/FarmDetailPage'));

<Suspense fallback={<LoadingSpinner />}>
  <FarmDetailPage />
</Suspense>
```

### Image Optimization

```jsx
// Use responsive images
<img 
  src={farm.imageLarge}
  srcSet={`${farm.imageSmall} 600w, ${farm.imageLarge} 1200w`}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={farm.title}
/>
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Mapbox GL Docs](https://docs.mapbox.com/mapbox-gl-js)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**Last Updated**: May 2026  
**Version**: 1.0.0
