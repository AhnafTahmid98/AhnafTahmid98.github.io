// ═══════════════════════════════════════════
// Skills — 6 × 3D Scenes (Three.js)
// ═══════════════════════════════════════════

function setupScene(canvas, setupFn, animateFn) {
  if (!canvas) return;

  const scene = new THREE.Scene();
  let w = canvas.clientWidth, h = canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(50, w / h || 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(3, 4, 5);
  scene.add(dl);
  const pl = new THREE.PointLight(0xff5722, 1.8, 15);
  pl.position.set(-2, -1, 3);
  scene.add(pl);

  const group = new THREE.Group();
  scene.add(group);

  const ctx = { scene, camera, renderer, group, canvas };
  setupFn(ctx);

  let isDrag = false, px = 0, py = 0;
  let tRy = 0, tRx = 0, cRy = 0, cRx = 0;
  let auto = true, autoT = 0;

  canvas.addEventListener('pointerdown', e => {
    isDrag = true;
    px = e.clientX;
    py = e.clientY;
    auto = false;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', e => {
    if (!isDrag) return;
    tRy += (e.clientX - px) * 0.008;
    tRx += (e.clientY - py) * 0.008;
    tRx = Math.max(-0.6, Math.min(0.6, tRx));
    px = e.clientX;
    py = e.clientY;
  });

  canvas.addEventListener('pointerup', () => { isDrag = false; autoT = Date.now(); });
  canvas.addEventListener('pointerleave', () => { isDrag = false; autoT = Date.now(); });

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (w && h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  }
  window.addEventListener('resize', resize);
  setTimeout(resize, 100);

  let t = 0;
  function loop() {
    requestAnimationFrame(loop);
    t += 0.016;
    if (!isDrag && Date.now() - autoT > 2500) auto = true;
    if (auto) tRy += 0.006;
    cRy += (tRy - cRy) * 0.08;
    cRx += (tRx - cRx) * 0.08;
    group.rotation.y = cRy;
    group.rotation.x = cRx;
    if (animateFn) animateFn(t, ctx);
    renderer.render(scene, camera);
  }
  loop();
}

// ═══════════════ AI NEURAL NETWORK ═══════════════
setupScene(document.getElementById('aiCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0, 8);
  const layers = [3, 5, 5, 3];
  const nodes = [];
  const lSp = 2.2, nSp = 0.95;
  let lStart = 0;

  layers.forEach((count, li) => {
    const x = (li - (layers.length - 1) / 2) * lSp;
    for (let i = 0; i < count; i++) {
      const y = (i - (count - 1) / 2) * nSp;
      const mat = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3 });
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), mat);
      s.position.set(x, y, 0);
      s.userData = { phase: Math.random() * Math.PI * 2, mat };
      ctx.group.add(s);
      nodes.push(s);
    }
  });

  const conns = [];
  lStart = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    const cc = layers[l], nc = layers[l + 1];
    for (let i = 0; i < cc; i++) {
      for (let j = 0; j < nc; j++) {
        const f = nodes[lStart + i], t = nodes[lStart + cc + j];
        const lg = new THREE.BufferGeometry().setFromPoints([f.position.clone(), t.position.clone()]);
        const ln = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xff5722, transparent: true, opacity: 0.25 }));
        ln.userData = { from: f, to: t };
        ctx.group.add(ln);
        conns.push(ln);
      }
    }
    lStart += cc;
  }

  const pulses = [];
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffaa66 }));
    p.userData = { c: conns[Math.floor(Math.random() * conns.length)], t: Math.random() };
    ctx.group.add(p);
    pulses.push(p);
  }
  ctx.nodes = nodes;
  ctx.pulses = pulses;
  ctx.conns = conns;
}, (t, ctx) => {
  ctx.nodes.forEach(n => {
    const p = Math.sin(t * 2 + n.userData.phase) * 0.5 + 0.5;
    n.userData.mat.emissiveIntensity = 0.4 + p * 0.8;
    n.scale.setScalar(0.85 + p * 0.25);
  });
  ctx.pulses.forEach(p => {
    p.userData.t += 0.015;
    if (p.userData.t >= 1) {
      p.userData.t = 0;
      p.userData.c = ctx.conns[Math.floor(Math.random() * ctx.conns.length)];
    }
    p.position.lerpVectors(p.userData.c.userData.from.position, p.userData.c.userData.to.position, p.userData.t);
  });
});

