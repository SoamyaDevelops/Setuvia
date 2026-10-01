import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PulseSphere = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.7, 100);
    pointLight2.position.set(-5, -3, -5);
    scene.add(pointLight2);

    // Central Sphere Group
    const group = new THREE.Group();
    scene.add(group);

    // Core glowing sphere
    const coreGeo = new THREE.SphereGeometry(1.1, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121416,
      emissive: 0xffffff,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.85,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreSphere);

    // Inner wireframe sphere
    const wireGeo = new THREE.SphereGeometry(1.18, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const innerWireSphere = new THREE.Mesh(wireGeo, wireMat);
    group.add(innerWireSphere);

    // Outer rotating icosahedron wireframe
    const icoGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const outerIco = new THREE.Mesh(icoGeo, icoMat);
    group.add(outerIco);

    // 80 Floating Fibonacci nodes
    const N = 80;
    const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodesGroup = new THREE.Group();

    for (let i = 0; i < N; i++) {
      const phi = Math.acos(-1 + (2 * i) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;
      const r = 2.6;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      nodesGroup.add(node);
    }
    group.add(nodesGroup);

    // Starfield particles (1500 stars)
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 60;
      starPositions[i + 1] = (Math.random() - 0.5) * 60;
      starPositions[i + 2] = (Math.random() - 0.5) * 60;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 0.5;
      targetY = (e.clientY / innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation
      group.rotation.y = elapsed * 0.12 + mouseX;
      group.rotation.x = Math.sin(elapsed * 0.2) * 0.15 + mouseY;

      // Core floating oscillation
      coreSphere.position.y = Math.sin(elapsed * 1.4) * 0.08;
      innerWireSphere.position.y = Math.sin(elapsed * 1.4) * 0.08;

      // Outer icosahedron counter-rotation
      outerIco.rotation.z = elapsed * 0.05;
      outerIco.rotation.y = -elapsed * 0.08;

      // Subtle starfield rotation
      stars.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};
