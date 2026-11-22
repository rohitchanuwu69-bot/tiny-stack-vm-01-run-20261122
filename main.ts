const fs = require("node:fs");
const path = require("node:path");
function go(by, dd) {
  const mr = new Int32Array(256);
  const sq = [];
  const cl = [];
  let pp = 0, ct = 0, jj = 0;
  const oo = [];
  let rc = 0, dn = false;
  const im = {1:1,2:4,48:2,49:2,50:2,51:2};
  const rq = {3:1,4:1,5:2,6:2,7:3,16:2,17:2,18:2,19:2,20:2,21:2,22:2,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:2,33:2,34:2,35:2,36:2,37:2,38:2,39:2,40:2,41:2,42:2,43:2,44:2,45:2,46:2,47:2,48:0,49:1,50:1,51:0,52:0,64:1,65:2,80:1,81:1,82:0,83:1};
  const ad = {1:1,2:1,4:2,5:2,6:3,7:3,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1,44:1,45:1,46:1,47:1,64:1,82:1};
  const lg = new Set([0,1,2,3,4,5,6,7,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,64,65,80,81,82,83]);
  function ft(c) { rc = c; dn = true; }
  while (!dn) {
    if (ct >= 1000000) { ft(10); break; }
    if (pp < 0 || pp >= by.length) { ft(9); break; }
    const ic = by[pp];
    if (!lg.has(ic)) { ft(5); break; }
    const ln = im[ic] || 0;
    if (pp + ln >= by.length) { ft(9); break; }
    const mn = rq[ic] || 0, mx = ad[ic] || 0;
    if (sq.length < mn) { ft(2); break; }
    if (sq.length - mn + mx > 256) { ft(3); break; }
    ct++;
    let nn = pp + 1 + ln;
    const tk = () => sq.pop();
    if (ic === 0) { rc = 0; dn = true; break; }
    else if (ic === 1) { let u = by[pp + 1]; sq.push(u > 127 ? u - 256 : u); }
    else if (ic === 2) { sq.push((by[pp + 1] | (by[pp + 2] << 8) | (by[pp + 3] << 16) | (by[pp + 4] << 24)) | 0); }
    else if (ic === 3) { tk(); }
    else if (ic === 4) { sq.push(sq[sq.length - 1]); }
    else if (ic === 5) { const w = tk(), u = tk(); sq.push(w, u); }
    else if (ic === 6) { sq.push(sq[sq.length - 2]); }
    else if (ic === 7) { const t = tk(), w = tk(), u = tk(); sq.push(w, t, u); }
    else if (ic >= 16 && ic <= 47) {
      if (ic === 23) { const u = tk(); sq.push((-u) | 0); }
      else if (ic === 27) { const u = tk(); sq.push(~u); }
      else { // pair ops
        const w = tk(), u = tk();
        if (ic === 16) sq.push((u + w) | 0);
        else if (ic === 17) sq.push((u - w) | 0);
        else if (ic === 18) sq.push(Math.imul(u, w));
        else if (ic === 19) { if (w === 0) { ft(4); break; } sq.push(Math.trunc(u / w) | 0); }
        else if (ic === 20) { if (w === 0) { ft(4); break; } sq.push((u % w) | 0); }
        else if (ic === 21) { if (w === 0) { ft(4); break; } sq.push(Math.trunc((u >>> 0) / (w >>> 0)) | 0); }
        else if (ic === 22) { if (w === 0) { ft(4); break; } sq.push(((u >>> 0) % (w >>> 0)) | 0); }
        else if (ic === 24) sq.push(u & w);
        else if (ic === 25) sq.push(u | w);
        else if (ic === 26) sq.push(u ^ w);
        else if (ic === 28) sq.push(u << (w & 31));
        else if (ic === 29) sq.push(u >> (w & 31));
        else if (ic === 30) sq.push((u >>> (w & 31)) | 0);
        else if (ic === 32) sq.push(u === w ? 1 : 0);
        else if (ic === 33) sq.push(u < w ? 1 : 0);
        else if (ic === 34) sq.push((u >>> 0) < (w >>> 0) ? 1 : 0);
      } // pair ops close
    } else if (ic === 48) { let ff = by[pp + 1] | (by[pp + 2] << 8); if (ff >= 32768) ff -= 65536; nn = nn + ff; }
    else if (ic === 49) { const q = tk(); let ff = by[pp + 1] | (by[pp + 2] << 8); if (ff >= 32768) ff -= 65536; if (q === 0) nn = nn + ff; }
    else if (ic === 50) { const q = tk(); let ff = by[pp + 1] | (by[pp + 2] << 8); if (ff >= 32768) ff -= 65536; if (q !== 0) nn = nn + ff; }
    else if (ic === 51) { if (cl.length >= 64) { ft(7); break; } cl.push(nn); nn = by[pp + 1] | (by[pp + 2] << 8); }
    else if (ic === 52) { if (cl.length === 0) { ft(8); break; } nn = cl.pop(); }
    else if (ic === 64) { const p = tk(); if (p < 0 || p > 255) { ft(6); break; } sq.push(mr[p]); }
    else if (ic === 65) { const p = tk(), q = tk(); if (p < 0 || p > 255) { ft(6); break; } mr[p] = q | 0; }
    else if (ic === 80) { const q = tk(); const g = String(q); if (oo.length + g.length > 65536) { ft(11); break; } for (let j = 0; j < g.length; j++) oo.push(g.charCodeAt(j)); }
    else if (ic === 81) { const q = tk(); if (oo.length >= 65536) { ft(11); break; } oo.push(q & 255); }
    else if (ic === 82) { sq.push(jj < dd.length ? dd[jj++] : -1); }
    else if (ic === 83) { const q = tk(); rc = q & 255; dn = true; break; }
    pp = nn;
  } // step loop done
  return { out: Buffer.from(oo), exit: rc };
} // machine end
const src = process.env["MAKEFUN_INPUT_DIR"] || "/input";
const dst = process.env["MAKEFUN_OUTPUT_DIR"] || "/output";
const ns = fs.readdirSync(src).sort();
for (const nm of ns) {
  const dp = path.join(src, nm);
  let sf;
  try { sf = fs.statSync(dp); } catch (e) { continue; }
  if (!sf.isDirectory()) continue;
  const od = path.join(dst, nm);
  let rs = { out: Buffer.alloc(0), exit: 1 };
  try { // load
    const pb = fs.readFileSync(path.join(dp, 'program.bin'));
    const nb = fs.readFileSync(path.join(dp, 'input.bin'));
    rs = go(pb, nb);
  } catch (e) { /* a broken instance keeps its fallback answer */ }
  try { // store
    fs.mkdirSync(od, { recursive: true });
    fs.writeFileSync(path.join(od, 'stdout.bin'), rs.out);
    fs.writeFileSync(path.join(od, 'exit.txt'), String(rs.exit) + '\n');
  } catch (e) { /* a failed write must not halt the rest */ }
} // end driver
