export const prompts = [
  'What if you were the CMO of Monster? What would you do differently to make the brand matter beyond the energy drink aisle?',
  'What if you led Spotify in India? How would you help people discover a new independent artist they would actually keep listening to?',
  'What if you ran a neighbourhood bookstore? How would you make students choose it over another evening of scrolling?',
  'What if you were the CMO of Amul? What would your next campaign say to students living away from home?',
  'What if you designed the next college canteen? What would you change to make affordable food easier to find and food waste harder to ignore?',
  'What if you led product at Instagram? What one change would make creating feel better than comparing?',
  'What if you launched a sneaker brand with no celebrity budget? How would you earn your first 100 customers?',
  'What if you were the CMO of an ice cream brand? How would you make a scoop feel right on a cold December evening?',
  'What if you redesigned public transport for a first-time commuter? What would you fix before adding another app?',
  'What if you ran IKEA’s student offering? How would you make a tiny rented room feel like someone’s own place?',
  'What if you led a sunscreen brand? How would you turn an occasional purchase into an everyday habit?',
  'What if you built an AI study companion? What would it refuse to do so that students still learned to think?',
  'What if you were the CMO of a local music festival? How would you sell the experience without announcing a famous headliner?',
  'What if you could redesign one piece of food packaging? How would you make reuse easier than throwing it away?',
  'What if you led Duolingo’s next campus campaign? How would you turn a daily streak into a real conversation?',
  'What if you launched an electric scooter? What story would you tell if you could not mention range, speed or charging?',
  'What if you ran a sports brand for beginners? How would you make the first awkward attempt feel worth celebrating?',
  'What if you redesigned internship applications? What would let a student show their thinking beyond a CV?',
  'What if you were the CMO of a steel brand? How would you make first-time homeowners care about something they never see?',
  'What if you ran a campus thrift store? How would you make buying second-hand someone’s first choice?',
  'What if you led customer experience at a bank? How would you help someone understand their first salary without jargon?',
  'What if you redesigned a medicine reminder? How would it help people without making them feel watched or nagged?',
  'What if you were the CMO of a regional snack brand? How would you take one local favourite to a new city without losing its identity?',
  'What if you had to reduce a campus’s water waste with no new hardware? What would you try first, and how would you know it worked?',
  'What if you led Netflix’s discovery experience? How would you help a group agree on something to watch in two minutes?',
  'What if you started a repair service for students? How would you make fixing a broken item feel easier than replacing it?',
  'What if you were the CMO of a small museum? How would you make its least-noticed exhibit the reason people visit?',
  'What if you designed a job platform for people with no experience? What evidence of potential would you put first?',
  'What if you ran a café that could not discount its prices? What would make customers come back and bring a friend?',
  'What if you were the CMO of InGenuityX? What would you do differently to get a curious student to share their first idea?'
];
export const indiaDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
export const previousDay = (day: string) => new Date(Date.parse(day + 'T00:00:00Z') - 86400000).toISOString().slice(0, 10);
export function questionNumber(day: string) {
  const start = process.env.WHAT_IF_START_DATE || '2026-10-27';
  const elapsed = Math.floor((Date.parse(day + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000);
  if (!Number.isFinite(elapsed)) throw new Error('Invalid WHAT_IF_START_DATE');
  return ((elapsed % 30) + 30) % 30 + 1;
}
export async function registerWhatIf(strapi: any) {
  const questions = () => strapi.db.query('api::what-if-question.what-if-question');
  const answers = () => strapi.db.query('api::what-if-answer.what-if-answer');
  // Stable slots preserve editorial changes across restarts. No public question-write route.
  for (let index = 0; index < prompts.length; index++) {
    if (!await questions().findOne({ where: { dayNumber: index + 1 } })) {
      try { await questions().create({ data: { dayNumber: index + 1, prompt: prompts[index] } }); }
      catch (error) { if (!await questions().findOne({ where: { dayNumber: index + 1 } })) throw error; }
    }
  }
  const limits = new Map<string, { count: number; until: number }>();
  strapi.server.routes([
    { method: 'GET', path: '/api/what-if/today', config: { auth: false }, handler: async ctx => {
      ctx.set('Cache-Control', 'no-store');
      const today = indiaDay();
      const day = ctx.query.day || today;
      if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day + 'T00:00:00Z')) || new Date(day + 'T00:00:00Z').toISOString().slice(0, 10) !== day || day > today) return ctx.badRequest('Invalid question date.');
      const question = await questions().findOne({ where: { dayNumber: questionNumber(day) } });
      if (!question) { ctx.status = 503; ctx.body = { error: 'Today’s question is unavailable.' }; return; }
      const chosen = await answers().findOne({ where: { questionDay: previousDay(today), approved: true, featured: true }, orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }] });
      ctx.body = { day, acceptingAnswers: day === today, number: question.dayNumber, prompt: question.prompt, highlight: chosen ? { displayName: chosen.displayName, answer: chosen.answer, prompt: chosen.questionText, day: chosen.questionDay } : null };
    } },
    { method: 'POST', path: '/api/what-if/answers', config: { auth: false }, handler: async ctx => {
      ctx.set('Cache-Control', 'no-store');
      const now = Date.now();
      for (const [key, value] of limits) if (value.until <= now) limits.delete(key);
      const key = ctx.ip || 'unknown';
      const limit = limits.get(key) || { count: 0, until: now + 15 * 60000 };
      if ((!limits.has(key) && limits.size >= 10000) || ++limit.count > 8) { ctx.status = 429; ctx.set('Retry-After', '900'); ctx.body = { error: 'Please try again in 15 minutes.' }; return; }
      limits.set(key, limit);
      const input = ctx.request.body || {};
      const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
      if (!validText(input.answer, 20, 2000) || !validText(input.displayName, 1, 60) || !validText(input.email, 3, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.consent !== true || input.website || typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return ctx.badRequest('Check your name, email, answer and publication consent.');
      const existing = await answers().findOne({ where: { requestId: input.requestId } });
      const same = row => row && row.email === input.email.trim().toLowerCase() && row.answer === input.answer.trim() && row.displayName === input.displayName.trim() && row.questionDay === input.day;
      if (existing) { if (!same(existing)) return ctx.conflict('This request has already been used. Refresh before submitting a different answer.'); ctx.status = 201; ctx.body = { saved: true }; return; }
      const day = indiaDay();
      const question = await questions().findOne({ where: { dayNumber: questionNumber(day) } });
      if (input.day !== day || !question || input.prompt !== question.prompt) return ctx.conflict('The question has changed. Refresh to answer today’s prompt.');
      try {
        await answers().create({ data: { email: input.email.trim().toLowerCase(), displayName: input.displayName.trim(), answer: input.answer.trim(), questionDay: day, questionNumber: question.dayNumber, questionText: question.prompt, consentAt: new Date().toISOString(), requestId: input.requestId, approved: false, featured: false } });
      } catch {
        if (!same(await answers().findOne({ where: { requestId: input.requestId } }))) { ctx.status = 503; ctx.body = { error: 'Could not save your answer. Please retry.' }; return; }
      }
      ctx.status = 201; ctx.body = { saved: true };
    } }
  ]);
}
