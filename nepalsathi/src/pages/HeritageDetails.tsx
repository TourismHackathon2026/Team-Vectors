import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Star, Stamp, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { heritageSites } from '../data/heritage';
import { passportService } from '../services/passport';

export default function HeritageDetails() {
  const { id } = useParams<{ id: string }>();
  const site = heritageSites.find((s) => s.id === id);
  const [justCollected, setJustCollected] = useState(false);

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

  const alreadyCollected = passportService.hasEntry(site.id);

  const handleCollect = () => {
    if (!alreadyCollected) {
      passportService.addEntry(site.id, site.name);
      setJustCollected(true);
    }
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
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white/20" />
            </div>
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

          <div className="mt-8 flex items-center gap-4">
            {alreadyCollected || justCollected ? (
              <Button disabled className="gap-2 bg-green-600 hover:bg-green-600 cursor-default">
                <Check className="w-4 h-4" />
                Stamp Collected
              </Button>
            ) : (
              <Button onClick={handleCollect} className="gap-2">
                <Stamp className="w-4 h-4" />
                Collect Stamp
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}