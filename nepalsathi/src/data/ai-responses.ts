interface AIResponse {
  keywords: string[];
  response: string;
}

const aiResponses: AIResponse[] = [
  {
    keywords: ['one day', 'heritage tour', 'day trip'],
    response: `Here's a recommended one-day heritage itinerary:

Morning
• Start at Swayambhunath Stupa (7 AM — avoid crowds)
• Walk down through the peaceful forest path

Breakfast
• Traditional Newari café in Bhaktapur

Afternoon
• Bhaktapur Durbar Square — the best preserved in the valley
• Try their famous king curd (juju dhau)

Lunch
• Authentic momo restaurant in Patan

Evening
• Boudhanath at sunset
• Walk the kora (circumambulation) with the locals
• Light a butter lamp for good luck

Estimated budget: NPR 2500–3500
Walking + taxi combination recommended.`,
  },
  {
    keywords: ['food', 'local food', 'eat', 'restaurant', 'dining'],
    response: `For authentic Nepali food, here are my top picks:

• Newa Lahana (Patan) — traditional Newari set meal, NPR 500
• Momo Palace (Thamel) — steamed buffalo momos, NPR 250
• Thakali Bhancha (Durbar Marg) — dal bhat power lunch, NPR 400
• Boudha Stupa Cafe — momo + thukpa combo with a view, NPR 350

Local tip: Look for places where workers eat lunch — that's where the food is freshest and most authentic.`,
  },
  {
    keywords: ['3 hours', 'short visit', 'limited time', 'quick'],
    response: `If you only have 3 hours in Kathmandu:

1. Swayambhunath Stupa (45 min) — the view alone is worth it
2. Walk to nearby Boudhanath (15 min taxi)
3. Boudhanath Stupa (45 min) — do one full kora
4. Quick momo stop at a local shop (30 min)
5. Patan Durbar Square (45 min) — compact and stunning

This route keeps you moving and covers the essentials.`,
  },
  {
    keywords: ['boudhanath', 'boudha', 'story', 'history'],
    response: `The story of Boudhanath Stupa:

Legend says it was built by a humble poultry woman who asked the king for land to build a stupa. She was granted as much land as a buffalo hide could cover — but she cleverly cut the hide into a long, thin strip and enclosed a vast area.

The eyes of Boudhanath are painted on all four sides of the spire. They represent the all-seeing eyes of the Buddha, watching over the valley. Between the eyes, a curly symbol represents the Nepali numeral for "1" — signifying unity.

Local tip: Visit during the full moon. The butter lamp offerings create an unforgettable atmosphere.`,
  },
  {
    keywords: ['hidden', 'off the beaten path', 'secret', 'tourists miss'],
    response: `Here are hidden gems most tourists miss:

• Kirtipur — an ancient Newari town with stunning views, zero crowds
• Bungamati — the village that time forgot, full of woodcarvers
• Khokana — a tiny mustard oil mill village, untouched by tourism
• Nagi Gompa — a nunnery above Kathmandu with incredible valley views
• The Garden of Dreams — a serene neo-classical garden hidden behind Thamel's chaos

These places feel like discovering another side of Nepal entirely.`,
  },
  {
    keywords: ['budget', 'cheap', 'affordable', 'budget-friendly'],
    response: `Budget-friendly itinerary for Kathmandu (under NPR 2000):

• Swayambhunath — NPR 200 entry
• Walk to Boudhanath — free (entry is free, but donations welcome)
• Lunch at a local dal bhat joint — NPR 200
• Kathmandu Durbar Square — NPR 1000 (one-time, multi-entry pass)
• Evening walk through Asan Tole market — free
• Street food: samosas, sel roti, and tea — NPR 200

Total: roughly NPR 1600. A rich day of experiences.`,
  },
  {
    keywords: ['etiquette', 'culture', 'customs', 'dress', 'respect'],
    response: `Important cultural etiquette for Nepal:

Temples
• Remove shoes before entering
• Dress modestly — cover shoulders and knees
• Walk clockwise around stupas and chortens
• Never touch offerings or statues without permission

Greetings
• Say "Namaste" with palms together
• Don't point your feet at people or religious objects
• Use your right hand for giving and receiving

Eating
• Eat with your right hand if using traditional utensils
• Accept food and drink when offered — it's considered rude to decline
• Don't share half-eaten food

Photography
• Ask before taking photos of people, especially sadhus
• No flash photography inside temples

Local wisdom: When in doubt, watch what locals do and follow their lead.`,
  },
  {
    keywords: ['kathmandu', 'valley', 'general'],
    response: `Welcome to Kathmandu Valley! Here's what you should know:

The valley is home to 7 UNESCO World Heritage Sites within a 20km radius. You can explore them comfortably in 3-4 days.

Getting around:
• Taxis are affordable — NPR 500-800 for most trips
• Walking is the best way to discover hidden corners
• Rickshaws are fun for short distances

Pro tip: Buy a multi-entry pass for NPR 1000 that covers all seven UNESCO sites. Valid for one week.`,
  },
];

