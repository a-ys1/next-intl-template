'use client'

import LocaleSwitcher from './LocaleSwitcher';
import { useConsentManager } from '@c15t/react';
const Header = () => {
	const c15t = useConsentManager()
  return (
    <header>
      <LocaleSwitcher />
			<button
      onClick={() => c15t.setIsPrivacyDialogOpen(true)}
      className="privacy-button"
    >
      Privacy Settings
    </button>
    </header>
  );
};

export default Header;