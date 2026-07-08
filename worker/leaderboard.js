// ZONE OUT leaderboard — Cloudflare Worker + KV.
//
// Deploy (free tier, ~3 minutes, no CLI needed):
//   1. dash.cloudflare.com → Workers & Pages → Create → Worker → deploy the
//      hello-world, then "Edit code", replace it with this file, Save & Deploy.
//   2. Storage & Databases → KV → Create namespace (name it anything, e.g.
//      "zoneout-lb").
//   3. Your worker → Settings → Bindings → Add → KV namespace →
//      variable name LB → select the namespace → Save.
//   4. Copy the worker URL (https://<name>.<account>.workers.dev) into
//      LB_URL near the top of index.html.
//
// API:
//   GET  /top?day=YYYYMMDD        -> { all:[{n,s,m,t}...], daily:[...] }
//   POST /submit {n,s,m,day,run}  -> { allRank, dayRank }
//
// Boards keep the top 50. The daily board only accepts daily-mode runs and
// expires ~three days after its date.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

const cleanDay = (v) => String(v || '').replace(/\D/g, '').slice(0, 8);

async function addToBoard(env, key, entry, ttl) {
  const list = (await env.LB.get(key, 'json')) || [];
  list.push(entry);
  list.sort((a, b) => b.s - a.s || a.t - b.t);
  const top = list.slice(0, 50);
  const opts = ttl ? { expirationTtl: ttl } : {};
  await env.LB.put(key, JSON.stringify(top), opts);
  const idx = top.findIndex(
    (e) => e.t === entry.t && e.s === entry.s && e.n === entry.n
  );
  return idx < 0 ? null : idx + 1;
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: CORS });

    const url = new URL(req.url);

    if (url.pathname === '/top') {
      const day = cleanDay(url.searchParams.get('day'));
      const [all, daily] = await Promise.all([
        env.LB.get('all', 'json'),
        day ? env.LB.get('d:' + day, 'json') : null,
      ]);
      return json({ all: all || [], daily: daily || [] });
    }

    if (url.pathname === '/submit' && req.method === 'POST') {
      let b;
      try {
        b = await req.json();
      } catch {
        return json({ err: 'bad json' }, 400);
      }
      const name =
        String(b.n || '')
          .toUpperCase()
          .replace(/[^A-Z0-9.\- ]/g, '')
          .slice(0, 3) || '---';
      const score = Math.floor(Number(b.s));
      if (!Number.isFinite(score) || score <= 0 || score > 50_000_000)
        return json({ err: 'bad score' }, 400);
      const mode = b.m === 'A' ? 'A' : 'N';
      const day = cleanDay(b.day);
      const isDaily = b.run === 'daily' && day.length === 8;

      const entry = { n: name, s: score, m: mode, t: Date.now() };
      const allRank = await addToBoard(env, 'all', entry);
      let dayRank = null;
      if (isDaily)
        dayRank = await addToBoard(env, 'd:' + day, entry, 60 * 60 * 24 * 3);
      return json({ allRank, dayRank });
    }

    return json({ err: 'not found' }, 404);
  },
};
