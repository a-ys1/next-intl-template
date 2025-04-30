import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from '@c15t/react'

import { c15tConfig, ConsentScriptHandler } from '@/lib/c15tClient'
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <head>
        {/* Necessary script that always runs */}
        <script 
          type="text/javascript" 
          data-category="necessary" 
          dangerouslySetInnerHTML={{ __html: `
            console.log('necessary script executed');
          `}}
        ></script>
        
        {/* Measurement script - will only run when consent is given */}
        <script 
          type="text/plain" 
          data-category="measurement" 
          dangerouslySetInnerHTML={{ __html: `
            console.log('measurement script executed');
          `}}
        ></script>
      </head>
      <body>
        <NextIntlClientProvider>
        <ConsentManagerProvider options={c15tConfig}>
            <CookieBanner />
            <ConsentManagerDialog />
            <ConsentScriptHandler />
            <Header />
            {children}
          </ConsentManagerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}