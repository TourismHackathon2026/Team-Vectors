import { supabase } from '../lib/supabase';
import { generateId } from '../utils/helpers';
import type { Review } from '../types';

const REVIEWS_KEY = 'nepali-sathi-reviews';

function getLocal(): Review[] {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocal(reviews: Review[]) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch { }
}

export const reviewService = {
  async getBySite(siteId: string): Promise<Review[]> {
    const local = getLocal().filter((r) => r.siteId === siteId);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    if (data && data.length > 0) {
      const remote: Review[] = data.map((r: any) => ({
        id: r.id,
        siteId: r.site_id,
        userId: r.user_id,
        userName: r.user_name || 'Anonymous',
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      }));
      const merged = [...remote, ...local.filter((l) => !remote.some((r) => r.id === l.id))];
      return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return local;
  },

  async add(siteId: string, userId: string, userName: string, rating: number, comment: string): Promise<Review> {
    const review: Review = {
      id: generateId(),
      siteId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    const { error } = await supabase.from('reviews').insert({
      id: review.id,
      site_id: siteId,
      user_id: userId,
      user_name: userName,
      rating,
      comment,
    });
    if (error) {
      const local = getLocal();
      local.unshift(review);
      saveLocal(local);
    }
    return review;
  },
};
