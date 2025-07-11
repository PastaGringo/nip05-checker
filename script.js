// Bech32 decoding for npub conversion
const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function bech32Decode(bech) {
    const pos = bech.lastIndexOf('1');
    if (pos < 1 || pos + 7 > bech.length || bech.length > 90) {
        throw new Error('Invalid bech32 string');
    }
    
    const hrp = bech.substring(0, pos);
    const data = bech.substring(pos + 1);
    
    const decoded = [];
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const value = BECH32_CHARSET.indexOf(char);
        if (value === -1) {
            throw new Error('Invalid character in bech32 string');
        }
        decoded.push(value);
    }
    
    return { hrp, data: decoded };
}

function convertBits(data, fromBits, toBits, pad = true) {
    let acc = 0;
    let bits = 0;
    const ret = [];
    const maxv = (1 << toBits) - 1;
    const maxAcc = (1 << (fromBits + toBits - 1)) - 1;
    
    for (const value of data) {
        if (value < 0 || (value >> fromBits) !== 0) {
            throw new Error('Invalid data for base conversion');
        }
        acc = ((acc << fromBits) | value) & maxAcc;
        bits += fromBits;
        while (bits >= toBits) {
            bits -= toBits;
            ret.push((acc >> bits) & maxv);
        }
    }
    
    if (pad) {
        if (bits > 0) {
            ret.push((acc << (toBits - bits)) & maxv);
        }
    } else if (bits >= fromBits || ((acc << (toBits - bits)) & maxv)) {
        throw new Error('Invalid padding in base conversion');
    }
    
    return ret;
}

function npubToHex(npub) {
    try {
        if (!npub.startsWith('npub1')) {
            throw new Error('Invalid npub format');
        }
        
        const { data } = bech32Decode(npub);
        const decoded = convertBits(data.slice(0, -6), 5, 8, false);
        return decoded.map(x => x.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        throw new Error('Invalid npub format');
    }
}

// Language management
let currentLanguage = localStorage.getItem('nip05-language') || 'en';

const translations = {
    en: {
        verifying: 'Verifying...',
        success: 'Verification successful!',
        keyFound: 'Key found in nostr.json',
        keyMatches: 'Key matches your npub',
        error: 'Verification failed',
        keyNotFound: 'Key not found in nostr.json for username',
        keyMismatch: 'Key mismatch! Expected',
        but: 'but found',
        npubFormatDetected: 'npub format detected in nostr.json',
        shouldUseHex: 'The nostr.json file should use hexadecimal format, not npub format. Expected',
        fetchError: 'Failed to fetch nostr.json from',
        corsError: 'CORS error - trying alternative method',
        invalidNpub: 'Invalid npub format',
        fillAllFields: 'Please fill in all fields',
        checkConsole: 'Check browser console for details'
    },
    fr: {
        verifying: 'Vérification en cours...',
        success: 'Vérification réussie !',
        keyFound: 'Clé trouvée dans nostr.json',
        keyMatches: 'La clé correspond à votre npub',
        error: 'Échec de la vérification',
        keyNotFound: 'Clé non trouvée dans nostr.json pour le nom d\'utilisateur',
        keyMismatch: 'Clé non correspondante ! Attendu',
        but: 'mais trouvé',
        npubFormatDetected: 'format npub détecté dans nostr.json',
        shouldUseHex: 'Le fichier nostr.json devrait utiliser le format hexadécimal, pas le format npub. Attendu',
        fetchError: 'Échec de récupération de nostr.json depuis',
        corsError: 'Erreur CORS - tentative avec méthode alternative',
        invalidNpub: 'Format npub invalide',
        fillAllFields: 'Veuillez remplir tous les champs',
        checkConsole: 'Vérifiez la console du navigateur pour plus de détails'
    }
};

function updateLanguage() {
    // Update language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.id === `lang-${currentLanguage}`);
    });
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en], [data-fr]');
    elements.forEach(element => {
        const key = `data-${currentLanguage}`;
        if (element.hasAttribute(key)) {
            element.textContent = element.getAttribute(key);
        }
    });
    
    // Update placeholders
    const inputElements = document.querySelectorAll('input[data-placeholder-en], input[data-placeholder-fr]');
    inputElements.forEach(input => {
        const placeholderKey = `data-placeholder-${currentLanguage}`;
        if (input.hasAttribute(placeholderKey)) {
            input.placeholder = input.getAttribute(placeholderKey);
        }
    });
    
    // Save language preference
    localStorage.setItem('nip05-language', currentLanguage);
}

