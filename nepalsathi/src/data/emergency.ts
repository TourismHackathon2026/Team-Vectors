import type { EmergencyContact } from '../types';

export const emergencyContacts: EmergencyContact[] = [
  { id: 'h1', name: 'Kathmandu Medical College', phone: '+977 1 425 3554', type: 'hospital', address: 'Sinoamrit Marg, Kathmandu' },
  { id: 'h2', name: 'Norvic International Hospital', phone: '+977 1 425 1227', type: 'hospital', address: 'Durbar Marg, Kathmandu' },
  { id: 'h3', name: 'Bir Hospital', phone: '+977 1 422 1119', type: 'hospital', address: 'Kantipath, Kathmandu' },
  { id: 'p1', name: 'Kathmandu Police Station', phone: '+977 1 426 1945', type: 'police', address: 'Hanuman Dhoka, Kathmandu' },
  { id: 'p2', name: 'Tourist Police', phone: '+977 1 424 7041', type: 'police', address: 'Bhag Durbar, Kathmandu' },
  { id: 'p3', name: 'Traffic Police', phone: '+977 1 422 1966', type: 'police', address: 'Ratna Park, Kathmandu' },
  { id: 'e1', name: 'Embassy of India', phone: '+977 1 441 4990', type: 'embassy', address: 'Lainchaur, Kathmandu' },
  { id: 'e2', name: 'US Embassy', phone: '+977 1 423 8500', type: 'embassy', address: 'Maharajgunj, Kathmandu' },
  { id: 'e3', name: 'UK Embassy', phone: '+977 1 423 7100', type: 'embassy', address: 'Lainchaur, Kathmandu' },
  { id: 's1', name: 'Women\'s Help Desk', phone: '+977 1 426 6523', type: 'safety', address: 'Kathmandu' },
  { id: 's2', name: 'Ambulance Service', phone: '102', type: 'safety', address: 'Nepal' },
  { id: 's3', name: 'Police Emergency', phone: '100', type: 'safety', address: 'Nepal' },
];

export const safetyTips = `
Stay Connected
Keep your phone charged and carry a portable power bank. Share your location with someone you trust.

Local Transport
Use registered taxis or ride-sharing apps. Agree on the fare before starting your journey.

Food & Water
Stick to bottled or filtered water. Eat at busy restaurants where locals eat — high turnover means fresh food.

Valuables
Keep passports and extra cash in your hotel safe. Carry only what you need for the day.

Temple Etiquette
Remove shoes before entering temples. Dress modestly — cover shoulders and knees. Always walk clockwise around stupas.

Emergency Numbers
Save these numbers in your phone before you travel: Police: 100, Ambulance: 102, Fire: 101.

Weather Precautions
Check the weather before heading to higher altitudes. Carry a rain jacket even in dry season.
`.trim();
