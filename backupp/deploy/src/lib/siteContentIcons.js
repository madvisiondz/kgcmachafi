import {
  Users,
  Calendar,
  Heart,
  Activity,
  Stethoscope,
  Home,
  PhoneCall,
  HeartHandshake,
  Bus as Ambulance,
} from 'lucide-react';

export const statIcons = {
  users: Users,
  calendar: Calendar,
  heart: Heart,
};

export const serviceIcons = {
  ambulance: Ambulance,
  'phone-call': PhoneCall,
  home: Home,
  'heart-handshake': HeartHandshake,
  stethoscope: Stethoscope,
  activity: Activity,
  users: Users,
  heart: Heart,
};

export const heroColorOptions = [
  'from-green-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
  'from-red-500 to-pink-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-indigo-500 to-blue-600',
];

export const serviceColorOptions = [
  { color_class: 'from-red-500 to-rose-600', bg_class: 'bg-red-50' },
  { color_class: 'from-blue-500 to-cyan-600', bg_class: 'bg-blue-50' },
  { color_class: 'from-green-500 to-emerald-600', bg_class: 'bg-green-50' },
  { color_class: 'from-purple-500 to-violet-600', bg_class: 'bg-purple-50' },
  { color_class: 'from-teal-500 to-emerald-600', bg_class: 'bg-teal-50' },
  { color_class: 'from-orange-500 to-amber-600', bg_class: 'bg-orange-50' },
  { color_class: 'from-pink-500 to-rose-600', bg_class: 'bg-pink-50' },
  { color_class: 'from-indigo-500 to-blue-600', bg_class: 'bg-indigo-50' },
];