// ═══════════════ ROBOT ═══════════════
setupScene(document.getElementById('roboCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0.5, 6.5);
  const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xff5722, metalness: 0.4, roughness: 0.2, emissive: 0xff5722, emissiveIntensity: 0.3 });
  const matEye = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 1.5 });
  const matJoint = new THREE.MeshStandardMaterial({ color: 0x333, metalness: 0.9, roughness: 0.1 });

  const robot = new THREE.Group();
  ctx.group.add(robot);

  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1), matBody);
  head.position.y = 1.5;
  robot.add(head);

  const face = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.7, 0.05), matJoint);
  face.position.set(0, 1.55, 0.52);
  robot.add(face);

  const eyeGeo = new THREE.SphereGeometry(0.11, 16, 16);
  const eyeL = new THREE.Mesh(eyeGeo, matEye);
  eyeL.position.set(-0.25, 1.65, 0.55);
  robot.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, matEye);
  eyeR.position.set(0.25, 1.65, 0.55);
  robot.add(eyeR);

  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), matJoint);
  ant.position.set(0, 2.2, 0);
  robot.add(ant);
  const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), matEye);
  antTip.position.set(0, 2.45, 0);
  robot.add(antTip);

  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.025, 0.03), matAccent);
    bar.position.set(0, 1.4 - i * 0.06, 0.55);
    robot.add(bar);
  }

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16), matJoint);
  neck.position.y = 0.9;
  robot.add(neck);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 0.95), matBody);
  torso.position.y = 0.15;
  robot.add(torso);

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.05), matJoint);
  chest.position.set(0, 0.2, 0.5);
  robot.add(chest);

  const cl = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), matEye);
  cl.position.set(0, 0.2, 0.53);
  robot.add(cl);

  function arm(side) {
    const a = new THREE.Group();
    a.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), matAccent));
    const u = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.7, 12), matBody);
    u.position.y = -0.4;
    a.add(u);
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), matJoint);
    e.position.y = -0.78;
    a.add(e);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.65, 12), matBody);
    f.position.y = -1.15;
    a.add(f);
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.18), matAccent);
    h.position.y = -1.55;
    a.add(h);
    a.position.set(side * 0.95, 0.5, 0);
    return a;
  }

  const armL = arm(-1);
  robot.add(armL);
  const armR = arm(1);
  robot.add(armR);

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.3), matBody);
  base.position.y = -0.65;
  robot.add(base);

  const ba = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 1.35), matAccent);
  ba.position.y = -0.55;
  robot.add(ba);

  const wheels = [];
  [[-0.85, 0.5], [0.85, 0.5], [-0.85, -0.5], [0.85, -0.5]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 24), new THREE.MeshStandardMaterial({ color: 0x111, metalness: 0.6, roughness: 0.4 }));
    w.rotation.z = Math.PI / 2;
    w.position.set(x, -0.85, z);
    robot.add(w);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.19, 16), matAccent);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, -0.85, z);
    robot.add(hub);
    wheels.push(w, hub);
  });

  robot.scale.setScalar(0.85);
  ctx.robot = robot;
  ctx.matEye = matEye;
  ctx.head = head;
  ctx.armL = armL;
  ctx.armR = armR;
  ctx.wheels = wheels;
}, (t, ctx) => {
  ctx.matEye.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4;
  ctx.robot.position.y = Math.sin(t * 1.5) * 0.06;
  ctx.head.rotation.y = Math.sin(t * 0.8) * 0.15;
  ctx.armL.rotation.x = Math.sin(t * 1.2) * 0.15;
  ctx.armR.rotation.x = -Math.sin(t * 1.2) * 0.15;
  ctx.wheels.forEach(w => w.rotation.x += 0.03);
});

// ═══════════════ CODE BLOCKS ═══════════════
setupScene(document.getElementById('codeCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0, 5);
  const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.4 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.3 });
  const matWire = new THREE.MeshStandardMaterial({ color: 0xff5722, wireframe: true, emissive: 0xff5722, emissiveIntensity: 0.4 });

  const blocks = [];
  [[1.8, 0.25, 1.2], [1.5, 0.25, 1], [1.3, 0.25, 0.85], [1.1, 0.25, 0.7]].forEach((s, i) => {
    const isAcc = i === 1;
    const b = new THREE.Mesh(new THREE.BoxGeometry(s[0], s[1], s[2]), isAcc ? matAccent : matBody);
    b.position.y = (i - 1.5) * 0.32;
    b.userData = { baseY: (i - 1.5) * 0.32, phase: i * 0.5 };
    ctx.group.add(b);
    blocks.push(b);

    const w = new THREE.Mesh(new THREE.BoxGeometry(s[0] + 0.02, s[1] + 0.02, s[2] + 0.02), matWire);
    w.position.copy(b.position);
    b.userData.wire = w;
    ctx.group.add(w);

    for (let j = 0; j < 3; j++) {
      const lw = Math.random() * 0.4 + 0.3;
      const cl = new THREE.Mesh(new THREE.BoxGeometry(lw, 0.015, 0.04), matAccent);
      cl.position.set(-s[0] / 2 + lw / 2 + 0.15 + (Math.random() * 0.1), s[1] / 2 + 0.01, -0.2 + j * 0.15);
      b.add(cl);
    }
  });
  ctx.blocks = blocks;
  ctx.group.scale.setScalar(0.9);
}, (t, ctx) => {
  ctx.blocks.forEach(b => {
    b.position.y = b.userData.baseY + Math.sin(t + b.userData.phase) * 0.08;
    if (b.userData.wire) {
      b.userData.wire.position.y = b.position.y;
      b.userData.wire.rotation.y = b.rotation.y;
    }
    b.rotation.y = Math.sin(t * 0.5 + b.userData.phase) * 0.1;
  });
});

