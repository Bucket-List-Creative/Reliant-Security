/**
 * Website FAQ copy from Reliant_Website_FAQ_Updates.xlsx.
 * Includes FAQ Copy Updates, New FAQs, and Page Layout. See docs/faq-updates.md
 * for placement and the workbook's outstanding pre-launch confirmations.
 * These curated lists take precedence over legacy CMS FAQs for known pages.
 */
export type WebsiteFaq = { question: string; answer: string };

export const HOME_FAQS: WebsiteFaq[] = [
  {
    "question": "How fast is your monitoring response?",
    "answer": "Reliant customers are backed by Becklar’s professional monitoring network. Becklar reports an average alarm-answering time of 9.4 seconds across six interconnected, UL-certified monitoring centers in North America. Once a signal is received, trained operators follow the appropriate verification and notification procedures."
  },
  {
    "question": "Does Reliant offer 24/7 emergency service or technical support?",
    "answer": "What runs 24/7 is professional monitoring — your alarm, smoke, and carbon-monoxide signals are watched and dispatched at any hour. Service calls and technical support are handled during regular business hours, and we schedule urgent service as quickly as we can."
  },
  {
    "question": "Do I need to sign a contract?",
    "answer": "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit."
  },
  {
    "question": "Do you only work on homes, or commercial projects too?",
    "answer": "Both. Reliant runs everything from single-family alarm systems to large commercial, industrial, and government projects — including video surveillance, access control, structured cabling and fiber, and audio/video. The same local team handles all of it."
  },
  {
    "question": "Can I keep my existing equipment?",
    "answer": "In many cases, yes. During an assessment we review the current hardware and recommend what is worth reusing or replacing. Initial consultations are generally free; any site assessment or design fee will be explained before scheduling."
  },
  {
    "question": "Are you tied to one manufacturer?",
    "answer": "No. Reliant is not locked into a single manufacturer or proprietary platform, so we design around the site's needs. When compliance standards apply, qualifying equipment and documentation are confirmed against the exact products and project requirements."
  }
];

export const CONTACT_FAQS: WebsiteFaq[] = [
  {
    "question": "What areas does Reliant serve?",
    "answer": "Reliant serves customers throughout the greater St. Louis region and travels for select commercial, industrial, and government projects. Contact us with your project location and we’ll confirm availability."
  },
  {
    "question": "Is the consultation or site assessment free?",
    "answer": "Initial consultations are generally free. Some complex, engineered, or out-of-area projects may require a paid site assessment or design fee, which will be explained before scheduling."
  }
];

export const ABOUT_FAQS: WebsiteFaq[] = [
  {
    "question": "Are you licensed and insured?",
    "answer": "Yes. Reliant is licensed and insured and holds St. Louis County Communications Contractor License C4491."
  }
];

export const PRICING_FAQS: WebsiteFaq[] = [
  {
    "question": "How much does a security system cost?",
    "answer": "Every property is different, but Reliant provides clear, itemized recommendations based on the equipment, installation, and monitoring services you actually need. Your pricing and agreement terms are reviewed before installation begins."
  },
  {
    "question": "Is the consultation or site assessment free?",
    "answer": "Initial consultations are generally free. Some complex, engineered, or out-of-area projects may require a paid site assessment or design fee, which will be explained before scheduling."
  },
  {
    "question": "Do I need to sign a contract?",
    "answer": "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit."
  },
  {
    "question": "Is there a warranty?",
    "answer": "Reliant offers applicable manufacturer warranties, a one-year workmanship warranty, and additional warranty benefits on qualifying monitored alarm systems. Exact coverage is provided with your proposal."
  },
  {
    "question": "What happens after I request a quote?",
    "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
  }
];

