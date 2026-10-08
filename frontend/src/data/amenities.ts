import { Amenity } from '../types';

export const AMENITIES_LIST: Amenity[] = [
  { id: 'wifi', label: 'High-Speed Wi-Fi', icon: 'Wifi', category: 'essentials' },
  { id: 'ac', label: 'Central Air Conditioning', icon: 'AirVent', category: 'essentials' },
  { id: 'parking', label: 'Dedicated Parking', icon: 'Car', category: 'features' },
  { id: 'laundry', label: 'In-Unit Washer & Dryer', icon: 'Shirt', category: 'essentials' },
  { id: 'pool', label: 'Swimming Pool', icon: 'Waves', category: 'features' },
  { id: 'gym', label: 'Fitness Center / Gym', icon: 'Dumbbell', category: 'features' },
  { id: 'kitchen', label: 'Chef-Style Kitchen', icon: 'Utensils', category: 'essentials' },
  { id: 'balcony', label: 'Private Balcony / Terrace', icon: 'Sun', category: 'features' },
  { id: 'pets', label: 'Pet Friendly', icon: 'Dog', category: 'features' },
  { id: 'security', label: '24/7 Security & Concierge', icon: 'ShieldCheck', category: 'safety' },
  { id: 'workspace', label: 'Dedicated Work Desk', icon: 'Laptop', category: 'features' },
  { id: 'elevator', label: 'Elevator Access', icon: 'ArrowUpDown', category: 'features' },
  { id: 'furnished', label: 'Fully Furnished', icon: 'Armchair', category: 'features' },
  { id: 'ev_charging', label: 'EV Charging Station', icon: 'Zap', category: 'features' },
  { id: 'fireplace', label: 'Indoor Fireplace', icon: 'Flame', category: 'features' },
  { id: 'smart_home', label: 'Smart Lock & Thermostat', icon: 'KeyRound', category: 'safety' },
];
