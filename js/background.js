// ═══════════════════════════════════════════
// Background Particles — Three.js
// ═══════════════════════════════════════════

(function () {
  const canvas = document.getElementById('bg3d');
  if (!canvas) return;

  const scene = new THREE.Scene();
  let w = window.innerWidth, h = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(w, h);

  const count = 400;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    const isAccent = Math.random() > 0.85;
    colors[i * 3] = isAccent ? 1 : 0.6;
    colors[i * 3 + 1] = isAccent ? 0.34 : 0.6;
    colors[i * 3 + 2] = isAccent ? 0.13 : 0.6;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / w - 0.5);
    my = (e.clientY / h - 0.5);
  });

  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.001;
    points.rotation.y = t * 0.5 + mx * 0.3;
    points.rotation.x = my * 0.2;
    renderer.render(scene, camera);
  }
  animate();
})();
