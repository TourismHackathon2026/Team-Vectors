import type { Quest } from '../types';

export const quests: Quest[] = [
  { id: 'quest-01', title: 'Morning at Swayambhunath', description: 'Visit the Monkey Temple at sunrise and count the prayer flags.', xpReward: 100, category: 'Heritage', completed: false, icon: 'Sun' },
  { id: 'quest-02', title: 'Momo Champion', description: 'Try momos from three different local shops in one day.', xpReward: 150, category: 'Food', completed: false, icon: 'UtensilsCrossed' },
  { id: 'quest-03', title: 'Pottery Apprentice', description: 'Try making a pot at Patan Pottery Square.', xpReward: 200, category: 'Crafts', completed: false, icon: 'Hand' },
  { id: 'quest-04', title: 'Sunrise Over the Himalayas', description: 'Watch the sunrise from Nagarkot viewpoint.', xpReward: 250, category: 'Nature', completed: false, icon: 'Sunrise' },
  { id: 'quest-05', title: 'Evening Aarti', description: 'Witness the evening aarti ceremony at Boudhanath.', xpReward: 100, category: 'Culture', completed: false, icon: 'Music' },
  { id: 'quest-06', title: 'Coffee Connoisseur', description: 'Visit three different local coffee shops in Thamel.', xpReward: 100, category: 'Coffee', completed: false, icon: 'Coffee' },
  { id: 'quest-07', title: 'Market Navigator', description: 'Find five handmade souvenirs at Asan Tole Market.', xpReward: 150, category: 'Shopping', completed: false, icon: 'ShoppingBag' },
  { id: 'quest-08', title: 'Hidden Village Explorer', description: 'Walk through the ancient streets of Kirtipur.', xpReward: 200, category: 'Hidden Gems', completed: false, icon: 'Map' },
  { id: 'quest-09', title: 'Durbar Square Tour', description: 'Visit all three Durbar Squares in one day.', xpReward: 300, category: 'Heritage', completed: false, icon: 'Landmark' },
  { id: 'quest-10', title: 'Newari Feast', description: 'Try a traditional Newari set meal at a local kitchen.', xpReward: 200, category: 'Food', completed: false, icon: 'UtensilsCrossed' },
  { id: 'quest-11', title: 'Woodcarving Witness', description: 'Watch a master woodcarver at work in Patan.', xpReward: 150, category: 'Crafts', completed: false, icon: 'Carve' },
  { id: 'quest-12', title: 'Nature Photographer', description: 'Capture five different bird species at Shivapuri.', xpReward: 150, category: 'Nature', completed: false, icon: 'Camera' },
  { id: 'quest-13', title: 'Living Goddess Visit', description: 'See the Kumari at Hanuman Dhoka Palace.', xpReward: 100, category: 'Culture', completed: false, icon: 'Crown' },
  { id: 'quest-14', title: 'Tea House Hopper', description: 'Try tea at three different traditional tea houses.', xpReward: 100, category: 'Coffee', completed: false, icon: 'CupSoda' },
  { id: 'quest-15', title: 'Silk Road Shopper', description: 'Buy a piece of handmade pashmina from Indra Chowk.', xpReward: 150, category: 'Shopping', completed: false, icon: 'ShoppingBag' },
  { id: 'quest-16', title: 'Off the Beaten Path', description: 'Find the hidden village of Khokana and its mustard oil mill.', xpReward: 250, category: 'Hidden Gems', completed: false, icon: 'Compass' },
  { id: 'quest-17', title: 'Stupa Circuit', description: 'Visit all four major stupas in Kathmandu Valley.', xpReward: 250, category: 'Heritage', completed: false, icon: 'CircleDot' },
  { id: 'quest-18', title: 'Spice Market Explorer', description: 'Identify five different Nepali spices at a local market.', xpReward: 100, category: 'Food', completed: false, icon: 'Soup' },
  { id: 'quest-19', title: 'Village Weaver', description: 'Watch traditional weaving at a village cooperative.', xpReward: 200, category: 'Crafts', completed: false, icon: 'Fabric' },
  { id: 'quest-20', title: 'Sunset at the Stupa', description: 'Watch sunset from Boudhanath with the locals.', xpReward: 150, category: 'Culture', completed: false, icon: 'Sunset' },

  // Secret questline — hidden until all Heritage quests are completed
  { id: 'quest-21', title: '🗝️ The Lost Temple of Kathmandu', description: 'Find the hidden temple beneath the city streets. Speak to three local elders for clues.', xpReward: 500, category: 'Hidden Gems', completed: false, icon: 'Key' },
  { id: 'quest-22', title: '🗝️ Guardian of the Valley', description: 'Collect stamps at all 7 UNESCO sites in Kathmandu Valley. The ancient guardians will recognize you.', xpReward: 1000, category: 'Heritage', completed: false, icon: 'Shield' },
  { id: 'quest-23', title: '🗝️ The Final Pilgrimage', description: 'Complete all Heritage and Hidden Gems quests. The secret path to the Lost Valley is revealed only to true explorers.', xpReward: 2000, category: 'Hidden Gems', completed: false, icon: 'Trophy' },
];
