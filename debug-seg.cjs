const iconv = require('iconv-lite');
const seg = '鐑ゅ寘瀛?';
const prefix = seg.replace(/\?/g, '');
console.log('seg:', JSON.stringify(seg), 'prefix:', JSON.stringify(prefix));
// step1
try {
  const b = iconv.encode(seg, 'gbk');
  const hex = Buffer.from(b).toString('hex');
  const d = Buffer.from(b).toString('utf8');
  console.log('step1 bytes:', hex);
  console.log('step1 utf8:', JSON.stringify(d), 'hasFFFD:', d.includes('\ufffd'));
} catch (e) { console.log('step1 ERR', e.message); }
// step2
try {
  const b = iconv.encode(prefix, 'gbk');
  const hex = Buffer.from(b).toString('hex');
  const d = Buffer.from(b).toString('utf8');
  console.log('step2 bytes:', hex);
  console.log('step2 utf8:', JSON.stringify(d), 'hasFFFD:', d.includes('\ufffd'));
} catch (e) { console.log('step2 ERR', e.message); }
// individual chars
for (const ch of prefix) {
  console.log('char', JSON.stringify(ch), 'gbk:', Buffer.from(iconv.encode(ch, 'gbk')).toString('hex'));
}
