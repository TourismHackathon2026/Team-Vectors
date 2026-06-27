import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Compass, Users, BookOpen, Map, Wifi } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { featuredSites, features, howItWorks, stats, testimonials } from '../data/heritage';
import type { HeritageSite } from '../types';

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-amber-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(198,138,43,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,83,45,0.3),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" size="md" className="mb-6">
              Your Local Friend for Exploring Nepal
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-white leading-tight"
          >
            Discover Kathmandu,
            <br />
            <span className="text-secondary">One Heritage Site</span>
            <br />
            at a Time.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed"
          >
            Your digital passport to Nepal&apos;s UNESCO World Heritage Sites.
            Collect stamps, uncover stories, and explore the Valley like a local
            — not a tourist.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/explore">
              <Button size="lg" className="gap-2">
                Explore Heritage
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Create Passport
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeritageCard({ site, index }: { site: HeritageSite; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/heritage/${site.id}`}>
        <Card hover className="group h-full overflow-hidden">
          <div className="relative h-52 -mx-6 -mt-6 mb-5 overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white/30" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <Badge variant="secondary" size="sm">
                {site.category}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">
              {site.shortDescription}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-text-secondary">{site.location}</span>
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(site.rating)} size="sm" />
                <span className="text-xs text-text-secondary">{site.rating}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function FeaturedSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <Badge variant="primary" size="md" className="mb-3">
              UNESCO Heritage
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
              Featured Heritage Sites
            </h2>
            <p className="mt-2 text-text-secondary max-w-xl">
              Step into centuries of history. Each site tells a story of art,
              faith, and the enduring spirit of Nepal.
            </p>
          </div>
          <Link to="/explore">
            <Button variant="ghost" size="sm" className="gap-1.5 shrink-0">
              View all sites
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSites.map((site, i) => (
            <HeritageCard key={site.id} site={site} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    Passport: <MapPin className="w-5 h-5" />,
    Compass: <Compass className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Map: <Map className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    Wifi: <Wifi className="w-5 h-5" />,
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="primary" size="md" className="mb-3">
            Why Nepali Sathi
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Everything You Need to Explore Nepal
          </h2>
          <p className="mt-3 text-text-secondary">
            We built the tools we wished we had as travelers — thoughtful,
            beautiful, and built for the curious.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center mb-4">
                {iconMap[feature.icon]}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" size="md" className="mb-3">
            Getting Started
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            How It Works
          </h2>
          <p className="mt-3 text-text-secondary">
            Four simple steps to start your Nepali heritage journey.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center">
                  {item.step}
                </span>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-10 w-[calc(100%-2.5rem)] h-px bg-border -z-10" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold font-serif">
                {stat.value}
                <span className="text-secondary">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="primary" size="md" className="mb-3">
            Traveler Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Loved by Travelers
          </h2>
          <p className="mt-3 text-text-secondary">
            Real stories from people who explored Nepal with Nepali Sathi.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full flex flex-col">
                <StarRating rating={t.rating} size="sm" className="mb-3" />
                <blockquote className="text-sm text-text-secondary leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-secondary">{t.location}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-800 to-primary-900 px-8 py-16 lg:py-20 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(198,138,43,0.2),transparent_60%)]" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-200 mb-8">
              Create your free digital passport and start collecting heritage
              stamps today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-secondary text-white hover:bg-secondary-600 gap-2"
                >
                  Create Your Passport
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Browse Heritage Sites
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
