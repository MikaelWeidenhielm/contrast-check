// Function to calculate contrast ratio
function calculateContrastRatio(background, text) {
    const lumA = calculateLuminance(background);
    const lumB = calculateLuminance(text);

    const brighter = Math.max(lumA, lumB);
    const darker = Math.min(lumA, lumB);

    return (brighter + 0.05) / (darker + 0.05);
}

// Function to calculate luminance
function calculateLuminance(color) {
    const rgb = color.match(/\d+/g);
    const [r, g, b] = rgb.map(component => {
        const linear = component / 255;
        return linear <= 0.03928 ? linear / 12.92 : Math.pow((linear + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to evaluate contrast ratio against WCAG standards
function evaluateContrastRatio(contrastRatio) {
    if (contrastRatio >= 7) {
        return 'AAA';
    } else if (contrastRatio >= 4.5) {
        return 'AA';
    } else if (contrastRatio >= 3.1) {
        return 'AA large';
    }else {
        return 'Fail';
    }
}