import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Profile() {
  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Your Profile</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Manage your account and preferences.
            </p>
          </div>

          <Card padding="md">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="text-sm text-text-primary">Not signed in</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Member Since</p>
                  <p className="text-sm text-text-primary">—</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <Button variant="outline" disabled>
              Edit Profile
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}