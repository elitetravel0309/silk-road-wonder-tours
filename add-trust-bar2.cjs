const fs = require('fs');

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

// Use regex to find the hero section end and about section start
// Pattern: </section> followed by blank line and <section class="section" id="about">
const pattern = /(<\/section>\s*\n\s*\n\s*<section class="section" id="about">)/;

const trustBar = `</section>

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

if (pattern.test(content)) {
  content = content.replace(pattern, trustBar);
  fs.writeFileSync('src/pages/index.astro', content, 'utf8');
  console.log('✓ Trust bar added to homepage');
} else {
  console.log('✗ Pattern not found, trying alternative approach');
  // Find the line with id="about" and insert before it
  const lines = content.split('\n');
  let insertIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="about"')) {
      insertIndex = i;
      break;
    }
  }
  if (insertIndex > 0) {
    // Find the </section> before this line
    let sectionEnd = -1;
    for (let i = insertIndex - 1; i >= 0; i--) {
      if (lines[i].trim() === '</section>') {
        sectionEnd = i;
        break;
      }
    }
    if (sectionEnd > 0) {
      console.log(`Found </section> at line ${sectionEnd + 1}, id="about" at line ${insertIndex + 1}`);
      // Insert trust bar after the </section> line
      const trustBarLines = [
        '',
        '  <!-- Trust Bar -->',
        '  <section style="background:var(--navy);padding:16px 0;">',
        '    <div class="container">',
        '      <div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:20px 36px;color:white;font-size:0.88rem;">',
        '        <div style="display:flex;align-items:center;gap:8px;">',
        '          <span style="color:#FFD700;font-size:1rem;">★★★★★</span>',
        '          <span><strong>4.9/5</strong> from 320+ reviews</span>',
        '        </div>',
        '        <div style="display:flex;align-items:center;gap:8px;">',
        '          <span style="font-size:1rem;">👥</span>',
        '          <span><strong>20,000+</strong> travelers</span>',
        '        </div>',
        '        <div style="display:flex;align-items:center;gap:8px;">',
        '          <span style="font-size:1rem;">🏆</span>',
        '          <span><strong>20+ years</strong> experience</span>',
        '        </div>',
        '        <div style="display:flex;align-items:center;gap:8px;">',
        '          <span style="font-size:1rem;">✅</span>',
        '          <span><strong>99%</strong> satisfaction</span>',
        '        </div>',
        '        <div style="display:flex;align-items:center;gap:8px;">',
        '          <span style="font-size:1rem;">⚡</span>',
        '          <span><strong>24hr</strong> quote response</span>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </section>',
        ''
      ];
      lines.splice(sectionEnd + 1, 0, ...trustBarLines);
      fs.writeFileSync('src/pages/index.astro', lines.join('\n'), 'utf8');
      console.log('✓ Trust bar added via line insertion');
    } else {
      console.log('✗ Could not find </section> before id="about"');
    }
  } else {
    console.log('✗ Could not find id="about"');
  }
}
