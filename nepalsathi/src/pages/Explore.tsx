import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { heritageSites } from '../data/heritage';
import type { HeritageSite } from '../types';

const categories = ['All', 'UNESCO', 'Cultural', 'Natural', 'Religious'] as const;

function HeritageCard({ site }: { site: HeritageSite }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/heritage/${site.id}`}>
        <Card hover className="group h-full overflow-hidden">
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white/30" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <Badge variant="secondary" size="sm">
                {site.category}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">{site.location}</p>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              {site.shortDescription}
            </p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(site.rating)} size="sm" />
                <span className="text-xs text-text-secondary">{site.rating}</span>
              </div>
              <span className="text-xs text-text-secondary">{site.bestTimeToVisit}</span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = heritageSites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.location.toLowerCase().includes(search.toLowerCase()) ||
      site.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || site.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge variant="primary" size="md" className="mb-3">
            Discover Nepal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Explore Heritage Sites
          </h1>
          <p className="mt-2 text-text-secondary max-w-xl">
            Browse Nepal&apos;s UNESCO World Heritage Sites and hidden cultural
            treasures. Filter by category or search by name.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search sites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-text-secondary hover:text-text-primary hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-text-secondary">No sites match your search.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((site) => (
              <HeritageCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}