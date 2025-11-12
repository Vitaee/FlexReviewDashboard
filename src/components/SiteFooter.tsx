const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Roadmap', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'API', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

const SiteFooter = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">The Flex</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Guest Experience Team</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Operational clarity for every stay. Track sentiment, approvals, and guest-ready content in one place.
        </p>
      </div>
      {footerColumns.map((column) => (
        <div key={column.title}>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{column.title}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            {column.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-indigo-600 dark:hover:text-indigo-300">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-100 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        <p>Copyright {new Date().getFullYear()} The Flex. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">
            Privacy
          </a>
          <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">
            Terms
          </a>
          <a href="#" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">
            Security
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
