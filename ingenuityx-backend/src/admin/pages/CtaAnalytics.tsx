import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import './CtaAnalytics.css';
type Row = { source: string; page: string; label: string; clicks: number; lastClick: string };
type Summary = { total: number; days: number; rows: Row[] };
export default function CtaAnalytics() {
  const { get } = useFetchClient();
  const [days, setDays] = useState(30);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    get(`/cta-analytics/summary?days=${days}`).then(response => { if (active) setData(response.data); }).catch(() => { if (active) setError('Could not load analytics. Try refreshing.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [get, days, revision]);
  return <main className="cta-admin"><header><div><h1>CTA analytics</h1><p>See where visitors click to join or pre-register.</p></div><div><label>Period <select value={days} onChange={event => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label><button onClick={() => setRevision(value => value + 1)} disabled={loading}>Refresh</button></div></header>
    <p className="cta-admin-note">Click counts, not unique people or completed registrations. Repeat clicks count. No cookies or profile data are collected. History starts when tracking is enabled and is retained for 90 days.</p>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading click activity…</p> : !error && data && <><div className="cta-admin-stat"><strong>{data.total.toLocaleString()}</strong><span>CTA clicks · last {data.days} days</span></div>
    {data.rows.length === 0 ? <p>No clicks yet. Activity will appear after visitors use the website’s join buttons.</p> : <div className="cta-admin-table"><table><thead><tr><th>Section / CTA</th><th>Page</th><th>Button wording</th><th>Clicks</th><th>Share</th></tr></thead><tbody>{data.rows.map(row => <tr key={`${row.source}-${row.page}-${row.label}`}><td>{row.source.replace(/-/g, ' ')}</td><td>{row.page}</td><td>{row.label}</td><td><b>{row.clicks.toLocaleString()}</b></td><td><meter min={0} max={data.total} value={row.clicks} /> {(row.clicks / data.total * 100).toFixed(1)}%</td></tr>)}</tbody></table></div>}</>}
  </main>;
}
