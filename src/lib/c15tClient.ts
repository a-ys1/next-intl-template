'use client'

import { ConsentManagerOptions } from '@c15t/react'
import { useEffect } from 'react'

const scriptHandler = (consentResponse: any) => {
	console.log('inside scriptHandler');
  if (!consentResponse || !consentResponse.preferences) return;
  
  const preferences = consentResponse.preferences;
  
  // Find all scripts with data-category attribute
  const scripts = document.querySelectorAll('script[data-category]');
  
  scripts.forEach(script => {
    const category = script.getAttribute('data-category');
    
    // Skip if no category or if it's the necessary category (always enabled)
    if (!category || category === 'necessary') return;
    
    const isConsented = preferences[category] === true;
    
    if (isConsented) {
      // If consented and script is disabled (type="text/plain"), enable it
      if (script.getAttribute('type') === 'text/plain') {
        const scriptSrc = script.getAttribute('src');
        
        // Create a new script element
        const newScript = document.createElement('script');
        
        // Copy all attributes except type
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'type') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        
        // Set proper type to make it execute
        newScript.setAttribute('type', 'text/javascript');
        
        // If it has inner content, copy it
        if (script.innerHTML) {
          newScript.innerHTML = script.innerHTML;
        }
        
        // Safety check: Ensure the script is still in the DOM and has a parent node
        // This prevents errors during page transitions when scripts might be removed
        if (script.parentNode && document.body.contains(script)) {
          // Replace the old script with the new one
          script.parentNode.replaceChild(newScript, script);
          console.log(`Activated ${category} script: ${script.id || scriptSrc || 'inline script'}`);
        } else {
          console.log(`Script was removed from DOM before activation: ${script.id || scriptSrc || 'inline script'}`);
        }
      }
    } else {
      // If not consented and script is active, disable it by setting type to text/plain
      if (script.getAttribute('type') !== 'text/plain') {
        script.setAttribute('type', 'text/plain');
        console.log(`Deactivated ${category} script: ${script.id || script.getAttribute('src') || 'inline script'}`);
      }
    }
  });
};

export function ConsentScriptHandler() {
  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem('c15t-consent');
      if (storedConsent) {
        const consentData = JSON.parse(storedConsent);
        scriptHandler(consentData);
      }
    } catch (error) {
      console.error('Error initializing consent scripts:', error);
    }
    
    // Clean up function for when this component unmounts
    return () => {
      console.log('ConsentScriptHandler unmounting');
    };
  }, []);
  
  return null;
}

export const c15tConfig = {
  mode: 'offline',
  react: {
    colorScheme: 'light',
  },
  translations: {
    defaultLanguage: 'de',
  },
  store: {
    initialGdprTypes: ['necessary', 'measurement', 'experience'],
  },
  callbacks: {
    onConsentSet: (response) => {
      console.log('Consent set', response);
      scriptHandler(response);
    }
  }
} satisfies ConsentManagerOptions;