// ═══════════════ PHONE ═══════════════
setupScene(document.getElementById('phoneCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0, 5);
  const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 });
  const matScreen = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.1, emissive: 0xff5722, emissiveIntensity: 0.15 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 0.7, metalness: 0.4, roughness: 0.3 });
  const matCard = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.5, roughness: 0.4 });

  const pg = new THREE.Group();
  pg.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 0.12), matBody));
  pg.add(new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.4, 0.13), matScreen));

  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.14), matBody);
  notch.position.set(0, 1.1, 0.01);
  pg.add(notch);

  const sb = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.04, 0.14), matAccent);
  sb.position.set(0, 0.95, 0.01);
  pg.add(sb);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const ic = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.14), Math.random() > 0.7 ? matAccent : matCard);
      ic.position.set(-0.4 + c * 0.4, 0.5 - r * 0.4, 0.01);
      pg.add(ic);
    }
  }

  const bb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.14), matAccent);
  bb.position.set(0, -1.1, 0.01);
  pg.add(bb);

  ctx.group.add(pg);
  ctx.phone = pg;

  const cards = [];
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.05), matCard);
    c.position.set(1.2, 0.6 - i * 0.5, -0.5 - i * 0.2);
    c.userData = { baseY: 0.6 - i * 0.5, baseX: 1.2, phase: i };
    ctx.group.add(c);
    cards.push(c);
  }
  ctx.cards = cards;
  ctx.group.scale.setScalar(0.75);
  ctx.group.rotation.y = -0.3;
}, (t, ctx) => {
  ctx.phone.position.y = Math.sin(t * 1.2) * 0.08;
  ctx.cards.forEach(c => {
    c.position.y = c.userData.baseY + Math.sin(t * 1.5 + c.userData.phase) * 0.05;
    c.position.x = c.userData.baseX + Math.sin(t + c.userData.phase) * 0.05;
  });
});

// ═══════════════ GEARS ═══════════════
setupScene(document.getElementById('gearCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0, 5);
  const matG = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 });
  const matA = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 0.4, metalness: 0.5, roughness: 0.3 });

  function build(r, teeth, th, m) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, th, 32), m);
    b.rotation.x = Math.PI / 2;
    g.add(b);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.3, th * 1.2, 16), matA);
    h.rotation.x = Math.PI / 2;
    g.add(h);
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, th), m);
      t.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      t.rotation.z = a;
      g.add(t);
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const sp = new THREE.Mesh(new THREE.BoxGeometry(r * 1.2, 0.08, th * 0.5), m);
      sp.rotation.z = a;
      g.add(sp);
    }
    return g;
  }

  ctx.g1 = build(0.85, 12, 0.18, matG);
  ctx.g1.position.set(-0.7, 0, 0);
  ctx.group.add(ctx.g1);

  ctx.g2 = build(0.6, 10, 0.18, matA);
  ctx.g2.position.set(0.65, 0.3, 0);
  ctx.group.add(ctx.g2);

  ctx.g3 = build(0.45, 8, 0.18, matG);
  ctx.g3.position.set(1.4, -0.4, 0);
  ctx.group.add(ctx.g3);

  ctx.group.scale.setScalar(0.8);
  ctx.group.rotation.x = 0.15;
}, (t, ctx) => {
  ctx.g1.rotation.z = t * 0.5;
  ctx.g2.rotation.z = -t * 0.7;
  ctx.g3.rotation.z = t * 0.95;
});

