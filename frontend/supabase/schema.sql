-- Run once in the Supabase SQL editor. Safe to rerun; existing questions are preserved.
create table if not exists public.ix_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.ix_records (
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('students','volunteers','answers','events','contacts','challenges','applications')),
 request_id text not null, fingerprint text not null, email text, day date, approved boolean not null default false, featured boolean not null default false,
 data jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(kind,request_id)
);
create unique index if not exists ix_student_email on public.ix_records(email) where kind='students';
create unique index if not exists ix_one_feature_per_day on public.ix_records(day) where kind='answers' and featured=true;
create index if not exists ix_records_kind_created on public.ix_records(kind,created_at desc);
create index if not exists ix_records_day on public.ix_records(day) where kind='answers';
create table if not exists public.ix_questions(slot integer primary key check(slot between 1 and 30), prompt text not null check(length(prompt) between 10 and 2000));
create table if not exists public.ix_rate_limits(key text primary key, hits integer not null, expires_at timestamptz not null);
alter table public.ix_admins enable row level security;
alter table public.ix_records enable row level security;
alter table public.ix_questions enable row level security;
alter table public.ix_rate_limits enable row level security;
revoke all on public.ix_admins,public.ix_records,public.ix_questions,public.ix_rate_limits from anon,authenticated;
grant all on public.ix_admins,public.ix_records,public.ix_questions,public.ix_rate_limits to service_role;
create or replace function public.ix_rate_limit(p_key text,p_limit integer,p_seconds integer) returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 delete from ix_rate_limits where expires_at<now();
 insert into ix_rate_limits(key,hits,expires_at) values(p_key,1,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set hits=ix_rate_limits.hits+1 returning hits into n;
 return n<=p_limit;
end; $$;
create or replace function public.ix_feature_answer(p_id uuid,p_featured boolean) returns void language plpgsql security definer set search_path=public as $$
declare d date;
begin
 select day into d from ix_records where id=p_id and kind='answers';
 if d is null then raise exception 'Answer not found'; end if;
 perform pg_advisory_xact_lock(hashtext(d::text));
 if p_featured then update ix_records set featured=false,updated_at=now() where kind='answers' and day=d; end if;
 update ix_records set featured=p_featured,approved=case when p_featured then true else approved end,updated_at=now() where id=p_id;
end; $$;
create or replace function public.ix_analytics(p_days integer) returns jsonb language sql security definer set search_path=public as $$
 select coalesce(jsonb_agg(t),'[]'::jsonb) from (select data->>'source' as source,data->>'page' as page,data->>'label' as label,count(*) as clicks,max(created_at) as last_click from ix_records where kind='events' and created_at>=now()-make_interval(days=>least(greatest(p_days,1),90)) group by data->>'source',data->>'page',data->>'label' order by clicks desc) t;
$$;
revoke all on function public.ix_rate_limit(text,integer,integer),public.ix_feature_answer(uuid,boolean),public.ix_analytics(integer) from public,anon,authenticated;
grant execute on function public.ix_rate_limit(text,integer,integer),public.ix_feature_answer(uuid,boolean),public.ix_analytics(integer) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('cvs','cvs',false,5242880,array['application/pdf']) on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['application/pdf'];
-- No public Storage policies: uploads and downloads use short-lived server-issued URLs.

insert into public.ix_questions(slot,prompt) values (1,'What if you were the CMO of Monster? What would you do differently to make the brand matter beyond the energy drink aisle?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (2,'What if you led Spotify in India? How would you help people discover a new independent artist they would actually keep listening to?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (3,'What if you ran a neighbourhood bookstore? How would you make students choose it over another evening of scrolling?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (4,'What if you were the CMO of Amul? What would your next campaign say to students living away from home?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (5,'What if you designed the next college canteen? What would you change to make affordable food easier to find and food waste harder to ignore?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (6,'What if you led product at Instagram? What one change would make creating feel better than comparing?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (7,'What if you launched a sneaker brand with no celebrity budget? How would you earn your first 100 customers?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (8,'What if you were the CMO of an ice cream brand? How would you make a scoop feel right on a cold December evening?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (9,'What if you redesigned public transport for a first-time commuter? What would you fix before adding another app?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (10,'What if you ran IKEA’s student offering? How would you make a tiny rented room feel like someone’s own place?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (11,'What if you led a sunscreen brand? How would you turn an occasional purchase into an everyday habit?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (12,'What if you built an AI study companion? What would it refuse to do so that students still learned to think?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (13,'What if you were the CMO of a local music festival? How would you sell the experience without announcing a famous headliner?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (14,'What if you could redesign one piece of food packaging? How would you make reuse easier than throwing it away?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (15,'What if you led Duolingo’s next campus campaign? How would you turn a daily streak into a real conversation?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (16,'What if you launched an electric scooter? What story would you tell if you could not mention range, speed or charging?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (17,'What if you ran a sports brand for beginners? How would you make the first awkward attempt feel worth celebrating?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (18,'What if you redesigned internship applications? What would let a student show their thinking beyond a CV?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (19,'What if you were the CMO of a steel brand? How would you make first-time homeowners care about something they never see?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (20,'What if you ran a campus thrift store? How would you make buying second-hand someone’s first choice?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (21,'What if you led customer experience at a bank? How would you help someone understand their first salary without jargon?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (22,'What if you redesigned a medicine reminder? How would it help people without making them feel watched or nagged?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (23,'What if you were the CMO of a regional snack brand? How would you take one local favourite to a new city without losing its identity?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (24,'What if you had to reduce a campus’s water waste with no new hardware? What would you try first, and how would you know it worked?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (25,'What if you led Netflix’s discovery experience? How would you help a group agree on something to watch in two minutes?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (26,'What if you started a repair service for students? How would you make fixing a broken item feel easier than replacing it?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (27,'What if you were the CMO of a small museum? How would you make its least-noticed exhibit the reason people visit?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (28,'What if you designed a job platform for people with no experience? What evidence of potential would you put first?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (29,'What if you ran a café that could not discount its prices? What would make customers come back and bring a friend?') on conflict(slot) do nothing;
insert into public.ix_questions(slot,prompt) values (30,'What if you were the CMO of InGenuityX? What would you do differently to get a curious student to share their first idea?') on conflict(slot) do nothing;