import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Calendar, MapPin, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate, getLevelTitle } from '../utils/helpers';

export default function Profile() {
  const { user, logout } = useAuth();
  const { passportStamps } = useData();

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
              {user?.name ? (
                <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <UserIcon className="w-8 h-8" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              {user?.name || 'Your Profile'}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {user ? `Level ${user.level} ${getLevelTitle(user.level)}` : 'Sign in to see your profile.'}
            </p>
          </div>

          <Card padding="md">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="text-sm text-text-primary">{user?.email || 'Not signed in'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Member Since</p>
                  <p className="text-sm text-text-primary">
                    {user?.joinedAt ? formatDate(user.joinedAt) : '\u2014'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Stamps Collected</p>
                  <p className="text-sm text-text-primary">
                    {passportStamps?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex flex-col items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" disabled>Edit Profile</Button>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-red-500 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <a href="/login">
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}