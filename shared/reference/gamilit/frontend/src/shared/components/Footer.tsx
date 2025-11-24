import React from 'react';
import { cn } from '@shared/utils';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
  copyrightText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  links = [],
  copyrightText = `© ${new Date().getFullYear()} GAMILIT. Todos los derechos reservados.`
}) => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        {/* Links */}
        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 transition text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
};
