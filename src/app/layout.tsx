import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SafeAlert – AI-Powered Disaster Management & Early Warning System',
  description: 'National Emergency Operations Centre (EOC) environmental monitoring, meteorological telemetry, and disaster risk assessment platform for Sri Lanka.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('safealert_theme');
                if (storedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-surface-bg dark:bg-surface-darkBg text-surface-text dark:text-surface-darkText selection:bg-brand-light dark:selection:bg-brand-hover selection:text-brand-dark transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
