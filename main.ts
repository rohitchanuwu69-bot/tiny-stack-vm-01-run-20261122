const fs = require('fs');
const path = require('path');
function run(prog, inp) {
  const mem = new Int32Array(256);
  const st = [];
  const cs = [];
  let pc = 0, steps = 0, ii = 0;
  const out = [];
  let exit = 0, done = false;
  const immLen = {1:1,2:4,48:2,49:2,50:2,51:2};
  const pops = {3:1,4:1,5:2,6:2,7:3,16:2,17:2,18:2,19:2,20:2,21:2,22:2,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:2,33:2,34:2,35:2,36:2,37:2,38:2,39:2,40:2,41:2,42:2,43:2,44:2,45:2,46:2,47:2,48:0,49:1,50:1,51:0,52:0,64:1,65:2,80:1,81:1,82:0,83:1};
  const push = {1:1,2:1,4:2,5:2,6:3,7:3,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1,44:1,45:1,46:1,47:1,64:1,82:1};
  const known = new Set([0,1,2,3,4,5,6,7,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,64,65,80,81,82,83]);
  function trap(c) { exit = c; done = true; }
  while (!done) {
    if (steps >= 1000000) { trap(10); break; }
    if (pc < 0 || pc >= prog.length) { trap(9); break; }
    const op = prog[pc];
    if (!known.has(op)) { trap(5); break; }
    const il = immLen[op] || 0;
    if (pc + il >= prog.length) { trap(9); break; }
    const np = pops[op] || 0, nq = push[op] || 0;
    if (st.length < np) { trap(2); break; }
    if (st.length - np + nq > 256) { trap(3); break; }
    steps++;
    let next = pc + 1 + il;
    const pop = () => st.pop();
    if (op === 0) { exit = 0; done = true; break; }
    else if (op === 1) { let b = prog[pc + 1]; st.push(b > 127 ? b - 256 : b); }
    else if (op === 2) { st.push((prog[pc + 1] | (prog[pc + 2] << 8) | (prog[pc + 3] << 16) | (prog[pc + 4] << 24)) | 0); }
    else if (op === 3) { pop(); }
    else if (op === 4) { st.push(st[st.length - 1]); }
    else if (op === 5) { const b = pop(), a = pop(); st.push(b, a); }
    else if (op === 6) { st.push(st[st.length - 2]); }
    else if (op === 7) { const c = pop(), b = pop(), a = pop(); st.push(b, c, a); }
    else if (op >= 16 && op <= 47) {
      if (op === 23) { const a = pop(); st.push((-a) | 0); }
      else if (op === 27) { const a = pop(); st.push(~a); }
      else {
        const b = pop(), a = pop();
        if (op === 16) st.push((a + b) | 0);
        else if (op === 17) st.push((a - b) | 0);
        else if (op === 18) st.push(Math.imul(a, b));
        else if (op === 19) { if (b === 0) { trap(4); break; } st.push(Math.trunc(a / b) | 0); }
        else if (op === 20) { if (b === 0) { trap(4); break; } st.push((a % b) | 0); }
        else if (op === 21) { if (b === 0) { trap(4); break; } st.push(Math.trunc((a >>> 0) / (b >>> 0)) | 0); }
        else if (op === 22) { if (b === 0) { trap(4); break; } st.push(((a >>> 0) % (b >>> 0)) | 0); }
        else if (op === 24) st.push(a & b);
        else if (op === 25) st.push(a | b);
        else if (op === 26) st.push(a ^ b);
        else if (op === 28) st.push(a << (b & 31));
        else if (op === 29) st.push(a >> (b & 31));
        else if (op === 30) st.push((a >>> (b & 31)) | 0);
        else if (op === 32) st.push(a === b ? 1 : 0);
        else if (op === 33) st.push(a < b ? 1 : 0);
        else if (op === 34) st.push((a >>> 0) < (b >>> 0) ? 1 : 0);
      }
    }
    else if (op === 48) { let o = prog[pc + 1] | (prog[pc + 2] << 8); if (o >= 32768) o -= 65536; next = next + o; }
    else if (op === 49) { const v = pop(); let o = prog[pc + 1] | (prog[pc + 2] << 8); if (o >= 32768) o -= 65536; if (v === 0) next = next + o; }
    else if (op === 50) { const v = pop(); let o = prog[pc + 1] | (prog[pc + 2] << 8); if (o >= 32768) o -= 65536; if (v !== 0) next = next + o; }
    else if (op === 51) { if (cs.length >= 64) { trap(7); break; } cs.push(next); next = prog[pc + 1] | (prog[pc + 2] << 8); }
    else if (op === 52) { if (cs.length === 0) { trap(8); break; } next = cs.pop(); }
    else if (op === 64) { const a = pop(); if (a < 0 || a > 255) { trap(6); break; } st.push(mem[a]); }
    else if (op === 65) { const a = pop(), v = pop(); if (a < 0 || a > 255) { trap(6); break; } mem[a] = v | 0; }
    else if (op === 80) { const v = pop(); const s = String(v); if (out.length + s.length > 65536) { trap(11); break; } for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i)); }
    else if (op === 81) { const v = pop(); if (out.length >= 65536) { trap(11); break; } out.push(v & 255); }
    else if (op === 82) { st.push(ii < inp.length ? inp[ii++] : -1); }
    else if (op === 83) { const v = pop(); exit = v & 255; done = true; break; }
    pc = next;
  }
  return { out: Buffer.from(out), exit };
}
const inDir = process.env.MAKEFUN_INPUT_DIR || '/input';
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const ids = fs.readdirSync(inDir).sort();
for (const id of ids) {
  const prog = fs.readFileSync(path.join(inDir, id, 'program.bin'));
  const inp = fs.readFileSync(path.join(inDir, id, 'input.bin'));
  const r = run(prog, inp);
  const d = path.join(outDir, id);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'stdout.bin'), r.out);
  fs.writeFileSync(path.join(d, 'exit.txt'), String(r.exit) + '\n');
}
