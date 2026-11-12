// Text for the info pages (/info/<slug>). Edit the wording here.
// Before launch, the owner should confirm the shipping times and returns window.

export type InfoPage = {
  title: string;
  description: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

export const infoPages: Record<string, InfoPage> = {
  about: {
    title: 'About BALE',
    description: 'The story behind BALE streetwear.',
    sections: [
      {
        paragraphs: [
          'BALE makes streetwear built for the streets: heavyweight basics and art-print outerwear, released in small drops.',
          'You can also find BALE at local markets. Follow @bale_wear on Instagram for stall dates and new drops.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping',
    description: 'Shipping rates and delivery times for BALE orders.',
    sections: [
      {
        heading: 'Where we ship',
        paragraphs: ['We currently ship within Australia.'],
      },
      {
        heading: 'Rates',
        paragraphs: [
          'Shipping is a flat rate per order, shown at checkout before you pay. Orders over the free shipping threshold ship free.',
        ],
      },
      {
        heading: 'Processing and delivery',
        paragraphs: [
          'Orders are packed and sent within 3 business days. Delivery usually takes 2 to 8 business days depending on where you are.',
          'You will get an email when your order is placed. If you have a question about an order, contact us with your order email.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns and refunds',
    description: 'Returns, exchanges and refunds at BALE.',
    sections: [
      {
        heading: 'Change of mind',
        paragraphs: [
          'Unworn, unwashed items with tags attached can be returned within 14 days of delivery for an exchange or refund. Return postage is paid by the customer.',
          'Contact us before sending anything back so we can confirm the return.',
        ],
      },
      {
        heading: 'Faulty or wrong items',
        paragraphs: [
          'If an item arrives faulty or is not what you ordered, contact us within 14 days with a photo and we will fix it at no cost to you.',
          'Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: ['Approved refunds go back to the original payment method.'],
      },
    ],
  },
  'size-guide': {
    title: 'Size guide',
    description: 'Sizing for BALE pieces.',
    sections: [
      {
        paragraphs: [
          'Clothing comes in S to XL. The beanie is one size.',
          'Not sure which size to pick? Send us a message on Instagram with your height and usual size and we will help.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with BALE.',
    sections: [
      {
        paragraphs: [
          'The fastest way to reach us is a direct message on Instagram at @bale_wear.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    description: 'How BALE handles your personal information.',
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'When you place an order we receive your name, email, phone number and shipping address so we can deliver it.',
          'Payments are processed by Stripe. Your card details go straight to Stripe and are never seen or stored by BALE.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'We use your details to fulfil your order and contact you about it. We do not sell your information.',
        ],
      },
      {
        heading: 'Cookies and storage',
        paragraphs: [
          'This site saves your cart in your browser so it is still there when you come back. We do not use advertising or tracking cookies.',
        ],
      },
      {
        heading: 'Questions',
        paragraphs: ['To ask about or correct your information, contact us through Instagram at @bale_wear.'],
      },
    ],
  },
  terms: {
    title: 'Terms',
    description: 'Terms of sale for BALE.',
    sections: [
      {
        paragraphs: [
          'Prices are in Australian dollars. We may change prices or products at any time, but the price you pay is the one shown at checkout.',
          'An order is accepted once payment is confirmed. If we cannot fulfil an order, we will refund it in full.',
          'Nothing in these terms limits your rights under the Australian Consumer Law.',
        ],
      },
    ],
  },
};
