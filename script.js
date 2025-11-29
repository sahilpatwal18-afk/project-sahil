// STAR BACKGROUND
const starsContainer = document.getElementById('starsContainer');
const starCount = 100;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3;
    const duration = 2 + Math.random() * 3 + 's';
    const opacity = Math.random();

    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.setProperty('--duration', duration);
    star.style.setProperty('--opacity', opacity);

    starsContainer.appendChild(star);
}

// MODE SWITCHING
let currentMode = 'encode';
const input = document.getElementById('input');
const output = document.getElementById('output');
const stats = document.getElementById('stats');
const modeButtons = document.querySelectorAll('.mode-btn');

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        input.value = '';
        output.innerHTML = '<div class="empty-state">Your converted message will appear here ✨</div>';
        stats.style.display = 'none';
        updatePlaceholder();
    });
});

function updatePlaceholder() {
    input.placeholder = currentMode === 'encode'
        ? 'Type your text here...'
        : 'Paste binary code here (e.g., 01001000 01101001)...';
}

// REAL-TIME CONVERSION
input.addEventListener('input', () => {
    const value = input.value.trim();

    if (!value) {
        output.innerHTML = '<div class="empty-state">Your converted message will appear here ✨</div>';
        stats.style.display = 'none';
        return;
    }

    currentMode === 'encode' ? encodeText(value) : decodeText(value);
});

// ENCODE
function encodeText(text) {
    let html = '';
    let totalBits = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const binary = char.charCodeAt(0)
            .toString(2)
            .padStart(8, '0');

        totalBits += 8;

        html += `<span class="char-group binary" title="${char}">${binary}</span>`;
    }

    output.innerHTML = html;
    updateStats(text.length, totalBits);
}

// DECODE
function decodeText(binary) {
    try {
        const cleanBinary = binary.replace(/[^01]/g, '');

        if (cleanBinary.length === 0) {
            output.innerHTML = '<div class="empty-state">Enter valid binary code...</div>';
            stats.style.display = 'none';
            return;
        }

        if (cleanBinary.length % 8 !== 0) {
            output.innerHTML = '<div class="error">⚠ Binary string must be a multiple of 8 bits</div>';
            stats.style.display = 'none';
            return;
        }

        let html = '';
        let charCount = 0;

        for (let i = 0; i < cleanBinary.length; i += 8) {
            const byte = cleanBinary.substr(i, 8);
            const charCode = parseInt(byte, 2);
            const char = String.fromCharCode(charCode);
            charCount++;

            html += `<span class="char-group text" title="${byte}">${char}</span>`;
        }

        output.innerHTML = html;
        updateStats(charCount, cleanBinary.length);
    } catch (e) {
        output.innerHTML = '<div class="error">⚠ Invalid binary format</div>';
        stats.style.display = 'none';
    }
}

// STATS UPDATE
function updateStats(chars, bits) {
    document.getElementById('charCount').textContent = chars;
    document.getElementById('bitCount').textContent = bits;
    document.getElementById('byteCount').textContent = Math.ceil(bits / 8);
    stats.style.display = 'flex';
}
