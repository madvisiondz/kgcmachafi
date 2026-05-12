import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { servicesPath } from '../../routes/paths';

function Icon({ children, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const Icons = {
  facebook: (props) => (
    <Icon {...props}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3z" />
    </Icon>
  ),
  x: (props) => (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      className={props?.className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  ),
  instagram: (props) => (
    <Icon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </Icon>
  ),
  youtube: (props) => (
    <Icon {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <path d="m9.75 15.02 5.27-3.02-5.27-3.02v6.04z" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
    </Icon>
  ),
  mail: (props) => (
    <Icon {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </Icon>
  ),
  pin: (props) => (
    <Icon {...props}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
};

export default function Footer() {
  const { t } = useI18n();

  const links = useMemo(
    () => [
      {
        title: t('footer.sections.main'),
        items: [
          { label: t('footer.brandName'), href: servicesPath('/') },
          { label: t('nav.programs'), href: servicesPath('/programs') },
          { label: t('nav.services'), href: servicesPath('/service') },
          { label: t('nav.live'), href: servicesPath('/live') },
        ],
      },
      {
        title: t('footer.sections.services'),
        items: [
          { label: t('nav.consultations'), href: servicesPath('/consultations') },
          { label: t('nav.donations'), href: servicesPath('/donations') },
          { label: t('nav.hospitals'), href: servicesPath('/hospitals') },
          { label: t('nav.library'), href: servicesPath('/library') },
        ],
      },
      {
        title: t('footer.sections.readMore'),
        items: [
          { label: t('common.privacyPolicy'), href: servicesPath('/privacy') },
          { label: t('common.terms'), href: servicesPath('/terms') },
          { label: t('nav.pharmacies'), href: servicesPath('/pharmacies') },
        ],
      },
    ],
    [t],
  );

  return (
    <footer id="footer" className="bg-gradient-to-br from-gray-900 to-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <div>
                <span className="text-2xl font-bold">{t('footer.brandName')}</span>
                <p className="text-sm text-gray-400">{t('footer.slogan')}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{t('footer.description')}</p>

            <div className="flex gap-3">
              {[
                { key: 'facebook', icon: Icons.facebook, label: t('header.social.facebook'), tone: 'hover:text-blue-400' },
                { key: 'x', icon: Icons.x, label: t('header.social.x'), tone: 'hover:text-slate-200' },
                { key: 'instagram', icon: Icons.instagram, label: t('header.social.instagram'), tone: 'hover:text-pink-400' },
                { key: 'youtube', icon: Icons.youtube, label: t('header.social.youtube'), tone: 'hover:text-red-400' },
              ].map((s) => (
                <a
                  key={s.key}
                  href="#"
                  aria-label={s.label}
                  className={`rounded-full bg-gray-800 hover:bg-gray-700 transition-colors w-10 h-10 grid place-items-center ${s.tone}`}
                >
                  {s.icon({ className: 'w-5 h-5' })}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {links.map((section) => (
            <div key={section.title}>
              <span className="text-lg font-bold mb-4 block">{section.title}</span>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-gray-400 hover:text-green-400 transition-colors text-start w-full inline-block">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <span className="text-lg font-bold mb-4 block">{t('common.contactUs')}</span>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {Icons.phone({ className: 'w-5 h-5 text-green-400 mt-1 flex-shrink-0' })}
                <div>
                  <p className="text-gray-400">{t('common.phone')}:</p>
                  <p className="text-white" dir="ltr">
                    {t('footer.phone')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {Icons.mail({ className: 'w-5 h-5 text-green-400 mt-1 flex-shrink-0' })}
                <div>
                  <p className="text-gray-400">{t('common.email')}:</p>
                  <p className="text-white">{t('footer.email')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {Icons.pin({ className: 'w-5 h-5 text-green-400 mt-1 flex-shrink-0' })}
                <div>
                  <p className="text-gray-400">{t('common.address')}:</p>
                  <p className="text-white">{t('footer.address')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-right">{t('common.copyright')}</p>
            <p className="text-gray-400 text-center md:text-left">{t('common.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