export const SERVICE_FAQS: Record<string, WebsiteFaq[]> = {
  "security-alarm": [
    {
      "question": "What happens when my alarm goes off?",
      "answer": "The signal is sent to the professional monitoring center, where a trained operator follows the appropriate verification procedure. Depending on the event and your response instructions, the operator may contact you, your emergency contacts, or the appropriate emergency agency."
    },
    {
      "question": "Will the alarm still work in a power outage?",
      "answer": "Yes. A backup battery keeps the panel running and cellular communication keeps it reporting even without power or a landline."
    },
    {
      "question": "Can I add cameras or smart devices later?",
      "answer": "Absolutely. Our alarm systems are modular, so you can add cameras, smart locks, and automation whenever you're ready."
    },
    {
      "question": "How much does a security system cost?",
      "answer": "Every property is different, but Reliant provides clear, itemized recommendations based on the equipment, installation, and monitoring services you actually need. Your pricing and agreement terms are reviewed before installation begins."
    },
    {
      "question": "Is there a warranty?",
      "answer": "Reliant offers applicable manufacturer warranties, a one-year workmanship warranty, and additional warranty benefits on qualifying monitored alarm systems. Exact coverage is provided with your proposal."
    },
    {
      "question": "Can I use the system without professional monitoring?",
      "answer": "Some equipment can operate locally without monitoring, but professional monitoring provides around-the-clock signal response and cellular communication services. We’ll explain the available options and limitations."
    },
    {
      "question": "Do I need to sign a contract?",
      "answer": "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "interactive-alarm": [
    {
      "question": "Do I need special equipment for app control?",
      "answer": "You need an interactive-capable panel and a monitoring plan that includes app access. We confirm compatibility during the assessment and recommend an upgrade if needed. Any site assessment or design fee will be explained before scheduling."
    },
    {
      "question": "Can multiple family members or employees have access?",
      "answer": "Yes. You can create individual user codes and app logins with different permission levels for each person."
    },
    {
      "question": "Will I still be notified if the internet goes down?",
      "answer": "Most professionally monitored systems use cellular communication, so alarm signals and important notifications can continue even if your Wi-Fi or internet connection goes down. Certain video and automation features may remain unavailable until internet service is restored."
    },
    {
      "question": "Do I need to sign a contract?",
      "answer": "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit."
    },
    {
      "question": "How much does a security system cost?",
      "answer": "Every property is different, but Reliant provides clear, itemized recommendations based on the equipment, installation, and monitoring services you actually need. Your pricing and agreement terms are reviewed before installation begins."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "wellness-safety-monitoring": [
    {
      "question": "How does a medical alert work?",
      "answer": "Pressing the pendant or panic button signals our monitoring center, which contacts you and dispatches help or notifies your emergency contacts right away."
    },
    {
      "question": "Can I get alerts if a pipe leaks while I’m away?",
      "answer": "Compatible water and temperature sensors can send immediate alerts when a problem is detected. Depending on the equipment and monitoring plan selected, alerts may be sent to your phone, the professional monitoring center, or both."
    },
    {
      "question": "Is this suitable for elderly parents living alone?",
      "answer": "It's one of the most common uses. Wearable buttons and automatic sensors provide a safety net without being intrusive."
    },
    {
      "question": "How much does a security system cost?",
      "answer": "Every property is different, but Reliant provides clear, itemized recommendations based on the equipment, installation, and monitoring services you actually need. Your pricing and agreement terms are reviewed before installation begins."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "security-system-installation": [
    {
      "question": "How long does installation take?",
      "answer": "Most residential systems are installed in a day. Larger commercial projects are scheduled in phases, and we give you a clear timeline up front."
    },
    {
      "question": "Do you clean up and hide wiring?",
      "answer": "Yes. We route and conceal cabling for a tidy, finished look and remove all debris when we're done."
    },
    {
      "question": "Can you take over or upgrade an existing system?",
      "answer": "Often, yes. We audit your current equipment and reuse what makes sense while upgrading what doesn't."
    },
    {
      "question": "How much does a security system cost?",
      "answer": "Every property is different, but Reliant provides clear, itemized recommendations based on the equipment, installation, and monitoring services you actually need. Your pricing and agreement terms are reviewed before installation begins."
    },
    {
      "question": "Is there a warranty?",
      "answer": "Reliant offers applicable manufacturer warranties, a one-year workmanship warranty, and additional warranty benefits on qualifying monitored alarm systems. Exact coverage is provided with your proposal."
    },
    {
      "question": "Can I use the system without professional monitoring?",
      "answer": "Some equipment can operate locally without monitoring, but professional monitoring provides around-the-clock signal response and cellular communication services. We’ll explain the available options and limitations."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "cctv-surveillance": [
    {
      "question": "How much footage can I keep?",
      "answer": "Storage is configurable — from a couple of weeks to several months — depending on resolution, camera count, and your recorder or cloud plan."
    },
    {
      "question": "Can I watch the cameras from my phone?",
      "answer": "Yes. Live view and playback are available from a secure mobile app and desktop, wherever you are."
    },
    {
      "question": "Do hardwired cameras work at night?",
      "answer": "Our cameras include infrared or low-light night vision for clear footage after dark."
    },
    {
      "question": "How many cameras do I need?",
      "answer": "The right number depends on entrances, vulnerable areas, desired identification distance, lighting, and property layout. Reliant designs coverage around actual security objectives instead of simply recommending the highest camera count."
    },
    {
      "question": "Do your cameras record audio?",
      "answer": "Some equipment supports audio, but recording laws and project requirements vary. Reliant will discuss appropriate equipment and legal considerations, but customers are responsible for ensuring their use complies with applicable laws."
    },
    {
      "question": "Can Reliant work on cameras installed by another company?",
      "answer": "In many cases, yes. We first evaluate the equipment, passwords, condition, compatibility, and manufacturer support before recommending service, takeover, or replacement."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "wireless-video": [
    {
      "question": "Are wireless cameras reliable?",
      "answer": "Wireless cameras can be reliable when they have strong Wi-Fi coverage and a dependable power source. However, they may not be the best choice for every property. Reliant evaluates signal strength, bandwidth, placement, power, and security before recommending wireless or hardwired cameras."
    },
    {
      "question": "Do they need to be charged?",
      "answer": "Some wireless cameras are battery-powered and require periodic charging, while others use a wired power source. We recommend the best option based on placement, reliability and the amount of ongoing maintenance you want."
    },
    {
      "question": "Where is the video stored?",
      "answer": "Clips are stored securely in the cloud, so footage is safe even if a camera is stolen or damaged."
    },
    {
      "question": "How many cameras do I need?",
      "answer": "The right number depends on entrances, vulnerable areas, desired identification distance, lighting, and property layout. Reliant designs coverage around actual security objectives instead of simply recommending the highest camera count."
    },
    {
      "question": "Do your cameras record audio?",
      "answer": "Some equipment supports audio, but recording laws and project requirements vary. Reliant will discuss appropriate equipment and legal considerations, but customers are responsible for ensuring their use complies with applicable laws."
    },
    {
      "question": "Can Reliant work on cameras installed by another company?",
      "answer": "In many cases, yes. We first evaluate the equipment, passwords, condition, compatibility, and manufacturer support before recommending service, takeover, or replacement."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "network-cabling": [
    {
      "question": "Do you handle both the cabling and the network gear?",
      "answer": "Yes. We can coordinate cabling, switching, Wi-Fi, and network equipment as part of the agreed project scope. Installed cabling is tested and labeled as appropriate; formal certification reports and closeout documentation are included when specified in that scope."
    },
    {
      "question": "Can you run fiber between separate buildings?",
      "answer": "Routinely. Single- and multi-mode fiber is how we connect plants, offices, scale houses, and outbuildings that are too far apart for copper — a standard part of our industrial and campus work."
    },
    {
      "question": "Can you cable a building that's already occupied?",
      "answer": "Yes. We regularly work around live operations and production schedules, phasing the work and coordinating with your team to keep disruption down."
    },
    {
      "question": "Do you provide certification testing and documentation?",
      "answer": "Installed cabling is tested and labeled as appropriate for the project. Formal certification reports, as-built drawings, submittals, and closeout documentation are available when included in the project scope."
    },
    {
      "question": "Can you supply NDAA/TAA-compliant equipment?",
      "answer": "Yes. When a project requires NDAA Section 889, TAA, or other specified compliance standards, Reliant can design the system around qualifying equipment. Final compliance is documented based on the exact products and requirements included in the project."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "audio-video": [
    {
      "question": "Can you install audio in multiple rooms?",
      "answer": "Yes. Distributed audio lets you play the same or different sources in each zone, all controlled centrally."
    },
    {
      "question": "Do you set up conference-room video?",
      "answer": "We design and install complete conferencing AV — displays, cameras, microphones, and one-touch control."
    },
    {
      "question": "Will everything be on one remote?",
      "answer": "We consolidate control so you're not juggling multiple remotes or apps to run the room."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "smart-automation": [
    {
      "question": "Does automation work with devices I already own?",
      "answer": "In many cases, yes. We integrate popular smart-home platforms and confirm exactly what's compatible during the design stage."
    },
    {
      "question": "Can I control the system by voice?",
      "answer": "Many compatible smart-home devices can work with supported voice assistants. Available commands depend on the equipment and security settings, and certain sensitive functions may be restricted for safety."
    },
    {
      "question": "Is it hard to use?",
      "answer": "Not at all. We configure everything for you and keep the controls simple and intuitive for the whole household or team."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "access-control": [
    {
      "question": "What kinds of credentials can we use?",
      "answer": "Compatible systems can support keypads, key fobs, proximity cards, and mobile credentials. Available credential types depend on the selected platform, readers, and project requirements."
    },
    {
      "question": "Can I lock or unlock doors remotely?",
      "answer": "With compatible equipment and the required network or cloud connection, authorized administrators can manage doors remotely. Available controls, user permissions, and any subscription requirements are reviewed during system design."
    },
    {
      "question": "Does it integrate with our cameras and alarm?",
      "answer": "With compatible equipment, access control, video surveillance, and intrusion alarms can be integrated so related events are easier to review and manage."
    },
    {
      "question": "Can the system grow as we add doors or locations?",
      "answer": "Expansion depends on the selected platform, controller capacity, licensing, and network infrastructure. We review planned doors and locations during design so the proposed system can account for your expected growth."
    },
    {
      "question": "Can we review who accessed a door and when?",
      "answer": "Compatible access-control platforms can provide event and credential history for authorized administrators. Available reports, retention periods, and cloud requirements depend on the equipment and service plan selected."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "cyber-security": [
    {
      "question": "Who provides cybersecurity and managed IT services?",
      "answer": "Reliant can coordinate cybersecurity and managed IT services through qualified technology partners. The exact scope, response times, and support services are defined before work begins."
    },
    {
      "question": "Is cyber security relevant for a small business?",
      "answer": "Very. Small businesses are frequent targets precisely because they're often under-protected — right-sized defenses make a big difference."
    },
    {
      "question": "Do you assess our current setup first?",
      "answer": "Reliant can coordinate an assessment through a qualified technology partner. The assessment scope and any recommended services are defined before work begins."
    },
    {
      "question": "How does this connect to my physical security?",
      "answer": "Networked cameras and access systems are potential entry points. Securing them protects both your data and your building."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ],
  "managed-it": [
    {
      "question": "What does managed IT actually cover?",
      "answer": "Reliant can coordinate cybersecurity and managed IT services through qualified technology partners. The exact scope, response times, and support services are defined before work begins."
    },
    {
      "question": "Can you support both our IT and security systems?",
      "answer": "Reliant can coordinate partner-delivered IT services alongside the security systems we install. Responsibilities, compatibility, and the exact support scope are agreed before work begins."
    },
    {
      "question": "How quickly do you respond to issues?",
      "answer": "Response times and support availability depend on the services agreed with the technology partner. The exact scope, response times, and support services are defined before work begins."
    },
    {
      "question": "What happens after I request a quote?",
      "answer": "Reliant will discuss your goals, determine whether a site visit is needed, and then provide clear recommendations and pricing. Larger or more complex projects may require additional design work before final pricing is issued."
    }
  ]
};
