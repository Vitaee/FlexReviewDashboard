import type { ThemeMode } from '../hooks/useTheme';

const navLinks = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Insights', href: '#insights' },
  { label: 'Properties', href: '#properties' },
  { label: 'Public View', href: '#public' },
];

interface SiteHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const SiteHeader = ({}: SiteHeaderProps) => (
  <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-white">
          Flex
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
            The Flex
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">Living Intelligence</p>
        </div>
      </div>
      <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            {link.label}
          </a>
        ))}
      </nav>
      
    </div>
  </header>
);

export default SiteHeader;
