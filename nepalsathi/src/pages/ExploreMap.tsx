import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, ExternalLink,
  BookmarkCheck, Heart, Route,
} from 'lucide-react';
import { MapView } from '../components/MapView';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AuthenticityBadge } from '../components/ui/AuthenticityBadge';
import { StarRating } from '../components/ui/StarRating';
import { useData } from '../context/DataContext';
import { places, placeCategories } from '../data/places';
import { cn } from '../utils/helpers';

const sortOptions = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Authentic', value: 'authenticity' },
  { label: 'Nearest', value: 'distance' },
];

export default function ExploreMap() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [routePlaces, setRoutePlaces] = useState<string[]>([]);
  const { savedPlaces, toggleSavePlace } = useData();

  const filtered = useMemo(() => {
    let result = places.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'authenticity') return b.authenticityScore - a.authenticityScore;
      return 0;
    });

    return result;
  }, [search, activeCategory, sortBy]);

  const toggleRoute = (id: string) => {
    setRoutePlaces((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-[35%] xl:w-[32%] border-r border-border bg-white overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <Badge variant="primary" size="md" className="mb-2">Interactive Map</Badge>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-text-primary">
                Explore Map
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Discover {places.length} authentic places across Kathmandu.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search places..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {placeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:text-text-primary hover:bg-gray-200',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-bg border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                className={cn(
                  'text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5',
                  heatmapEnabled
                    ? 'bg-primary text-white border-primary'
                    : 'bg-bg text-text-secondary border-border hover:text-text-primary',
                )}
              >
                <SlidersHorizontal className="w-3 h-3" />
                Heatmap
              </button>
            </div>

            {routePlaces.length > 0 && (
              <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary">
                    Route ({routePlaces.length} places)
                  </span>
                  <button
                    onClick={() => setRoutePlaces([])}
                    className="text-xs text-primary hover:text-primary-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {routePlaces.map((id) => {
                    const p = places.find((pl) => pl.id === id);
                    return p ? (
                      <span key={id} className="text-xs bg-white px-2 py-0.5 rounded-full border border-primary-200 text-primary">
                        {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
                {routePlaces.length >= 2 && (
                  <Button size="sm" variant="outline" className="mt-2 w-full text-xs gap-1">
                    <Route className="w-3 h-3" />
                    Generate Route
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2.5">
              {filtered.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-8">No places match your filters.</p>
              ) : (
                filtered.map((place, i) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  >
                    <Card
                      hover
                      padding="sm"
                      className={cn(
                        'cursor-pointer transition-all',
                        selectedId === place.id && 'ring-2 ring-primary border-primary',
                      )}
                      onClick={() => setSelectedId(place.id)}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg shrink-0 bg-gradient-to-br from-primary-900 to-primary-700 overflow-hidden">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-text-primary truncate">{place.name}</h3>
                              <Badge variant="default" size="sm" className="mt-0.5">{place.category}</Badge>
                            </div>
                            <AuthenticityBadge score={place.authenticityScore} size="sm" />
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-secondary">
                            <span>{place.distance}</span>
                            <span>•</span>
                            <StarRating rating={Math.round(place.rating)} size="sm" />
                            <span>{place.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSavePlace(place.id); }}
                              className={cn(
                                'p-1 rounded transition-colors',
                                savedPlaces.includes(place.id) ? 'text-red-500' : 'text-text-secondary hover:text-red-400',
                              )}
                            >
                              {savedPlaces.includes(place.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                            </button>
                            <Link to={`/heritage/${place.id}`} onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="ghost" className="text-xs h-6 px-2 gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Details
                              </Button>
                            </Link>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleRoute(place.id); }}
                              className={cn(
                                'p-1 rounded transition-colors',
                                routePlaces.includes(place.id)
                                  ? 'text-primary bg-primary-50'
                                  : 'text-text-secondary hover:text-primary',
                              )}
                            >
                              <Route className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[65%] xl:w-[68%] relative">
          <MapView
            places={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            heatmapEnabled={heatmapEnabled}
          />
        </div>
      </div>
    </div>
  );
}