// Verification function
async function verifyNIP05() {
    const username = document.getElementById('username').value.trim();
    const domain = document.getElementById('domain').value.trim();
    const npub = document.getElementById('npub').value.trim();
    const resultDiv = document.getElementById('result');
    const t = translations[currentLanguage];
    
    if (!username || !domain || !npub) {
        showResult('error', t.fillAllFields);
        return;
    }
    
    try {
        // Convert npub to hex
        const expectedHex = npubToHex(npub);
        
        // Show loading state
        showResult('loading', t.verifying);
        
        // Fetch nostr.json
        const url = `https://${domain}/.well-known/nostr.json`;
        let response;
        
        try {
            response = await fetch(url);
        } catch (error) {
            console.log(t.corsError);
            // Try with CORS proxy
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const proxyResponse = await fetch(proxyUrl);
            const proxyData = await proxyResponse.json();
            
            if (!proxyData.contents) {
                throw new Error(`${t.fetchError} ${domain}`);
            }
            
            const data = JSON.parse(proxyData.contents);
            verifyData(data, username, expectedHex, t);
            return;
        }
        
        if (!response.ok) {
            throw new Error(`${t.fetchError} ${domain} (${response.status})`);
        }
        
        const data = await response.json();
        verifyData(data, username, expectedHex, t);
        
    } catch (error) {
        console.error('Verification error:', error);
        if (error.message.includes('Invalid npub')) {
            showResult('error', t.invalidNpub);
        } else {
            showResult('error', `${error.message}. ${t.checkConsole}`);
        }
    }
}

function verifyData(data, username, expectedHex, t) {
    if (!data.names || !data.names[username]) {
        showResult('error', `${t.keyNotFound} "${username}"`);
        return;
    }
    
    const foundKey = data.names[username];
    
    // Check if the found key is in npub format
    if (foundKey.startsWith('npub1')) {
        showResult('error', `${t.npubFormatDetected}. ${t.shouldUseHex}: ${expectedHex}`);
        return;
    }
    
    if (foundKey.toLowerCase() !== expectedHex.toLowerCase()) {
        showResult('error', `${t.keyMismatch} ${expectedHex} ${t.but} ${foundKey}`);
        return;
    }
    
    showResult('success', `${t.keyFound}: ${foundKey}<br>${t.keyMatches}`);
}

function showResult(type, message) {
    const resultDiv = document.getElementById('result');
    const t = translations[currentLanguage];
    
    resultDiv.className = `result ${type}`;
    
    let icon, title;
    switch (type) {
        case 'success':
            icon = '✅';
            title = t.success;
            break;
        case 'error':
            icon = '❌';
            title = t.error;
            break;
        case 'loading':
            icon = '⏳';
            title = t.verifying;
            break;
    }
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <span class="result-icon">${icon}</span>
            <div class="result-message">
                <strong>${title}</strong>
                <div class="result-details">${message}</div>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    updateLanguage();
    
    // Language switcher
    document.getElementById('lang-en').addEventListener('click', () => {
        currentLanguage = 'en';
        updateLanguage();
    });
    
    document.getElementById('lang-fr').addEventListener('click', () => {
        currentLanguage = 'fr';
        updateLanguage();
    });
    
    // Verify button
    document.getElementById('verify-btn').addEventListener('click', verifyNIP05);
    
    // Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyNIP05();
        }
    });
    
    // Input validation for npub
    document.getElementById('npub').addEventListener('input', function(e) {
        const value = e.target.value;
        if (value && !value.startsWith('npub1')) {
            e.target.style.borderColor = '#ff6b6b';
        } else {
            e.target.style.borderColor = '';
        }
    });
});