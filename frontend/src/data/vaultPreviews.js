const VAULT_IMAGES = {
  "preview-ice-cream": {
    "photo": "1554878050-2ddfd87e7999",
    "alt": "Chocolate ice cream in a waffle cone",
    "position": "center 35%",
    "source": "https://unsplash.com/photos/chocolate-ice-cream-in-cone-xMUOnDGIYcs",
    "credit": "Krissara Lertnimanorladee"
  },
  "preview-sunscreen": {
    "photo": "1623676714504-edd78728155e",
    "alt": "A hand holding a sunscreen bottle",
    "position": "center 30%",
    "source": "https://unsplash.com/photos/a-person-holding-a-bottle-of-sunscreen-in-their-hand-3Uj7ttuo5kk",
    "credit": "Onela Ymeri"
  },
  "preview-ev": {
    "photo": "1692061157268-b128a8f37d6d",
    "alt": "An electric car plugged into a charging station",
    "position": "center 35%",
    "source": "https://unsplash.com/photos/an-electric-car-being-charged-at-a-charging-station-qdNvo1Uk9lk",
    "credit": "Michael Foertsch"
  },
  "preview-cement": {
    "photo": "1767280480050-73846f6157ef",
    "alt": "Concrete floors and columns of a building under construction",
    "position": "center top",
    "source": "https://unsplash.com/photos/concrete-building-under-construction-with-red-railings-57sKAuA5tVI",
    "credit": "Tao Yuan"
  },
  "preview-ai": {
    "photo": "1506399558188-acca6f8cbf41",
    "alt": "Server racks inside a data centre",
    "position": "center top",
    "source": "https://unsplash.com/photos/server-racks-in-data-center-klWUhr-wPJ8",
    "credit": "imgix"
  },
  "preview-steel": {
    "photo": "1550041462-7e8602a4c4bc",
    "alt": "Close-up of ribbed steel reinforcing bars",
    "position": "center top",
    "source": "https://unsplash.com/photos/black-metal-bars-uNrhdoCtAYs",
    "credit": "Clint Bustrillos"
  }
};

export const VAULT_TEASERS = [
  { id: 'preview-ice-cream', category: 'Marketing', company: 'FOOD / THE ALL-YEAR CHALLENGE', title: "Who said ice cream gets a summer job?", description: 'Rainy Tuesdays. December nights. An ice cream brand wants in on all 12 months. Give people a reason to reach for a scoop beyond summer.' },
  { id: 'preview-sunscreen', category: 'Design', company: 'BEAUTY / THE DAILY HABIT', title: 'SPF needs a personality transplant.', description: 'A beauty brand wants SPF out of the beach bag and into the daily routine. Make it the thing people reach for, not the thing they forget.' },
  { id: 'preview-ev', category: 'Innovation', company: 'AUTO / BEYOND THE BATTERY', title: 'Dear EV brands, enough with the battery talk.', description: 'Range. Charging. Kilometres. We’ve heard it. An EV brand wants a story that makes India fall for the car. What would yours be?' },
  { id: 'preview-cement', category: 'Sustainability', company: 'MATERIALS / A LIGHTER FOOTPRINT', title: 'The next skyline needs a smaller footprint.', description: 'A building materials brand wants to cut carbon without cutting corners. Find the change that could make the way we build worth rebuilding.' },
  { id: 'preview-ai', category: 'Tech', company: 'TECH / THE POWER PROBLEM', title: 'AI has an energy bill. Someone has to fix it.', description: 'More AI. More demand. An energy solutions brand wants less waste in the system. Build an answer that works beyond the pitch deck.' },
  { id: 'preview-steel', category: 'Marketing', company: 'BUILDING / THE INVISIBLE CHOICE', title: 'Dream homes have moodboards. Steel never makes them.', description: 'A construction brand wants first-time homeowners to care about what holds it all together. Make the invisible part of a home impossible to ignore.' },
].map(teaser => ({
  ...teaser,
  bgImage: `https://images.unsplash.com/photo-${VAULT_IMAGES[teaser.id].photo}?auto=format&fit=crop&w=1000&q=85`,
  imageAlt: VAULT_IMAGES[teaser.id].alt,
  imagePosition: VAULT_IMAGES[teaser.id].position,
}));

