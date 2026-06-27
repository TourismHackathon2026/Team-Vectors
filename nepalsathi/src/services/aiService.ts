const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey(): string | null {
  return import.meta.env.VITE_DEEPSEEK_API_KEY || null;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const systemPrompt = {
  role: 'system' as const,
  content: `You are a friendly Nepali local guide helping travelers explore Kathmandu Valley.
Be warm, knowledgeable, and concise. Share authentic local insights about heritage sites,
food, culture, hidden gems, and travel tips. When asked about specific locations, include
practical details like entry fees, timings, and etiquette. Never give inaccurate information
about Nepal's culture or history. If unsure, say so honestly.`,
};

export const aiService = {
  async sendMessage(messages: AIChatMessage[]): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
      return mockResponse(messages[messages.length - 1]?.content || '');
    }

    try {
      const res = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      console.error('DeepSeek API call failed, using fallback:', e);
      return mockResponse(messages[messages.length - 1]?.content || '');
    }
  },

  async planTrip(destination: string, days: number): Promise<string> {
    return this.sendMessage([
      { role: 'user', content: `Plan a ${days}-day itinerary for ${destination} in Kathmandu Valley. Include heritage sites, local food, and hidden gems.` },
    ]);
  },

  async generateStory(siteName: string): Promise<string> {
    return this.sendMessage([
      { role: 'user', content: `Tell me the history, legends, architecture, and cultural significance of ${siteName} in Kathmandu Valley.` },
    ]);
  },

  async recommendNearby(category: string, location: string): Promise<string> {
    return this.sendMessage([
      { role: 'user', content: `Recommend authentic ${category} places near ${location} in Kathmandu that tourists usually miss.` },
    ]);
  },
};

function mockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('heritage') || msg.includes('unesco')) {
    return `Kathmandu Valley is home to 7 UNESCO World Heritage Sites! Here are the must-visit ones:

**Swayambhunath Stupa** — The Monkey Temple, perched on a hill with panoramic valley views. Entry: NPR 200.
**Boudhanath Stupa** — One of the largest spherical stupas in the world. The evening aarti is magical.
**Patan Durbar Square** — The finest collection of Newari architecture. Don't miss the Patan Museum.
**Bhaktapur Durbar Square** — Best preserved of the three squares. Try the famous juju dhau (king curd).
**Pashupatinath Temple** — Sacred Hindu temple along the Bagmati River. View from the eastern bank.
**Kathmandu Durbar Square** — The historic royal palace complex with the living goddess Kumari.
**Changu Narayan Temple** — The oldest temple in Nepal, dating back to the 4th century.

Pro tip: Buy a multi-entry pass for NPR 1,000 covering all seven sites, valid for one week.`;

  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('momo') || msg.includes('restaurant')) {
    return `Let me share some authentic local food experiences:

🥟 **Momo Palace** (Thamel) — Steamed buffalo momos with secret recipe tomato achar. NPR 250.
🍛 **Newa Lahana** (Patan) — Traditional Newari set meal on copper plates. Try kwati and chhwela. NPR 500.
🍚 **Thakali Bhancha** (Durbar Marg) — Legendary dal bhat power lunch from the Mustang region. NPR 400.
🍯 **Juju Dhau** (Bhaktapur) — The famous king curd, a sweet yoghurt you'll only find here.

Local wisdom: Look for places where workers eat lunch — that's where the food is freshest and most authentic.`;

  }

  if (msg.includes('hidden') || msg.includes('off the beaten') || msg.includes('secret')) {
    return `Here are hidden gems most tourists miss:

🏘️ **Kirtipur** — An ancient Newari hilltop town with stunning views and zero crowds.
🏡 **Bungamati** — The ancestral village of Patan's woodcarvers. Feels frozen in time.
🛢️ **Khokana** — A tiny mustard oil mill village, untouched by tourism for 400 years.
🌿 **Nagi Gompa** — A peaceful nunnery above Kathmandu with incredible valley views.
🌸 **Garden of Dreams** — A serene neo-classical garden hidden behind Thamel's chaos.

These places feel like discovering another side of Nepal entirely.`;

  }

  return `Namaste! 👋 I'm your Nepali Sathi guide.

Here are some ways I can help you explore Kathmandu Valley:

• **Plan a day trip** — Tell me how many days you have
• **Find authentic food** — Local eateries, not tourist traps
• **Hidden gems** — Places most guidebooks miss
• **Heritage stories** — History and legends of each site
• **Cultural etiquette** — How to respect local customs
• **Budget tips** — How to explore on any budget

What would you like to know about Nepal?`;
}