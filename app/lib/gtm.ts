/**
 * Google Tag Manager event tracking utility
 */

export interface GTMEvent {
  event: string;
  [key: string]: any;
}

/**
 * Track an event in Google Tag Manager
 * @param event - The event name
 * @param data - Additional event data
 */
export const trackGTMEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

/**
 * Track a form submission
 */
export const trackFormSubmission = (formName: string) => {
  trackGTMEvent('form_submit', {
    form_name: formName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a page view
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  trackGTMEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track a link click
 */
export const trackLinkClick = (linkText: string, linkUrl: string) => {
  trackGTMEvent('link_click', {
    link_text: linkText,
    link_url: linkUrl,
  });
};

/**
 * Track a button click
 */
export const trackButtonClick = (buttonName: string) => {
  trackGTMEvent('button_click', {
    button_name: buttonName,
  });
};