export function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  for (const entry of aiResponses) {
    if (entry.keywords.some((k) => msg.includes(k))) {
      return entry.response;
    }
  }
  return aiResponses[aiResponses.length - 1].response;
}

export const suggestedPrompts = [
  'Plan a one-day heritage tour',
  'Recommend authentic local food nearby',
  'What should I visit if I have only 3 hours?',
  'Tell me the story of Boudhanath',
  'Find hidden places most tourists miss',
  'Create a budget-friendly itinerary',
  'What cultural etiquette should I know?',
  'Give me tips for exploring Kathmandu',
];

export const siteStories: Record<string, { history: string; legend: string; tips: string }> = {
  'kathmandu-durbar-square': {
    history: 'Built over centuries by the Malla and Shah kings, this square was the political and cultural heart of the ancient kingdom. Each courtyard and temple marks a chapter in Kathmandu\'s royal history.',
    legend: 'Locals say the square was designed by a divine architect who descended from the heavens. The 12th-century Kasthamandap temple at its edge is believed to be built from the wood of a single tree.',
    tips: 'Visit early morning to see the square come alive. The museum inside has a wonderful collection of royal artifacts. Entry includes access to all temples within the complex.',
  },
  'swayambhunath': {
    history: 'Perched atop a hill, this 5th-century Buddhist stupa is one of the oldest in Nepal. It marks the legendary ancient lake that once covered the Kathmandu Valley.',
    legend: 'Legend says the valley was once a lake, and Swayambhunath emerged from a lotus flower at the center. The hill was drained by Bodhisattva Manjushri with a single sword stroke through the Chobar Gorge.',
    tips: 'The 365 steps to the top represent the days of the year. Monkeys rule the site — keep your belongings close. Go at sunrise for the best light and fewest crowds.',
  },
  'pashupatinath': {
    history: 'One of the holiest Hindu temples dedicated to Lord Shiva, this complex along the Bagmati River has been a site of worship since the 5th century.',
    legend: 'The lingam here is believed to have manifested itself. Legend says Shiva once hid in the forest as a deer and was later discovered here, making this spot eternally sacred.',
    tips: 'Non-Hindus cannot enter the main temple but can view from the eastern bank. The evening aarti is a powerful experience. Photography of cremation ghats is not permitted.',
  },
  'boudhanath': {
    history: 'Built in the 5th century, this massive stupa is one of the largest spherical structures in the world and a cornerstone of Tibetan Buddhism outside Tibet.',
    legend: 'Built by a poultry woman who tricked the king into granting land the size of a buffalo hide — which she cut into a thin strip to enclose a vast area. The eyes watch over all who approach.',
    tips: 'Walk the kora (clockwise) three times for good fortune. The rooftop cafes offer the best views. Visit during Buddha Jayanti for the most vibrant celebrations.',
  },
  'bhaktapur-durbar-square': {
    history: 'The best-preserved of the three Durbar Squares, Bhaktapur was a powerful city-state during the Malla period, known for its artistry and urban planning.',
    legend: 'The 55 Window Palace was said to have that many windows so the king could watch over his people. The Nyatapola Temple was built so tall to keep evil forces away.',
    tips: 'Try the famous juju dhau (king curd) — it\'s only found here. The pottery square is just a short walk away. One entry pass covers all attractions in the square.',
  },
};
