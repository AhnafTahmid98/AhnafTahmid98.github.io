// ═══════════════════════════════════════════
// Hero 3D Robot — Three.js
// ═══════════════════════════════════════════

(function () {
  const canvas = document.getElementById('robot3d');
  if (!canvas) return;

  const scene = new THREE.Scene();
  let w = canvas.clientWidth, h = canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.PointLight(0xff5722, 2, 15);
  fill.position.set(-3, -2, 3);
  scene.add(fill);
  const rim = new THREE.PointLight(0xff8a65, 1.5, 10);
  rim.position.set(2, 3, -3);
  scene.add(rim);

  // Robot
  const robot = new THREE.Group();
  scene.add(robot);

  const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xff5722, metalness: 0.4, roughness: 0.2, emissive: 0xff5722, emissiveIntensity: 0.3 });
  const matEye = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 1.5 });
  const matLight = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 1.8), matBody);
  head.position.y = 0.5;
  robot.add(head);

  const facePlate = new THREE.Mesh(new THREE.BoxGeometry(2, 1.4, 0.05), matLight);
  facePlate.position.set(0, 0.5, 0.93);
  robot.add(facePlate);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.18, 32, 32);
  const eyeL = new THREE.Mesh(eyeGeo, matEye);
  eyeL.position.set(-0.45, 0.65, 0.97);
  robot.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, matEye);
  eyeR.position.set(0.45, 0.65, 0.97);
  robot.add(eyeR);

  // Eye rings
  const ringGeo = new THREE.TorusGeometry(0.22, 0.02, 16, 32);
  const ringL = new THREE.Mesh(ringGeo, matAccent);
  ringL.position.set(-0.45, 0.65, 0.96);
  robot.add(ringL);
  const ringR = new THREE.Mesh(ringGeo, matAccent);
  ringR.position.set(0.45, 0.65, 0.96);
  robot.add(ringR);

  // Mouth
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.04), matAccent);
    bar.position.set(0, 0.05 - i * 0.08, 0.95);
    robot.add(bar);
  }

  // Antenna
  const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8), matBody);
  antBase.position.set(0, 1.55, 0);
  robot.add(antBase);
  const antRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), matLight);
  antRod.position.set(0, 1.95, 0);
  robot.add(antRod);
  const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), matEye);
  antTip.position.set(0, 2.25, 0);
  robot.add(antTip);

  // Ears / sensors
  const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 32);
  const earL = new THREE.Mesh(earGeo, matBody);
  earL.rotation.z = Math.PI / 2;
  earL.position.set(-1.18, 0.5, 0);
  robot.add(earL);
  const earR = new THREE.Mesh(earGeo, matBody);
  earR.rotation.z = Math.PI / 2;
  earR.position.set(1.18, 0.5, 0);
  robot.add(earR);

  const earCoreL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 32), matAccent);
  earCoreL.rotation.z = Math.PI / 2;
  earCoreL.position.set(-1.2, 0.5, 0);
  robot.add(earCoreL);
  const earCoreR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 32), matAccent);
  earCoreR.rotation.z = Math.PI / 2;
  earCoreR.position.set(1.2, 0.5, 0);
  robot.add(earCoreR);

  // Neck + base
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.4, 16), matBody);
  neck.position.y = -0.6;
  robot.add(neck);

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 1.8), matBody);
  base.position.y = -0.95;
  robot.add(base);

  const strip = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.05, 1.85), matAccent);
  strip.position.y = -0.85;
  robot.add(strip);

  const detail = new THREE.MeshStandardMaterial({ color: 0x444, metalness: 0.8, roughness: 0.2 });
  [[-1.1, 0.7], [1.1, 0.7], [-1.1, -0.7], [1.1, -0.7]].forEach(([x, z]) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.15), detail);
    c.position.set(x, -0.95, z);
    robot.add(c);
  });

  robot.scale.set(0.85, 0.85, 0.85);
  robot.position.y = -0.2;

  // Interaction
  let isDragging = false, prevX = 0, prevY = 0;
  let targetRotY = 0, targetRotX = 0, currentRotY = 0, currentRotX = 0;
  let autoRotate = true, autoRotateTimer = 0;

  canvas.addEventListener('pointerdown', e => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    autoRotate = false;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', e => {
    if (!isDragging) return;
    targetRotY += (e.clientX - prevX) * 0.008;
    targetRotX += (e.clientY - prevY) * 0.008;
    targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
    prevX = e.clientX;
    prevY = e.clientY;
  });

  canvas.addEventListener('pointerup', () => {
    isDragging = false;
    autoRotateTimer = Date.now();
  });

  canvas.addEventListener('pointerleave', () => {
    isDragging = false;
    autoRotateTimer = Date.now();
  });

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    if (isDragging) return;
    mx = (e.clientX / window.innerWidth - 0.5) * 0.3;
    my = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  window.addEventListener('resize', () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    if (!isDragging && Date.now() - autoRotateTimer > 3000) autoRotate = true;
    if (autoRotate) targetRotY += 0.005;

    currentRotY += (targetRotY - currentRotY) * 0.08;
    currentRotX += (targetRotX - currentRotX) * 0.08;

    robot.rotation.y = currentRotY + mx;
    robot.rotation.x = currentRotX + my;
    robot.position.y = -0.2 + Math.sin(t * 1.5) * 0.08;

    matEye.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4;
    fill.intensity = 1.5 + Math.sin(t * 2) * 0.5;

    renderer.render(scene, camera);
  }
  animate();
})();