// ═══════════════ ENGINEERING ARCHITECTURE ═══════════════
setupScene(document.getElementById('engCanvas'), (ctx) => {
  ctx.camera.position.set(0, 0.3, 5.5);
  const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.4 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xff5722, emissive: 0xff5722, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3 });
  const matWire = new THREE.LineBasicMaterial({ color: 0xff5722, transparent: true, opacity: 0.4 });

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), matAccent);
  ctx.group.add(core);
  ctx.core = core;

  const shell = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), new THREE.MeshStandardMaterial({ color: 0xff5722, wireframe: true, emissive: 0xff5722, emissiveIntensity: 0.3 }));
  ctx.group.add(shell);
  ctx.shell = shell;

  const modules = [];
  const mods = [
    { pos: [-1.8, 0.6, 0], size: [0.6, 0.4, 0.4] },
    { pos: [1.8, 0.6, 0], size: [0.6, 0.4, 0.4] },
    { pos: [-1.8, -0.6, 0], size: [0.6, 0.4, 0.4] },
    { pos: [1.8, -0.6, 0], size: [0.6, 0.4, 0.4] },
    { pos: [0, 1.3, -0.5], size: [0.5, 0.35, 0.35] },
    { pos: [0, -1.3, -0.5], size: [0.5, 0.35, 0.35] },
  ];

  mods.forEach((m, i) => {
    const isAcc = i === 0 || i === 3;
    const box = new THREE.Mesh(new THREE.BoxGeometry(...m.size), isAcc ? matAccent : matBody);
    box.position.set(...m.pos);
    box.userData = { basePos: [...m.pos], phase: i * 0.7 };
    ctx.group.add(box);
    modules.push(box);

    const wireBox = new THREE.Mesh(
      new THREE.BoxGeometry(m.size[0] + 0.04, m.size[1] + 0.04, m.size[2] + 0.04),
      new THREE.MeshStandardMaterial({ color: 0xff5722, wireframe: true, emissive: 0xff5722, emissiveIntensity: 0.2, transparent: true, opacity: 0.5 })
    );
    wireBox.position.set(...m.pos);
    wireBox.userData = { target: box };
    ctx.group.add(wireBox);
    box.userData.wire = wireBox;

    const points = [new THREE.Vector3(...m.pos), new THREE.Vector3(0, 0, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, matWire.clone());
    line.userData = { module: box };
    ctx.group.add(line);
  });
  ctx.modules = modules;

  const pulses = [];
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffaa66 }));
    p.userData = { module: modules[i % modules.length], t: Math.random(), direction: Math.random() > 0.5 ? 1 : -1 };
    ctx.group.add(p);
    pulses.push(p);
  }
  ctx.pulses = pulses;

  const particles = [];
  for (let i = 0; i < 20; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff5722, transparent: true, opacity: 0.5 }));
    const r = 2.5 + Math.random() * 0.8;
    const ang = Math.random() * Math.PI * 2;
    const yOff = (Math.random() - 0.5) * 1.5;
    p.position.set(Math.cos(ang) * r, yOff, Math.sin(ang) * r);
    p.userData = { baseAng: ang, radius: r, baseY: yOff, speed: 0.3 + Math.random() * 0.4 };
    ctx.group.add(p);
    particles.push(p);
  }
  ctx.particles = particles;
  ctx.group.scale.setScalar(0.85);
}, (t, ctx) => {
  const pulse = 1 + Math.sin(t * 2.5) * 0.15;
  ctx.core.scale.setScalar(pulse);
  ctx.core.rotation.y = t * 0.5;
  ctx.core.rotation.x = t * 0.3;

  ctx.shell.rotation.y = -t * 0.7;
  ctx.shell.rotation.z = t * 0.4;

  ctx.modules.forEach(m => {
    m.position.y = m.userData.basePos[1] + Math.sin(t * 1.5 + m.userData.phase) * 0.08;
    if (m.userData.wire) m.userData.wire.position.copy(m.position);
    m.rotation.y = Math.sin(t * 0.5 + m.userData.phase) * 0.1;
    if (m.userData.wire) m.userData.wire.rotation.y = m.rotation.y;
  });

  ctx.group.children.forEach(child => {
    if (child instanceof THREE.Line && child.userData.module) {
      const positions = child.geometry.attributes.position.array;
      positions[0] = child.userData.module.position.x;
      positions[1] = child.userData.module.position.y;
      positions[2] = child.userData.module.position.z;
      child.geometry.attributes.position.needsUpdate = true;
    }
  });

  ctx.pulses.forEach(p => {
    p.userData.t += 0.02;
    if (p.userData.t >= 1) {
      p.userData.t = 0;
      p.userData.module = ctx.modules[Math.floor(Math.random() * ctx.modules.length)];
      p.userData.direction = Math.random() > 0.5 ? 1 : -1;
    }
    if (p.userData.direction > 0) {
      p.position.lerpVectors(p.userData.module.position, ctx.core.position, p.userData.t);
    } else {
      p.position.lerpVectors(ctx.core.position, p.userData.module.position, p.userData.t);
    }
  });

  ctx.particles.forEach(p => {
    const a = p.userData.baseAng + t * p.userData.speed * 0.3;
    p.position.set(Math.cos(a) * p.userData.radius, p.userData.baseY + Math.sin(t + p.userData.baseAng) * 0.1, Math.sin(a) * p.userData.radius);
  });
});
