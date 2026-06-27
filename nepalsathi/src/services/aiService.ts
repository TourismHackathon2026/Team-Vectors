const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string | null {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const systemPrompt = `You are Nepali Sathi AI, the official AI assistant of Heritage Quest Nepal — a gamified tourism platform that encourages tourists to explore Nepal's heritage sites.

## Your Identity
- Your name is Nepali Sathi AI (🇳🇵)
- You are a friendly, knowledgeable local Nepali tour guide
- You represent Heritage Quest Nepal platform
- Always be warm, polite, conversational, enthusiastic, and easy to understand

## What You Can Help With
- Welcome tourists to Nepal
- Recommend destinations across Kathmandu Valley and Nepal
- Explain historical sites and their significance
- Explain UNESCO World Heritage Sites (Swayambhunath, Boudhanath, Pashupatinath, Patan Durbar Square, Bhaktapur Durbar Square, Kathmandu Durbar Square, Changu Narayan)
- Recommend trekking routes (Everest Base Camp, Annapurna Circuit, Langtang,etc.)
- Suggest local experiences, hidden gems, and authentic Nepali foods (momo, dal bhat, Newari cuisine, juju dhau, etc.)
- Explain Nepali festivals (Dashain, Tihar, Holi, Indra Jatra, etc.)
- Share cultural etiquette and tips for respecting local traditions
- Give transportation advice (flights, buses, taxis, rickshaws)
- Suggest nearby attractions
- Help build travel itineraries
- Encourage sustainable and responsible tourism

## Heritage Quest Platform Knowledge
You MUST understand and explain the gamification system:

1. **QR Code Scanning**: Users visit heritage sites in real life and scan QR codes placed at those locations to collect stamps.

2. **Heritage Passport**: A digital passport that records all visited heritage sites.

3. **Digital Stamps**: Each QR scan adds a stamp to the user's passport. Each stamp represents a real visit.

4. **XP System**: Users earn XP for scanning QR codes, completing quests, and visiting sites. XP determines their level.

5. **Badges**: Special achievements unlocked by reaching milestones (e.g., visiting 5 heritage sites, finding hidden gems).

6. **Leaderboards**: Users compete with others based on total stamps collected and XP earned.

7. **Tourist Challenges**: Time-bound quests like "Visit 3 Durbar Squares in one day" for bonus rewards.

8. **Rewards**: Users earn rewards by physically visiting locations and scanning QR codes. Always encourage real exploration.

9. **Heritage Exploration**: The core mission — discovering Nepal's rich cultural and historical heritage.

## Topic Restriction
- ONLY answer questions about Nepal tourism, Nepali culture, heritage sites, and Heritage Quest Nepal platform.
- If users ask about coding, homework, politics, medical advice, mathematics, or any unrelated topic, politely say:
  "I'm Nepali Sathi AI, and I specialize in Nepal tourism and Heritage Quest Nepal. I'd love to help you plan your Nepal adventure instead! Ask me about heritage sites, food, trekking, or festivals."
  Then gently redirect to tourism topics.

## Guidelines
- Never invent facts. If unsure, say "I'm not entirely sure about that, but I'd recommend checking with local authorities."
- Include practical details when relevant (entry fees, timings, best seasons, dress codes)
- Be concise but warm
- Encourage users to physically visit sites to collect stamps via QR codes
- When users ask about earning rewards, explain they must visit locations and scan official QR codes in person`;

export const aiService = {
  async sendMessage(messages: AIChatMessage[]): Promise<string> {
    const apiKey = getApiKey();

    if (!apiKey) {
      return mockResponse(messages[messages.length - 1]?.content || '');
    }

    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';

    if (isUnrelatedTopic(lastUserMsg)) {
      return "I'm Nepali Sathi AI, and I specialize in Nepal tourism and Heritage Quest Nepal. I'd love to help you plan your Nepal adventure instead! Ask me about heritage sites, food, trekking, or festivals.";
    }

    const conversationHistory = messages.map((m) => ({
      role: m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.role === 'system' ? systemPrompt : m.content }],
    }));

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am Nepali Sathi AI, ready to assist with Nepal tourism and Heritage Quest Nepal.' }] },
      ...conversationHistory.slice(-20),
    ];

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Gemini API error:', res.status, errBody);
        return mockResponse(lastUserMsg);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error('Gemini: no text in response', data);
        return mockResponse(lastUserMsg);
      }
      return text;
    } catch (e) {
      console.error('Gemini API call failed, using fallback:', e);
      return mockResponse(lastUserMsg);
    }
  },
};

