import fs from 'fs';

const path = 'src/pages/InvitationPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add imports
const newImports = `
import SplitScreenHero from '../components/themes/SplitScreenHero';
import MagazineHero from '../components/themes/MagazineHero';
import NeonGlowHero from '../components/themes/NeonGlowHero';
import LuxuryGoldHero from '../components/themes/LuxuryGoldHero';
import PassportHero from '../components/themes/PassportHero';
import PolaroidVintageHero from '../components/themes/PolaroidVintageHero';
import WhimsicalKidsHero from '../components/themes/WhimsicalKidsHero';
`;
content = content.replace(
    'import RomanticBotanicalHero from \'../components/themes/RomanticBotanicalHero\';',
    'import RomanticBotanicalHero from \'../components/themes/RomanticBotanicalHero\';' + newImports
);

// Update globalStyles mapping
const newGlobalStyles = `    // Dynamic Theming Variables
    const themeName = event?.theme_config?.theme || 'classic';
    
    // Default Light Palette
    let sectionBg = '#ffffff';
    let sectionBgAlt = '#FDFBF7';
    let cardBg = '#ffffff';
    let textPrimary = '#1c1917';
    let textSecondary = '#57534e';
    let borderColor = '#f5f5f4';
    let cardBorder = '#e7e5e4';

    // Theme Overrides
    if (themeName === 'modern-minimalist' || themeName === 'neon-glow' || themeName === 'luxury-gold') {
        sectionBg = '#1a1a1a';
        sectionBgAlt = '#151515';
        cardBg = '#242424';
        textPrimary = '#ffffff';
        textSecondary = '#a3a3a3';
        borderColor = '#333333';
        cardBorder = '#404040';
    } else if (themeName === 'polaroid-vintage') {
        sectionBg = '#Eae6df';
        sectionBgAlt = '#Dcd7cf';
        cardBg = '#ffffff';
    } else if (themeName === 'whimsical-kids') {
        sectionBg = '#FDFBF7';
        sectionBgAlt = '#FFF5F3';
        cardBg = '#ffffff';
        cardBorder = '#FFB5A7';
    } else if (themeName === 'passport') {
        sectionBg = '#F0F4F8';
        sectionBgAlt = '#E1E8ED';
        cardBg = '#ffffff';
        cardBorder = '#006B7D33';
    }

    const globalStyles = {
        '--section-bg': sectionBg,
        '--section-bg-alt': sectionBgAlt,
        '--card-bg': cardBg,
        '--text-primary': textPrimary,
        '--text-secondary': textSecondary,
        '--border-color': borderColor,
        '--card-border': cardBorder,
    } as React.CSSProperties;`;

content = content.replace(
    /    \/\/ Dynamic Theming Variables[\s\S]*?\} as React\.CSSProperties;/,
    newGlobalStyles
);

// Update renderHero
const newRenderHero = `        // FULL-PAGE THEMES
        if (cfg.theme === 'modern-minimalist') {
            return <ModernMinimalistHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'classic-elegance') {
            return <ClassicEleganceHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'romantic-botanical') {
            return <RomanticBotanicalHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'split-screen') {
            return <SplitScreenHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'magazine') {
            return <MagazineHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'neon-glow') {
            return <NeonGlowHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'luxury-gold') {
            return <LuxuryGoldHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'passport') {
            return <PassportHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'polaroid-vintage') {
            return <PolaroidVintageHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }
        if (cfg.theme === 'whimsical-kids') {
            return <WhimsicalKidsHero key="hero" event={event} cfg={cfg} countdown={countdown} labels={labels} heroImageUrl={heroImageUrl} scrollToSection={scrollToSection} />;
        }`;

content = content.replace(
    /        \/\/ PREMIUM HERO[\s\S]*?if \(cfg\.theme === 'romantic-botanical'\) \{[\s\S]*?\}[\s]*\n/m,
    newRenderHero + '\n'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated InvitationPage with all 10 themes.');
