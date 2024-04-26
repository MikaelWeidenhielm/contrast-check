const cssVariableNames = extractCSSVariableNamesFromDOM();

content.setAttribute('data-theme', localStorage.getItem('data-theme'));

// Check each variable to see if it starts with '--surface-color'
const backgroundColors = cssVariableNames.filter(variable => variable.startsWith('--color-surface'));
const textColors = cssVariableNames.filter(variable => variable.startsWith('--color-text'));


const container = document.getElementById('container');
const tokenRow = document.getElementById('tokenRow');
const tokenColumn = document.getElementById('tokenColumn');
const cardContainer = document.getElementById('cardContainer');
const info = document.getElementById('info');

// // populate tokenColumn with names of backgrounds
for (let i = 0; i < backgroundColors.length; i++) {
    const tokenColumnLabel = document.createElement('div');
    
    tokenColumnLabel.textContent = backgroundColors[i].replace('--color-', '');
    tokenColumnLabel.classList.add('tokenColumnLabel');
    tokenColumnLabel.classList.add(backgroundColors[i].replace('--color-', ''))
    tokenColumn.appendChild(tokenColumnLabel);
}

let cardCount = 0;

//create color cards
for (let i = 0; i < textColors.length; i++) {

    // // create columns per text token that will be populated by background colors
    const cardColumn = document.createElement('div');

    // populate tokenRow with names of text colors
    const tokenRowLabel = document.createElement('div');
    cardColumn.classList.add('cardColumn');
    tokenRow.appendChild(tokenRowLabel)

    tokenRowLabel.textContent = textColors[i].replace('--color-', '');
    tokenRowLabel.classList.add('tokenRowLabel');
    tokenRowLabel.classList.add(textColors[i].replace('--color-', ''));

    cardContainer.appendChild(cardColumn);
    
    for (let j = 0; j < backgroundColors.length; j++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(backgroundColors[j].replace('--color-', ''));
        card.classList.add(textColors[i].replace('--color-', ''));
        card.id = `card-${cardCount}`;
        cardCount++;
        card.style.backgroundColor = `var(${backgroundColors[j]})`;
        card.style.color = `var(${textColors[i]})`;
        card.textContent = "Text"
        cardColumn.appendChild(card);
    }
}


let fails = 0;
let aaLarge = 0;

// Calculate contrasts on all cards
let cards = document.getElementsByClassName('card');

const calculateContrasts = () => {
    aaLarge = 0;
    fails = 0;
    for (let i = 0; i < cards.length; i++) {
        
        let dot;
        let contrastLabel;

        if(!document.querySelector(`#card-${[i]} .contrastLabel`)) {
            contrastLabel = document.createElement('p');
            contrastLabel.classList.add('contrastLabel')
            contrastLabel.id = `label${[i]}`

            dot = document.createElement('span');
            dot.classList.add('dot')
        } else {
            dot = document.querySelector(`#card-${[i]} .dot`);
            contrastLabel = document.querySelector(`#card-${[i]} .contrastLabel`);
        }

        const backgroundColor = getComputedStyle(cards[i]).getPropertyValue('background-color').trim();
        const textColor = getComputedStyle(cards[i]).getPropertyValue('color').trim();

        const contrastRatio = calculateContrastRatio(backgroundColor, textColor);
        const accessibilityScore = evaluateContrastRatio(contrastRatio);

        if(accessibilityScore === "AAA") {
            dot.classList.remove('aa-large')
            dot.classList.remove('fail')
            dot.classList.add('aa')
            
            contrastLabel.textContent = `AAA / ${contrastRatio.toFixed(1)}`;

            if(contrastLabel.id.includes('fail')) {
                contrastLabel.id = contrastLabel.id.replace(' fail', '');
            }
        } else if (accessibilityScore === "AA") {
            dot.classList.remove('aa-large')
            dot.classList.remove('fail')
            dot.classList.add('aa')
            contrastLabel.textContent = `AA / ${contrastRatio.toFixed(1)}`;

            if(contrastLabel.id.includes('fail')) {
                contrastLabel.id = contrastLabel.id.replace(' fail', '');
            }
            
        } else if (accessibilityScore === "AA large") {
            dot.classList.remove('aa')
            dot.classList.remove('fail')
            dot.classList.add('aa-large')
            contrastLabel.textContent = `AA large / ${contrastRatio.toFixed(1)}`;

            if(!contrastLabel.id.includes('fail')) {
                contrastLabel.id = `${contrastLabel.id} fail`
            }

            aaLarge++
        } else if(accessibilityScore === "Fail") {
            
            dot.classList.remove('aa')
            dot.classList.remove('aa-large')
            dot.classList.add('fail')

            contrastLabel.textContent = `Fail / ${contrastRatio.toFixed(1)}`;

            if(!contrastLabel.id.includes('fail')) {
                contrastLabel.id = `${contrastLabel.id} fail`
            }

            fails++;
        }

        contrastLabel.appendChild(dot);
        cards[i].appendChild(contrastLabel);
        info.textContent = `${fails} fails, ${aaLarge} AA large`;
    }
}


calculateContrasts()


//function to toggle cards 

localStorage.setItem('hidden', false);

const hideApprovedCards = () => {
    for (let i = 0; i < cards.length; i++) {
        if(cards[i].children[0].id !== `label${[i]} fail`) {
            cards[i].classList.add('hidden');
        } else {
            cards[i].classList.remove('hidden');
        }
    }
    localStorage.setItem('hidden', true);
}

const showAllCards = () => {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('hidden');
    }
    
    localStorage.setItem('hidden', false);
}

const toggleCards = () => {
    if(localStorage.getItem('hidden') === "false") {
        hideApprovedCards()
    } else {
        showAllCards()
    }
}

const toggleTheme = () => {
    const content = document.getElementById('content');
    // Get the current theme
    const currentTheme = content.getAttribute('data-theme');
    // Toggle the theme
    if (currentTheme === 'light') {
        content.setAttribute('data-theme', 'dark');
        localStorage.setItem('data-theme', 'dark');
    } else {
        localStorage.setItem('data-theme', 'light');
        content.setAttribute('data-theme', localStorage.getItem('data-theme'));
    }

    calculateContrasts()


    if(localStorage.getItem('hidden') === "true") {
        hideApprovedCards()
    }
}