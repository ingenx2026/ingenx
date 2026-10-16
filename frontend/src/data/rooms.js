import teamPhoto from '../imports/step 2.jpg';
import ideaPhoto from '../imports/step 1.jpg';
import buildPhoto from '../imports/step 3.jpg';
import mentorPhoto from '../imports/step new.jpg';
import finalePhoto from '../imports/step 4.jpg';

// Anonymous opportunity previews. Brand identities stay under wraps until reveal.
const brief = (sector, title, description, format, image = null, internship = false) => ({ sector, title, description, format, image, internship });
export const ROOMS = [
  { slug: 'marketing', name: 'Marketing', headline: 'Make them feel something.', intro: 'The best ideas don’t sound like ads. They sound like something worth talking about. Find your next conversation starter.', image: teamPhoto, briefs: [
    brief('Ice cream / Growth', 'The coolest internship of November.', 'An ambitious ice cream brand wants India to stop treating ice cream like a summer fling. Think you can make winter taste like summer?', 'Marketing internship', ideaPhoto, true),
    brief('Auto / Brand strategy', 'Dear EV brands, enough with the battery talk.', 'Range. Charging. Kilometres. We’ve heard it all. Can you make India fall in love with an electric car for reasons that have nothing to do with the battery?', 'Brand challenge preview', teamPhoto),
    brief('Auto / Consumer insights', "Dear brands, India isn’t one big group chat.", 'Different cities. Different flexes. Different dreams. One brand needs to find its voice across all of them.', 'Consumer insights'),
    brief('Beverages / Market disruption', 'The next drink wants your fridge.', 'An ambitious challenger is entering a crowded market. Help it earn its spot.', 'Brand strategy'),
    brief('Oral care / Growth', 'Toothpaste has a new enemy.', 'A young challenger brand wants to change India’s brushing routine. Give people a reason to break an old habit.', 'Growth internship', null, true),
    brief('Paints / Consumer insights', "India’s next big shade isn’t a colour.", 'It’s a behaviour. Can you spot it before the paint brands do?', 'Consumer research', null, true),
    brief('Beauty / Gen Z', 'Dear beauty industry, Gen Z has notes.', 'A beauty brand wants fresh answers. Start with what people actually want, then give them a reason to care.', 'Brand challenge'),
    brief('Steel / Brand building', 'Dream homes have moodboards. Steel never makes them.', 'Make the invisible part of a home impossible to ignore. What would make a first-time homeowner care?', 'Marketing challenge'),
  ] },
  { slug: 'tech', name: 'Tech', headline: 'Less “what if”. More working prototype.', intro: 'For the ones who open a problem and immediately start building. Bring your curiosity, your code, and the version that almost works.', image: buildPhoto, briefs: [
    brief('AI / Energy', 'AI has an energy bill. Someone has to fix it.', 'More AI. More demand. An energy solutions brand wants less waste in the system. Build an answer that works beyond the pitch deck.', 'Tech challenge preview', buildPhoto),
    brief('Access / Digital tools', 'Great tech shouldn’t need a great connection.', 'What could you build for people whose internet keeps dropping? Start with their day, not your download speed.', 'Prototype concept', teamPhoto),
    brief('Data / Decision making', 'The dashboard is full. The answer is missing.', 'Turn too much information into one useful next move. Build a tool that helps someone decide.', 'Hackathon concept', null, true),
    brief('Everyday systems / Automation', 'Nobody dreams of filling out another form.', 'Find the repetitive task everyone puts up with. Make it disappear without making the experience harder.', 'Product concept'),
  ] },
  { slug: 'design', name: 'Design', headline: 'Make the ordinary hard to ignore.', intro: 'A new habit. A better interaction. A pack you reach for twice. Design the moment that changes what happens next.', image: ideaPhoto, briefs: [
    brief('Beauty / Daily habits', 'SPF needs a personality transplant.', 'Sunscreen has been giving serious, sensible energy for years. Can you make it something people actually want to wear?', 'Design internship', ideaPhoto, true),
    brief('Home care / Product', 'Dirty laundry. Clean opportunity.', 'Could you reinvent a product millions use without thinking twice? Start with the bit everyone finds annoying.', 'Product innovation concept', buildPhoto),
    brief('Packaging / Experience', 'The unboxing shouldn’t outlive the planet.', 'Make a first impression worth keeping, with less to throw away. What does thoughtful packaging look like?', 'Packaging concept'),
    brief('Digital / Accessibility', 'If they can’t use it, it isn’t finished.', 'Take an everyday digital experience and make it work for the people it keeps leaving out.', 'UX concept', null, true),
  ] },
  { slug: 'sustainability', name: 'Sustainability', headline: 'Better for the planet. Built for real life.', intro: 'Big intentions need practical ideas. Explore problems where a smaller footprint could make a bigger difference.', image: mentorPhoto, briefs: [
    brief('Solar / Innovation', 'Got a bright idea? Prove it.', 'Solar has the potential. Everyday adoption still has hurdles. Find one worth solving and show how your idea could help.', 'Project concept', mentorPhoto, true),
    brief('Materials / Carbon', 'The next skyline needs a smaller footprint.', 'A building materials brand wants to cut carbon without cutting corners. Rethink the way we build.', 'Sustainability challenge preview', buildPhoto),
    brief('Circularity / Everyday habits', 'Away isn’t a place.', 'We throw things “away” every day. Build an idea that keeps something useful in the loop instead.', 'Circular design concept'),
    brief('Water / Resource use', 'Make every drop do more.', 'Find a place where water gets wasted quietly. Design a change people can actually stick with.', 'Impact concept'),
  ] },
  { slug: 'innovation', name: 'Innovation', headline: 'That weird idea? Bring it.', intro: 'Some problems don’t fit a neat category. Neither do the people who solve them. Start with a question nobody else is asking.', image: buildPhoto, briefs: [
    brief('Deodorants / Innovation', 'Sweat the big stuff.', 'Help a challenger brand rethink freshness for a generation that doesn’t sit still. What would you change first?', 'Product innovation concept', teamPhoto, true),
    brief('Home care / Product', 'Dirty laundry. Clean opportunity.', 'Could you reinvent a product millions use without thinking twice? Find the overlooked problem hiding in plain sight.', 'Innovation concept', buildPhoto),
    brief('Food / New habits', 'A new flavour isn’t always a new idea.', 'Rethink how, when, or why people reach for something familiar. What could change beyond the ingredients?', 'Food innovation concept'),
    brief('Everyday life / Problem solving', '“That’s just how it works” is your cue.', 'Pick an inconvenience everyone has accepted. Show us the version they didn’t know to ask for.', 'Open innovation concept'),
  ] },
  { slug: 'creators', name: "The Creator’s Challenge", headline: 'Give the group chat something to send.', intro: 'For storytellers, makers, and people who see the post before the moment is over. Turn a fresh point of view into something people pass on.', image: finalePhoto, briefs: [
    brief('Storytelling / Culture', 'The brief is short. Your take shouldn’t be obvious.', 'Find the angle everyone else missed. Tell a brand story people would choose to watch.', 'Creator challenge preview', finalePhoto),
    brief('Community / Participation', 'Views are nice. Get people involved.', 'Make something your audience can join, remix, or make their own. Give the comment section a part to play.', 'Community concept', teamPhoto),
    brief('Video / Everyday insight', 'Your best idea might be in your camera roll.', 'Turn a small, familiar moment into a story that feels instantly recognisable. What have you noticed?', 'Short-form concept', null, true),
    brief('Building in public / Creative process', 'Show the messy middle.', 'The first draft. The wrong turn. The moment it clicks. Make the process as compelling as the finished thing.', 'Content concept'),
  ] },
];
export const ROOM_PATHS = { Marketing: 'marketing', Tech: 'tech', Design: 'design', Sustainability: 'sustainability', Innovation: 'innovation', "The Creator's Challenge": 'creators' };
