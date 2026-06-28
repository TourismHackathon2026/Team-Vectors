import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, Calendar, Star, Stamp, Check, QrCode, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { AIStoryMode } from '../components/AIStoryMode';
import { QRScanner } from '../components/QRScanner';
import { heritageSites } from '../data/heritage';
import { reviewService } from '../data/reviews';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import type { Review } from '../types';

export default function HeritageDetails() {
  const { id } = useParams<{ id: string }>();
  const site = heritageSites.find((s) => s.id === id);
  const { user, updateProfile } = useAuth();
  const { passportStamps, addStamp, addActivity, unlockAchievement } = useData();
  const { addToast } = useToast();
  const [justCollected, setJustCollected] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (site) {
      reviewService.getBySite(site.id).then(setReviews);
    }
  }, [site]);

  const handleReviewSubmit = async () => {
    if (!reviewForm.comment.trim() || !site || !user) return;
    setSubmitting(true);
    const r = await reviewService.add(site.id, user.id, user.name, reviewForm.rating, reviewForm.comment.trim());
    setReviews((prev) => [r, ...prev]);
    addToast('success', 'Review submitted!');
    setReviewForm({ rating: 5, comment: '' });
    setSubmitting(false);
  };

  const handleQrScan = (siteId: string, siteName: string) => {
    if (alreadyCollected || !site) return;
    if (siteId !== site.id) {
      addToast('info', `This QR code is for ${siteName}, not ${site.name}`);
      return;
    }
    handleCollect();
  };

  if (!site) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Site not found</h1>
        <p className="mt-2 text-text-secondary">This heritage site doesn&apos;t exist.</p>
        <Link to="/explore">
          <Button variant="ghost" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to explore
          </Button>
        </Link>
      </div>
    );
  }

  const alreadyCollected = passportStamps.some((s) => s.siteId === site.id);

  const handleCollect = () => {
    if (alreadyCollected) return;
    addStamp(site.id, site.name);
    if (user) {
      updateProfile({ xp: (user.xp || 0) + 50 });
    }
    addActivity('stamp', `Collected stamp at ${site.name}`);
    addToast('success', `Stamp collected at ${site.name}! +50 XP`);
    if (passportStamps.length + 1 >= 10) {
      unlockAchievement('ach-stamps');
      addToast('success', 'Achievement unlocked: Stamp Collector!');
    }
    setJustCollected(true);
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to explore
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-amber-900 mb-8">
            <img
              src={site.image}
              alt={site.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <Badge variant="secondary" size="md" className="mb-2">
                {site.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white">
                {site.name}
              </h1>
              <p className="mt-1 text-gray-300">{site.location}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-text-secondary">Opening Hours</p>
                <p className="text-sm font-medium text-text-primary">{site.openingHours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <DollarSign className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-xs text-text-secondary">Entry Fee</p>
                <p className="text-sm font-medium text-text-primary">{site.entryFee}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-text-secondary">Best Time to Visit</p>
                <p className="text-sm font-medium text-text-primary">{site.bestTimeToVisit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Star className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-xs text-text-secondary">Rating</p>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={Math.round(site.rating)} size="sm" />
                  <span className="text-sm font-medium text-text-primary">{site.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-bold font-serif text-text-primary mb-3">About</h2>
            <p className="text-text-secondary leading-relaxed">{site.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {alreadyCollected || justCollected ? (
              <Button disabled className="gap-2 bg-green-600 hover:bg-green-600 cursor-default">
                <Check className="w-4 h-4" />
                Stamp Collected
              </Button>
            ) : (
              <>
                <Button onClick={handleCollect} className="gap-2">
                  <Stamp className="w-4 h-4" />
                  Collect Stamp (Manual)
                </Button>
                <Button onClick={() => setQrOpen(true)} variant="secondary" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Scan QR Code
                </Button>
              </>
            )}
          </div>

          <QRScanner open={qrOpen} onClose={() => setQrOpen(false)} onScan={handleQrScan} />

          <AIStoryMode siteId={site.id} siteName={site.name} />

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-serif text-text-primary">Reviews</h2>
              <span className="text-sm text-text-secondary">({reviews.length})</span>
            </div>

            {user && (
              <div className="mb-6 p-4 rounded-lg bg-card border border-border space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">Write a Review</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= reviewForm.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
                <Button size="sm" onClick={handleReviewSubmit} disabled={submitting || !reviewForm.comment.trim()}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-text-secondary">No reviews yet. Be the first to share your experience!</p>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-card border border-border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{review.userName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      <span className="text-xs text-text-secondary shrink-0">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}