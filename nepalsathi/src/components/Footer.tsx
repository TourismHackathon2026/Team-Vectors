import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe, Camera, MessageCircle, Video } from 'lucide-react';

const footerLinks = [
  {
    title: 'Explore',
    links: [
      { label: 'Heritage Sites', path: '/explore' },
      { label: 'My Passport', path: '/passport' },
      { label: 'Stamps', path: '/stamps' },
      { label: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', path: '#' },
      { label: 'FAQs', path: '#' },
      { label: 'Accessibility', path: '#' },
      { label: 'Feedback', path: '#' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', icon: Globe, href: '#' },
  { label: 'Instagram', icon: Camera, href: '#' },
  { label: 'Twitter', icon: MessageCircle, href: '#' },
  { label: 'Youtube', icon: Video, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-text-primary tracking-tight">
                Nepali Sathi
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Your local friend for exploring Nepal. Discover UNESCO World Heritage
              Sites, collect digital passport stamps, and experience Nepal like a
              local.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@nepalisathi.com"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@nepalisathi.com
              </a>
              <a
                href="tel:+977123456789"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +977 1 234 56789
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Nepali Sathi. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-50 transition-all duration-200"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
