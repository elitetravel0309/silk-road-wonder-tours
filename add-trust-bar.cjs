const fs = require('fs');

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

// Find the hero section end and the about section start
const heroEnd = '  </section>\n\n  <section class="section" id="about">';

const trustBar = `  </section>

  <!-- Trust Bar -->
  <section style="background:var(--navy);padding:16px 0;">
    <div class="container">
      <div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:20px 36px;color:white;font-size:0.88rem;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:#FFD700;font-size:1rem;">★★★★★</span>
          <span><strong>4.9/5</strong> from 320+ reviews</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1rem;">👥</span>
          <span><strong>20,000+</strong> travelers</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1rem;">🏆</span>
          <span><strong>20+ years</strong> experience</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1rem;">✅</span>
          <span><strong>99%</strong> satisfaction</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1rem;">⚡</span>
          <span><strong>24hr</strong> quote response</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="about">`;

if (content.includes(heroEnd)) {
  content = content.replace(heroEnd, trustBar);
  fs.writeFileSync('src/pages/index.astro', content, 'utf8');
  console.log('✓ Trust bar added to homepage');
} else {
  console.log('✗ Pattern not found');
  // Try to find the pattern with different whitespace
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="about"')) {
      console.log(`Found id="about" at line ${i+1}: ${lines[i].trim()}`);
      console.log(`Previous line: ${lines[i-1] ? lines[i-1].trim() : 'none'}`);
      console.log(`Line before that: ${lines[i-2] ? lines[i-2].trim() : 'none'}`);
    }
  }
}
