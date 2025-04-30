import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
 
export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Go to homepage</Link>
    </div>
  );
}