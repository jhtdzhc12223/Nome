// Efeito de Buraco Negro com Three.js
class BlackHoleEffect {
    constructor() {
        this.initBlackHole();
    }
    
    initBlackHole() {
        const container = document.getElementById('blackhole-bg');
        if (!container) return;
        
        // Configuração da cena Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        
        // Criar buraco negro
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.9
        });
        const blackHole = new THREE.Mesh(geometry, material);
        scene.add(blackHole);
        
        // Animação
        const animate = () => {
            requestAnimationFrame(animate);
            blackHole.rotation.x += 0.005;
            blackHole.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Redimensionamento responsivo
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Ativar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new BlackHoleEffect();
});