function isUnrelatedTopic(msg: string): boolean {
  const lower = msg.toLowerCase();
  const nepalKeywords = [
    'nepal', 'kathmandu', 'heritage', 'unesco', 'stupa', 'temple', 'square',
    'trek', 'trekking', 'hiking', 'mountain', 'himalaya', 'everest', 'annapurna',
    'food', 'momo', 'dal', 'bhat', 'curry', 'restaurant', 'eat', 'cuisine',
    'festival', 'dashain', 'tihar', 'holi', 'indra', 'jatra', 'culture',
    'passport', 'stamp', 'qr', 'quest', 'badge', 'xp', 'leaderboard',
    'reward', 'tourist', 'travel', 'trip', 'itinerary', 'visit', 'explore',
    'guide', 'local', 'experience', 'adventure', 'tour', 'destination',
    'transport', 'bus', 'taxi', 'flight', 'airport', 'hotel', 'stay',
    'shopping', 'craft', 'handicraft', 'pashmina', 'rug', 'carpet',
    'museum', 'palace', 'durbar', 'patan', 'bhaktapur', 'swayambhu',
    'boudha', 'pashupati', 'changunarayan', 'lumbini', 'pokhara',
    'chitwan', 'nagarkot', 'dhulikhel', 'kirtipur', 'bhaktapur',
    'newari', 'thamel', 'asak', 'indrachowk', 'kumari', 'living goddess',
    'hello', 'hi', 'namaste', 'thank', 'help', 'plan', 'suggest',
    'recommend', 'best', 'top', 'must', 'should', 'know', 'tell',
    'what', 'where', 'when', 'how', 'why', 'which', 'can', 'could',
    'heritage quest', 'nepali sathi', 'stamp', 'collect', 'scan',
  ];
  const containsNepalKeyword = nepalKeywords.some((kw) => lower.includes(kw));
  if (containsNepalKeyword) return false;

  const greetingPattern = /^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|greetings|thanks|thank you)/i;
  if (greetingPattern.test(lower.trim())) return false;

  return false;
}

function mockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('heritage') || msg.includes('unesco') || msg.includes('stupa') || msg.includes('temple')) {
    return `Namaste! 🙏 Let me tell you about Nepal's incredible UNESCO World Heritage Sites in Kathmandu Valley:

🏛️ **Swayambhunath Stupa** (Monkey Temple) — Perched on a hill with panoramic valley views. Entry: NPR 200. Best at sunrise!

🕌 **Boudhanath Stupa** — One of the largest spherical stupas in the world. The evening aarti ceremony is magical.

🏯 **Patan Durbar Square** — The finest Newari architecture. Don't miss the Patan Museum.

🏰 **Bhaktapur Durbar Square** — Best preserved of the three squares. Try the famous juju dhau (king curd)!

🛕 **Pashupatinath Temple** — Sacred Hindu temple along the Bagmati River.

🏛️ **Kathmandu Durbar Square** — Historic royal palace with the living goddess Kumari.

🗿 **Changu Narayan Temple** — The oldest temple in Nepal, dating to the 4th century.

💡 Pro tip: Buy a multi-entry pass for NPR 1,000 covering all seven sites, valid for one week!

Want to collect digital stamps for each site? Visit them in person and scan the QR codes placed at each location to build your Heritage Passport! 🎫`;
  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('momo') || msg.includes('restaurant') || msg.includes('cuisine')) {
    return `Ah, Nepali food! 🍛 Let me share some authentic local experiences:

🥟 **Momo** — Steamed or fried dumplings with spicy tomato achar. Try buffalo momos in Thamel!

🍛 **Dal Bhat** — The national meal: lentil soup, rice, curry, and pickles. Unlimited refills in local eateries!

🍯 **Juju Dhau** — The famous "king curd" from Bhaktapur. A sweet yogurt you'll only find there!

🥘 **Newari Cuisine** — Try *chhwela* (spiced buffalo), *kwati* (mixed bean soup), and *bara* (lentil pancake).

🍚 **Thakali Set** — A complete meal from the Mustang region with buckwheat, curries, and pickles.

🍵 **Masala Chai** — Spiced milk tea. Have it at a local tea shop for the real experience!

💡 Local wisdom: Look for places where workers eat lunch — that's where the food is freshest and most authentic!`;
  }

  if (msg.includes('trek') || msg.includes('hike') || msg.includes('mountain') || msg.includes('everest')) {
    return `Nepal is a trekker's paradise! 🏔️ Here are some amazing options:

🥾 **Everest Base Camp Trek** — 12-14 days. The ultimate trek to the foot of the world's highest peak.

🌄 **Annapurna Circuit** — 12-18 days. Stunning diversity from subtropical forests to arid highlands.

🌿 **Langtang Valley Trek** — 7-10 days. Closer to Kathmandu, with beautiful rhododendron forests.

🏞️ **Poon Hill** — 4-5 days. Short but rewarding with spectacular sunrise views.

🌺 **Mardi Himal Trek** — 5-7 days. Less crowded, with incredible close-up views of Machhapuchhre.

💡 Best seasons: March-May (spring) and October-November (autumn) for clear skies and moderate temperatures.`;
  }

  if (msg.includes('stamp') || msg.includes('qr') || msg.includes('passport') || msg.includes('badge') || msg.includes('xp') || msg.includes('quest')) {
    return `Great question about Heritage Quest Nepal! 🎮

📱 **QR Code Stamps** — Visit heritage sites in person and scan the official QR codes placed at each location. Each scan adds a digital stamp to your passport!

🎫 **Heritage Passport** — Your digital collection of every heritage site you've visited. The more you explore, the richer your passport becomes!

⭐ **XP System** — Earn XP for:
   • Scanning QR codes at heritage sites
   • Completing tourist quests
   • Visiting multiple sites in a day

🏅 **Badges & Achievements** — Unlock special badges like:
   • "Heritage Hunter" — Visit 5 heritage sites
   • "Stamp Collector" — Collect 10 stamps
   • "Local Explorer" — Find hidden gems

🏆 **Leaderboards** — Compete with fellow travelers! Higher stamps and XP = higher rank.

🎯 **Quests** — Time-bound challenges like "Visit 3 Durbar Squares" for bonus rewards.

The key message: **You must physically visit these incredible places to earn rewards!** Get out there and explore Nepal! 🇳🇵`;
  }

  if (msg.includes('festival')) {
    return `Nepal's festivals are a vibrant celebration of culture! 🎉

🎊 **Dashain** (Sept-Oct) — The biggest festival. Families reunite, receive blessings, and fly kites.

🪔 **Tihar** (Oct-Nov) — Festival of lights. Worship crows, dogs, cows, and Laxmi (goddess of wealth).

🎨 **Holi** (March) — Color festival! Join the fun in Kathmandu's Durbar Square.

🎭 **Indra Jatra** (August) — Kathmandu's grand festival featuring the living goddess Kumari.

🕯️ **Buddha Jayanti** (May) — Celebrates Buddha's birth, enlightenment, and passing.

🎶 **Gai Jatra** (August) — Cow festival with comedy, music, and processions.

💡 Each festival offers a unique window into Nepali culture and traditions. Plan your visit around one for an unforgettable experience!`;
  }

  return `Namaste! 🙏 I'm Nepali Sathi AI, your local guide to Nepal.

Here's how I can help you explore incredible Nepal:

🏛️ **Heritage Sites** — Learn about UNESCO World Heritage Sites
📍 **Nearby Attractions** — Find places close to your location
🥾 **Trekking Routes** — From Everest Base Camp to hidden trails
🍛 **Nepali Food** — Discover authentic local cuisine
🎉 **Festivals** — Plan around cultural celebrations
🗺️ **Trip Planning** — Build your perfect Nepal itinerary
📷 **QR Stamps** — How to collect digital stamps with Heritage Quest
🏅 **Your Passport** — Track your heritage exploration journey

What would you like to know about Nepal? Just ask! 🇳🇵`;
}