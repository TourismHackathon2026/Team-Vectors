import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, Building, Globe, AlertTriangle, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { emergencyContacts, safetyTips } from '../data/emergency';
import { cn } from '../utils/helpers';

const typeConfig = {
  hospital: { label: 'Hospitals', icon: Building, color: 'text-red-600 bg-red-50', border: 'border-red-200' },
  police: { label: 'Police', icon: Shield, color: 'text-blue-600 bg-blue-50', border: 'border-blue-200' },
  embassy: { label: 'Embassies', icon: Globe, color: 'text-purple-600 bg-purple-50', border: 'border-purple-200' },
  safety: { label: 'Emergency', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
};

const types = ['hospital', 'police', 'embassy', 'safety'] as const;

export default function Emergency() {
  const [activeType, setActiveType] = useState<string>('all');
  const [tipsOpen, setTipsOpen] = useState(false);

  const filtered = activeType === 'all'
    ? emergencyContacts
    : emergencyContacts.filter((c) => c.type === activeType);

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Badge variant="primary" size="md" className="mb-3">
            Safety
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Emergency Contacts
          </h1>
          <p className="mt-2 text-text-secondary">
            Important contacts and safety tips for your visit to Nepal.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveType('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              activeType === 'all' ? 'bg-primary text-white' : 'bg-card border border-border text-text-secondary hover:text-text-primary',
            )}
          >
            All
          </button>
          {types.map((type) => {
            const cfg = typeConfig[type];
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5',
                  activeType === type
                    ? `${cfg.color} ${cfg.border}`
                    : 'bg-card border-border text-text-secondary hover:text-text-primary',
                )}
              >
                <cfg.icon className="w-4 h-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filtered.map((contact, i) => {
            const cfg = typeConfig[contact.type];
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card hover padding="md">
                  <div className="flex items-start gap-4">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
                      <cfg.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary">{contact.name}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">{contact.address}</p>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {contact.phone}
                      </a>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="shrink-0"
                    >
                      <Button size="sm" variant="primary" className="gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5" />
                        Call
                      </Button>
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Card padding="md" className="border-amber-200 bg-amber-50/30">
            <button
              onClick={() => setTipsOpen(!tipsOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-primary">Safety Tips</h2>
                  <p className="text-xs text-text-secondary">Important advice for a safe journey</p>
                </div>
              </div>
              {tipsOpen ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
            </button>

            {tipsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-amber-200"
              >
                <div className="prose prose-sm max-w-none">
                  {safetyTips.split('\n\n').map((section, i) => {
                    const lines = section.split('\n');
                    const title = lines[0];
                    const body = lines.slice(1).join('\n');
                    return (
                      <div key={i} className="mb-4 last:mb-0">
                        <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
                        {body && <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{body}</p>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
