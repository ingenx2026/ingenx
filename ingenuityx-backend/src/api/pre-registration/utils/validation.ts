const INTERESTS = ['Marketing', 'Hackathons', 'Sustainability', 'Design', 'Innovation', 'Content & creation'];
const OPPORTUNITIES = ['Job', 'Internship', 'Paid project', 'Side project', 'PPO'];
const text = (value: unknown, min: number, max: number): value is string => typeof value === 'string' && value.trim().length >= min && value.length <= max;
const selection = (value: unknown, options: string[]) => Array.isArray(value) && value.length > 0 && value.length <= options.length && new Set(value).size === value.length && value.every(item => options.includes(item));
export function validateSubmission(input: any): string | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return 'Invalid form.';
  if (input.website) return 'Invalid form.';
  if (!text(input.name, 2, 100)) return 'Please enter your name.';
  if (!text(input.email, 3, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return 'Please enter a valid email.';
  if (input.college !== undefined && !text(input.college, 0, 160)) return 'College is too long.';
  if (!selection(input.interests, INTERESTS) || !selection(input.opportunities, OPPORTUNITIES)) return 'Choose your interests and opportunities.';
  if (!Array.isArray(input.skills) || input.skills.length < 1 || input.skills.length > 15 || !input.skills.every(value => text(value, 1, 40))) return 'Add between 1 and 15 skills.';
  if (!text(input.about, 10, 400)) return 'Add a short introduction (10–400 characters).';
  if (input.consent !== true) return 'Consent is required.';
  if (!text(input.requestId, 36, 36) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return 'Invalid submission identifier.';
  if (input.resume != null) {
    const file = input.resume;
    if (!text(file.name, 1, 180) || !/\.pdf$/i.test(file.name) || typeof file.content !== 'string' || file.content.length > 6990508 || !/^[A-Za-z0-9+/]+={0,2}$/.test(file.content)) return 'Please upload a PDF up to 5 MB.';
    const bytes = Buffer.from(file.content, 'base64');
    if (bytes.length > 5 * 1024 * 1024 || bytes.length < 8 || bytes.subarray(0, 5).toString() !== '%PDF-' || !bytes.subarray(-1024).toString().includes('%%EOF')) return 'Please upload a valid PDF up to 5 MB.';
  }
  return null;
}
export function normalizeSubmission(input: any) {
  return { fullName: input.name.trim(), email: input.email.trim().toLowerCase(), college: (input.college || '').trim(), interests: input.interests, opportunities: input.opportunities, skills: [...new Set(input.skills.map((item: string) => item.trim()))], about: input.about.trim(), requestId: input.requestId, cvName: input.resume ? input.resume.name.replace(/[^a-zA-Z0-9._ -]/g, '_') : null, cvBase64: input.resume?.content || null, cohort: 'Cohort 01 / Oct 2026' };
}
