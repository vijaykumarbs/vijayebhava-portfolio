const analyticsEvent = (network: "whatsapp" | "linkedin") => network === "whatsapp" ? "whatsapp_click" : "linkedin_profile_click";

export function SocialIcon({ network }: { network: "whatsapp" | "linkedin" }) {
  return network === "whatsapp" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M12.04 2a9.87 9.87 0 0 0-8.48 14.92L2.3 21.7l4.9-1.29A9.94 9.94 0 1 0 12.04 2Zm0 18.1a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-2.91.77.78-2.84-.2-.31a8.16 8.16 0 1 1 6.77 3.69Zm4.48-6.11c-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.12-.56.12-.17.25-.65.81-.8.98-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.1-.23-.16-.48-.28Z" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V8.99h3.56v11.46ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" /></svg>
  );
}

export function SocialLink({ network, href, placement }: { network: "whatsapp" | "linkedin"; href: string; placement: string }) {
  const label = network === "whatsapp" ? "WhatsApp" : "LinkedIn";
  return <a className="social-icon-link" href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" data-analytics-event={analyticsEvent(network)} data-analytics-network={network} data-analytics-placement={placement}><SocialIcon network={network} /></a>;
}
