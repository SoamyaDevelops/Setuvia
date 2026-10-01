import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CyberGyroscope = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffffff, 1.8, 100);
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.9, 100);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    // Main Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Faceted Quantum Polyhedron (Octahedron / Icosahedron Core)
    const coreGeo = new THREE.OctahedronGeometry(1.05, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x121416,
      emissive: 0xffffff,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.95,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Inner wireframe shell around core
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const coreWireMesh = new THREE.Mesh(coreGeo, coreWireMat);
    coreWireMesh.scale.set(1.08, 1.08, 1.08);
    rootGroup.add(coreWireMesh);

    // 2. High-Tech Torus Knot (Luxurious woven geometric flow)
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.45, 0.22, 120, 24, 2, 3);
    const torusKnotMat = new THREE.MeshStandardMaterial({
      color: 0x16181b,
      emissive: 0xffffff,
      emissiveIntensity: 0.15,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    rootGroup.add(torusKnot);

    // Delicate wireframe layer over torus knot
    const torusWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const torusWire = new THREE.Mesh(torusKnotGeo, torusWireMat);
    torusWire.scale.set(1.02, 1.02, 1.02);
    rootGroup.add(torusWire);

    // 3. Precision Gimbal Rings (Astrolabe / Gyroscope outer rings)
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.025, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.8;
    ringGroup.add(ring2);

    // Outer icosahedron cage (subtle framing)
    const outerCageGeo = new THREE.IcosahedronGeometry(3.1, 1);
    const outerCageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const outerCage = new THREE.Mesh(outerCageGeo, outerCageMat);
    rootGroup.add(outerCage);

    // 4. Orbiting Satellite Constellation Nodes
    const nodeCount = 54;
    const nodeGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodesGroup = new THREE.Group();

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 2.45 + (i % 3) * 0.25;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodesGroup.add(node);
    }
    rootGroup.add(nodesGroup);

    // 5. Ambient Micro-Starfield
    const starCount = 900;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 0.45;
      targetY = (e.clientY / innerHeight - 0.5) * 0.45;
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

      // Mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Root rotation
      rootGroup.rotation.y = elapsed * 0.14 + mouseX;
      rootGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.12 + mouseY;

      // Core independent tumble
      coreMesh.rotation.x = elapsed * 0.35;
      coreMesh.rotation.y = elapsed * 0.45;
      coreWireMesh.rotation.x = elapsed * 0.35;
      coreWireMesh.rotation.y = elapsed * 0.45;

      // Core breathing scale
      const breath = 1 + Math.sin(elapsed * 1.8) * 0.05;
      coreMesh.scale.set(breath, breath, breath);

      // Torus knot counter-rotation
      torusKnot.rotation.z = elapsed * 0.18;
      torusKnot.rotation.y = -elapsed * 0.22;
      torusWire.rotation.z = elapsed * 0.18;
      torusWire.rotation.y = -elapsed * 0.22;

      // Gimbal rings rotation on opposite axes
      ring1.rotation.z = elapsed * 0.12;
      ring2.rotation.x = elapsed * 0.16;
      ring2.rotation.y = -elapsed * 0.1;

      // Starfield drift
      starfield.rotation.y = elapsed * 0.012;

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
