import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const SQL_FIX_INSTRUCTION = `⚠️ Database setup issue detected.

Please run this SQL in your Supabase SQL Editor to fix:

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS handle_new_user();

Then try signing up again.`;

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!form.name.trim()) {
      errors.name = 'Name is required.';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (form.password.length > 128) {
      errors.password = 'Password must be under 128 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);

    if (result.success) {
      addToast('success', 'Passport created! Welcome to Nepali Sathi.');
      navigate('/dashboard');
    } else {
      const errMsg = typeof result.error === 'string' ? result.error : 'Registration failed. Please try again.';
      if (result.error && result.error.includes('check your email')) {
        addToast('success', 'Account created! Check your email to verify, then sign in.');
        setGeneralError(errMsg);
      } else if (result.error && result.error.includes('Database setup issue')) {
        setGeneralError(SQL_FIX_INSTRUCTION);
      } else {
        setGeneralError(errMsg);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-text-primary">Nepali Sathi</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create your passport</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Start collecting heritage stamps from Nepal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={fieldErrors.name}
            required
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={fieldErrors.email}
            required
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password (6+ characters)"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={fieldErrors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {generalError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{generalError}</p>
          )}

          <p className="text-xs text-text-secondary">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          <Button type="submit" className="w-full" loading={loading}>
            {loading ? 'Creating passport...' : 'Create passport'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:text-primary-700 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}