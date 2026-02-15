// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- PIKABOT CHAT ---
class Pikabot {
    constructor() {
        this.input = document.getElementById('chat-input');
        this.submit = document.getElementById('chat-submit');
        this.responseArea = document.getElementById('chat-response-text');
        this.endpoint = 'https://muddy-wood-cf4f.klakshman616.workers.dev/ask';

        if (this.input && this.submit) {
            this.init();
        }
    }

    init() {
        this.submit.addEventListener('click', () => this.handleSendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });

        // Focus input on load for immediate interaction
        setTimeout(() => this.input.focus(), 1500);
    }

    async handleSendMessage() {
        const questionText = this.input.value.trim();
        if (!questionText) return;

        // Reset: Clear old response and show loading
        // Text updated to be more engaging
        this.showResponse('Intercepting signal...', true);
        this.input.value = '';
        this.input.disabled = true;
        this.submit.disabled = true;

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "question": questionText })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const contentType = response.headers.get("content-type");
            let answer = "";

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                answer = data.answer || data.response || data.message || JSON.stringify(data);
            } else {
                answer = await response.text();
            }

            this.showResponse(answer);
        } catch (error) {
            console.error('Pikabot Error:', error);
            this.showResponse('Signal lost. The worker failed to respond.');
        } finally {
            this.input.disabled = false;
            this.submit.disabled = false;
            this.input.focus();
        }
    }

    showResponse(text, isLoading = false) {
        // Clear previous and set new
        this.responseArea.textContent = text;
        if (isLoading) {
            this.responseArea.classList.add('loading-dots');
        } else {
            this.responseArea.classList.remove('loading-dots');
        }
    }
}

// --- UI AND INITIALIZATION ---
function initUI() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
        });
    }

    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // Landing Animations - Faster and smoother
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(".hero-section .section-tag", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to("#title-main", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .to(".hero-section .sub-text", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .to("#pikabot-hero-chat", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
}

window.addEventListener('load', () => {
    initUI();
    new Pikabot();
});


// --- PIKABOT CHAT ---
class Pikabot {
    constructor() {
        this.input = document.getElementById('chat-input');
        this.submit = document.getElementById('chat-submit');
        this.responseArea = document.getElementById('chat-response-text');
        this.endpoint = 'https://muddy-wood-cf4f.klakshman616.workers.dev/ask';

        if (this.input && this.submit) {
            this.init();
        }
    }

    init() {
        this.submit.addEventListener('click', () => this.handleSendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    async handleSendMessage() {
        const questionText = this.input.value.trim();
        if (!questionText) return;

        // Reset: Clear old response and show loading
        this.showResponse('Intercepting signal...', true);
        this.input.value = '';
        this.input.disabled = true;
        this.submit.disabled = true;

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "question": questionText })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const contentType = response.headers.get("content-type");
            let answer = "";

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                answer = data.answer || data.response || data.message || JSON.stringify(data);
            } else {
                answer = await response.text();
            }

            this.showResponse(answer);
        } catch (error) {
            console.error('Pikabot Error:', error);
            this.showResponse('Signal lost. The worker failed to respond.');
        } finally {
            this.input.disabled = false;
            this.submit.disabled = false;
            this.input.focus();
        }
    }

    showResponse(text, isLoading = false) {
        // Clear previous and set new
        this.responseArea.textContent = text;
        if (isLoading) {
            this.responseArea.classList.add('loading-dots');
        } else {
            this.responseArea.classList.remove('loading-dots');
        }
    }
}

// --- UI AND INITIALIZATION ---
function initUI() {
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
    });

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Landing Animations
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(".hero-section .section-tag", { opacity: 1, y: 0, duration: 1 })
        .to("#title-main", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to(".hero-section .sub-text", { opacity: 1, y: 0, duration: 1 }, "-=0.7")
        .to("#pikabot-hero-chat", { opacity: 1, y: 0, duration: 1 }, "-=0.7");
}

window.addEventListener('load', () => {
    initUI();
    new CPU3D();
    new Pikabot();
});
