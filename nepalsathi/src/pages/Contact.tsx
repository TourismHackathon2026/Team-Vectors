import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'hello@nepalisathi.com' },
  { icon: Phone, label: 'Phone', value: '+977 1 234 56789' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+977 98 1234 5678' },
];

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <Badge variant="primary" size="md" className="mb-3">
            Get in Touch
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-text-primary">
            Contact Us
          </h1>
          <p className="mt-2 text-text-secondary">
            Have a question, feedback, or want to collaborate? We&apos;d love to
            hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="name" label="Name" placeholder="Your name" required />
                <Input id="email" label="Email" type="email" placeholder="you@example.com" required />
              </div>
              <Input id="subject" label="Subject" placeholder="How can we help?" />
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-medium text-text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us more..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  required
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((method) => (
              <div
                key={method.label}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <method.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{method.label}</p>
                  <p className="text-sm font-medium text-text-primary">{method.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Location</p>
                <p className="text-sm font-medium text-text-primary">
                  Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}