# Website Polish Plan (Step 2)

**Goal**: Make latchet.vercel.app feel professional, minimalist, and interactive—not AI-generated.

---

## What's Already Good

✅ Black-only aesthetic (no distracting gradients)  
✅ Founder visible (name in header, hero, footer)  
✅ Custom icon system (consistent across hero, features, CLI)  
✅ Interactive hero (event chips with hover states, orbit visualization)  
✅ Fonts are solid (Instrument Sans + IBM Plex Mono)  
✅ Responsive mobile layout  
✅ GitHub link prominent  

---

## What Needs Polish (Priority Order)

### 1. Typography Hierarchy & Rhythm
**Current issue**: Some headlines are generic ("Not AI memory theater. Durable task primitives.")  
**Fix**:
- Make h1 tighter and more confident (current: "Give every model the same task state.")
- Use punchy, concrete language in section headers
- Tighten h2 line-height and letter-spacing
- Add more vertical breathing between sections

**Files to change**: 
- [apps/site/src/content.ts](apps/site/src/content.ts) — tighten copy
- [apps/site/src/styles.css](apps/site/src/styles.css) — adjust h1/h2 sizing and spacing

### 2. Micro-Interactions & Polish
**Current issue**: Mostly static. Hover states exist but aren't obvious.  
**Fix**:
- Add fade-in animations on scroll (`.reveal` class already exists, verify they work)
- Improve button hover states (currently just translates up, add subtle glow)
- Add cursor: pointer feedback on interactive elements
- Make navigation links underline animation more obvious
- Add transition to event chips (currently just color change)

**Files to change**: 
- [apps/site/src/styles.css](apps/site/src/styles.css) — add animations and transitions

### 3. Section Copy Tightening
**Current issue**: Some copy is corporate-sounding.  
**Fix**:
- "Story" section (Why) should be more concrete, less abstract
- Features section: put the benefit first, not the meta
- "Workflow" section: show actual value, not just the process
- "Tooling" section: emphasize what the CLI/MCP *does*, not just that it exists

**Files to change**: 
- [apps/site/src/content.ts](apps/site/src/content.ts) — rewrite copy for clarity

### 4. Visual Density & Spacing
**Current issue**: Some sections feel sparse or over-padded.  
**Fix**:
- Tighten padding around feature cards
- Increase visual weight of the "Why" section (story rows)
- Make CLI examples more visible (increase font size, add subtle background)
- Improve footer density (currently feels disconnected)

**Files to change**: 
- [apps/site/src/styles.css](apps/site/src/styles.css) — adjust padding/margins

### 5. Color & Contrast
**Current issue**: Mostly grays and light colors, might feel washed out.  
**Fix**:
- Check that cyan and amber accents are used strategically
- Ensure muted text (70%+ opacity) is still readable
- Consider slight brightening of `--ink` for better readability on dark bg

**Files to change**: 
- [apps/site/src/styles.css](apps/site/src/styles.css) — CSS variables

### 6. Footer & CTA
**Current issue**: Footer might feel tacked-on.  
**Fix**:
- Make CTA more prominent ("Get started" or "Try on GitHub")
- Footer should reinforce brand + provide minimal links
- Add actual email or contact info (not just links)

**Files to change**: 
- [apps/site/src/components/FooterCta.tsx](apps/site/src/components/FooterCta.tsx)
- [apps/site/src/content.ts](apps/site/src/content.ts)

---

## Specific Changes (Execution Order)

### Change 1: Tighten h1/h2 and add section spacing
**File**: [apps/site/src/styles.css](apps/site/src/styles.css)  
**What**: Reduce h1/h2 line-height, increase section padding, tweak color hierarchy

### Change 2: Improve button & interaction animations
**File**: [apps/site/src/styles.css](apps/site/src/styles.css)  
**What**: Add smooth transitions to all interactive elements, subtle glow on button hover

### Change 3: Rewrite content for clarity
**File**: [apps/site/src/content.ts](apps/site/src/content.ts)  
**What**: 
- Tighten "Why" section (story rows) from abstract to concrete
- Features: lead with benefit, not category
- Workflow: focus on "what the user gets" not "what the tool does"

### Change 4: Polish section CSS (spacing, density)
**File**: [apps/site/src/styles.css](apps/site/src/styles.css)  
**What**: Tighten padding around cards, increase feature font sizes, improve readability

### Change 5: Strengthen footer & CTA
**File**: [apps/site/src/components/FooterCta.tsx](apps/site/src/components/FooterCta.tsx)  
**What**: Make CTA "Try on GitHub" or "Get Started" more visible, improve footer copy

---

## Verification Checklist

After changes:

- [ ] `npm run build:site` passes without errors
- [ ] Mobile (390x844) renders cleanly
- [ ] Desktop renders cleanly
- [ ] No console errors
- [ ] No unused CSS variables
- [ ] All hover states work
- [ ] Animations feel natural (not jarring)
- [ ] Copy is clear and specific
- [ ] Founder name is visible
- [ ] GitHub link is prominent
- [ ] CTA is clear

---

## What NOT to Change

❌ Remove the hero interactive section  
❌ Change the icon system  
❌ Add colors beyond black/gray/cyan/amber  
❌ Change fonts  
❌ Add heavy graphics or illustrations  

---

## Expected Outcome

The site should feel:
- **Minimal** — less is more, no clutter
- **Editorial** — like a product by a serious founder, not a template
- **Interactive** — smooth transitions, obvious hover states
- **Professional** — clear copy, no fluff
- **Focused** — one clear CTA, not distracted by sidebars or extra sections
