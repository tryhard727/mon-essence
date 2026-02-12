// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- 3D CPU DECONSTRUCTION ---
class CPU3D {
    constructor() {
        this.container = document.getElementById('cpu-canvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.parts = {};
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 8;
        this.camera.position.y = 1;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0x00f2ff, 100);
        spotLight.position.set(5, 10, 5);
        this.scene.add(spotLight);

        const pointLight = new THREE.PointLight(0x7000ff, 50);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);

        this.createFullCPU();
        this.setupScrollAnimations();
        this.animate();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createFullCPU() {
        this.cpuGroup = new THREE.Group();
        this.scene.add(this.cpuGroup);

        // 1. Substrate (Green PCB)
        const subGeo = new THREE.BoxGeometry(3, 0.1, 3);
        const subMat = new THREE.MeshStandardMaterial({
            color: 0x052a1a,
            roughness: 0.5,
            metalness: 0.3
        });
        this.parts.substrate = new THREE.Mesh(subGeo, subMat);
        this.cpuGroup.add(this.parts.substrate);

        // 2. Pins (Bottom) - Grouping them
        this.parts.pins = new THREE.Group();
        const pinGeo = new THREE.BoxGeometry(0.05, 0.1, 0.05);
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1, roughness: 0.1 });

        for (let i = -1.4; i <= 1.4; i += 0.25) {
            for (let j = -1.4; j <= 1.4; j += 0.25) {
                if (Math.abs(i) < 0.5 && Math.abs(j) < 0.5) continue;
                const pin = new THREE.Mesh(pinGeo, pinMat);
                pin.position.set(i, -0.1, j);
                this.parts.pins.add(pin);
            }
        }
        this.cpuGroup.add(this.parts.pins);

        // 3. Die (Silicon)
        const dieGeo = new THREE.BoxGeometry(0.9, 0.05, 0.9);
        const dieMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 1,
            roughness: 0,
            emissive: 0x00f2ff,
            emissiveIntensity: 0.5
        });
        this.parts.die = new THREE.Mesh(dieGeo, dieMat);
        this.parts.die.position.y = 0.1;
        this.cpuGroup.add(this.parts.die);

        // 4. IHS (Heat Spreader)
        const ihsGeo = new THREE.BoxGeometry(2.1, 0.2, 2.1);

        // Canvas for IHS Texture
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 472, 472);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('SILICON-CORE', 256, 240);
        ctx.font = '24px JetBrains Mono';
        ctx.fillText('REV 2.0.4', 256, 300);

        const tex = new THREE.CanvasTexture(canvas);
        const ihsMat = new THREE.MeshStandardMaterial({
            map: tex,
            metalness: 0.8,
            roughness: 0.2
        });
        this.parts.ihs = new THREE.Mesh(ihsGeo, ihsMat);
        this.parts.ihs.position.y = 0.25;
        this.cpuGroup.add(this.parts.ihs);

        // 5. Capacitors (Top of Substrate)
        this.parts.caps = new THREE.Group();
        const capGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const capPos = [[1.2, 0.1, 1.2], [-1.2, 0.1, 1.2], [1.2, 0.1, -1.2], [-1.2, 0.1, -1.2]];
        capPos.forEach(p => {
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.position.set(p[0], p[1], p[2]);
            this.parts.caps.add(cap);
        });
        this.cpuGroup.add(this.parts.caps);
    }

    setupScrollAnimations() {
        // Initial state
        gsap.set(this.cpuGroup.rotation, { x: 0.5, y: -0.5 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Rotation across the whole site
        tl.to(this.cpuGroup.rotation, { y: Math.PI * 2, x: 0.2 }, 0);

        // Deconstruction
        tl.to(this.parts.ihs.position, { y: 3, opacity: 0 }, 0.1);
        tl.to(this.parts.die.position, { y: 1.5, scale: 1.5 }, 0.2);
        tl.to(this.parts.substrate.position, { y: -1 }, 0.3);
        tl.to(this.parts.pins.position, { y: -3 }, 0.4);
        tl.to(this.parts.caps.position, { y: 2, x: (i) => i % 2 === 0 ? 3 : -3 }, 0.35);

        // Camera move closer as we go to projects
        tl.to(this.camera.position, { z: 4, y: 0 }, 0.6);

        // Re-assemble slightly at the end
        tl.to(this.parts.die.position, { y: 0.2, scale: 1 }, 0.9);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// --- CURSOR AND UI ---
function initUI() {
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.1
        });
    });

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animate Hero text
    gsap.to(".hero-section .section-tag", { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    gsap.to("#title-main", { opacity: 1, y: 0, duration: 1, delay: 0.7 });
    gsap.to(".sub-text", { opacity: 1, y: 0, duration: 1, delay: 0.9 });
}

window.addEventListener('load', () => {
    initUI();
    new CPU3D();
});
