import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export type VrMuseumSceneHandle = {
  dispose: () => void;
  focusArtwork?: (id: string) => void;
  clearFocus?: () => void;
};

type CreateArgs = {
  container: HTMLDivElement;
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

/**
 * VR Museum Scene (Room dialed in: stark white walls + light wood floor w texture)
 *
 * Notes:
 * - Floor uses procedural CanvasTexture (no extra network requests)
 * - Artwork planes use MeshBasicMaterial so they never go dark
 * - Click raycast calls onArtworkClick so your modal logic still works
 */
export function createVrMuseumScene({ container, artworks, onArtworkClick }: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  function normalizeImageUrl(url: string) {
    if (!url) return url;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  }

  // ---------------------------
  // Procedural wood textures
  // ---------------------------
  function makeWoodTexture(size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.DataTexture(new Uint8Array([216, 200, 170, 255]), 1, 1);
    fallback.colorSpace = THREE.SRGBColorSpace;
    fallback.needsUpdate = true;
    return { map: fallback, roughnessMap: null as THREE.Texture | null, normalMap: null as THREE.Texture | null };
  }

  // Helper random
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  // Base color (keep your current tone)
  ctx.fillStyle = '#d8c8aa';
  ctx.fillRect(0, 0, size, size);

  // Plank sizing in texture space
  // Planks run along Y direction (long direction), so grain runs along Y too.
  const plankWidth = Math.floor(size / 10); // 10 boards across
  const rows = Math.ceil(size / plankWidth);

  // Nominal plank length (in px). We will randomize around this.
  const nominalLen = Math.floor(size * 0.55);

  // Stagger rule: end joints should be offset by at least ~8% of plank length
  const minJointOffset = Math.floor(nominalLen * 0.18);

  // Precompute per row start offsets for staggering
  const rowStartOffset: number[] = [];
  for (let r = 0; r < rows; r++) {
    if (r === 0) {
      rowStartOffset[r] = Math.floor(rand(0, nominalLen * 0.6));
    } else {
      // Ensure next row offset differs enough from previous
      let tries = 0;
      let off = 0;
      do {
        off = Math.floor(rand(0, nominalLen * 0.9));
        tries++;
      } while (tries < 20 && Math.abs(off - rowStartOffset[r - 1]) < minJointOffset);
      rowStartOffset[r] = off;
    }
  }

  // Draw planks row by row (across X), segments along Y
  for (let r = 0; r < rows; r++) {
    const x0 = r * plankWidth;
    const w = Math.min(plankWidth + 1, size - x0);

    // Slight per plank strip tone
    const tint = 0.92 + Math.random() * 0.16;
    const baseR = Math.floor(216 * tint);
    const baseG = Math.floor(200 * tint);
    const baseB = Math.floor(170 * tint);

    // Starting position (stagger)
    let y = -rowStartOffset[r];

    while (y < size) {
      // Random length buckets, mimics real bundles
      const bucket = Math.random();
      const len =
        bucket < 0.25 ? nominalLen * 0.65 :
        bucket < 0.60 ? nominalLen * 0.85 :
        nominalLen * 1.05;

      const h = Math.floor(rand(len * 0.85, len * 1.10));
      const y0 = Math.floor(y);
      const hh = Math.min(h, size - y0);

      if (y0 + hh > 0) {
        // Plank fill
        ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;
        ctx.fillRect(x0, y0, w, hh);

        // Subtle tonal wash inside plank
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = 'black';
        ctx.fillRect(x0, y0, w, hh);
        ctx.globalAlpha = 1;

        // Grain along Y (long direction)
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#8a6f4a';
        ctx.lineWidth = 1;

        const grainCount = Math.floor(hh / 10);
        for (let g = 0; g < grainCount; g++) {
          const gx = x0 + rand(2, w - 2);
          const gy0 = y0 + rand(0, hh);
          const gy1 = y0 + clamp(gy0 + rand(20, 90), 0, hh);

          ctx.beginPath();
          // Mostly vertical lines with small waviness
          const wobble = (Math.random() - 0.5) * 6;
          ctx.moveTo(gx, gy0);
          ctx.bezierCurveTo(gx + wobble, (gy0 + gy1) * 0.5, gx - wobble, (gy0 + gy1) * 0.5, gx, gy1);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Knots (very subtle)
        if (Math.random() < 0.25) {
          const kx = x0 + rand(w * 0.2, w * 0.8);
          const ky = y0 + rand(hh * 0.2, hh * 0.8);
          const kr = rand(3, 10);
          ctx.globalAlpha = 0.10;
          ctx.fillStyle = '#6f583a';
          ctx.beginPath();
          ctx.ellipse(kx, ky, kr, kr * 0.7, rand(0, Math.PI), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // End joint seam (horizontal line across this plank width)
        // Only if inside canvas (not for first negative segment)
        if (y0 > 0) {
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = '#000000';
          ctx.fillRect(x0, y0, w, 2);
          ctx.globalAlpha = 1;
        }
      }

      y += h;
      // Force some minimum joint spacing so you do not get tiny pieces
      y += rand(2, 10);
    }

    // Vertical seam between adjacent planks
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x0, 0, 2, size);
    ctx.globalAlpha = 1;
  }

  // Very soft vignette for depth
  const grad = ctx.createRadialGradient(size * 0.55, size * 0.55, size * 0.12, size * 0.55, size * 0.55, size * 0.85);
  grad.addColorStop(0, 'rgba(255,255,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0.05)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  // Repeat tuned so planks read like real scale
  map.repeat.set(3.2, 9.2);

  map.anisotropy = 8;
  map.needsUpdate = true;

  // Roughness map (seams a bit rougher, plank bodies consistent)
  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d');
  if (!rCtx) return { map, roughnessMap: null as THREE.Texture | null, normalMap: null as THREE.Texture | null };

  rCtx.fillStyle = 'rgb(175,175,175)';
  rCtx.fillRect(0, 0, size, size);

  // Micro speckle
  rCtx.globalAlpha = 0.08;
  rCtx.fillStyle = 'black';
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const s = 1 + Math.random() * 2;
    rCtx.fillRect(x, y, s, s);
  }
  rCtx.globalAlpha = 1;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.copy(map.repeat);
  roughnessMap.anisotropy = 8;
  roughnessMap.needsUpdate = true;

  // Subtle normal map, mainly from seams
  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d');
  if (!nCtx) return { map, roughnessMap, normalMap: null as THREE.Texture | null };

  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, size, size);

  nCtx.globalAlpha = 0.10;
  // Vertical seams
  nCtx.fillStyle = 'rgb(118,138,255)';
  for (let r = 0; r < rows; r++) {
    const x0 = r * plankWidth;
    nCtx.fillRect(x0, 0, 2, size);
  }
  // Horizontal end joints sprinkled lightly
  nCtx.fillStyle = 'rgb(138,118,255)';
  for (let i = 0; i < 160; i++) {
    const y0 = Math.random() * size;
    const x0 = Math.random() * size;
    nCtx.fillRect(x0, y0, rand(40, 160), 1);
  }
  nCtx.globalAlpha = 1;

  const normalMap = new THREE.CanvasTexture(nCanvas);
  normalMap.colorSpace = THREE.NoColorSpace;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.copy(map.repeat);
  normalMap.anisotropy = 8;
  normalMap.needsUpdate = true;

  return { map, roughnessMap, normalMap };
}


  // ---------------------------
  // Renderer
  // ---------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // ---------------------------
  // Scene + Camera
  // ---------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111111');
  scene.fog = new THREE.Fog(new THREE.Color('#111111'), 14, 55);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 140);
  camera.position.set(0, 1.6, 6.6);

  // ---------------------------
  // Lighting (bright museum)
  // ---------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0xf3f3f3, 0.75);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(4.5, 10, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 18;
  key.shadow.camera.bottom = -18;
  key.shadow.normalBias = 0.03;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-6, 6, -3);
  scene.add(fill);

  // Subtle ceiling bounce, helps whiteness feel real
  const bounce = new THREE.PointLight(0xffffff, 0.20, 50);
  bounce.position.set(0, 3.8, 0);
  scene.add(bounce);

  // ---------------------------
  // Room geometry/materials
  // ---------------------------
  const room = new THREE.Group();
  scene.add(room);

  // Stark white, but slightly warm so it feels physical
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.92,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.96,
    metalness: 0.0,
  });

  const { map: woodMap, roughnessMap: woodRoughness, normalMap: woodNormal } = makeWoodTexture(1024);

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    map: woodMap,
    roughness: 0.75,
    roughnessMap: woodRoughness ?? undefined,
    normalMap: woodNormal ?? undefined,
    normalScale: new THREE.Vector2(0.22, 0.22),
    metalness: 0.0,
  });

  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  room.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  frontWall.position.set(0, roomH / 2, roomD / 2);
  frontWall.rotation.y = Math.PI;
  room.add(frontWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  room.add(rightWall);

  // Baseboards, clean white
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.80,
    metalness: 0.0,
  });

  const baseboardH = 0.09;
  const baseboardT = 0.035;

  function addBaseboardAlongWall(length: number, x: number, z: number, rotY: number) {
    const geo = new THREE.BoxGeometry(length, baseboardH, baseboardT);
    const mesh = new THREE.Mesh(geo, baseboardMat);
    mesh.position.set(x, baseboardH / 2, z);
    mesh.rotation.y = rotY;
    room.add(mesh);
  }

  addBaseboardAlongWall(roomW, 0, -roomD / 2 + baseboardT / 2, 0);
  addBaseboardAlongWall(roomW, 0, roomD / 2 - baseboardT / 2, 0);
  addBaseboardAlongWall(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboardAlongWall(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // ---------------------------
  // Artwork textures
  // ---------------------------
  const texLoader = new THREE.TextureLoader();

  function loadArtworkTexture(url: string): Promise<THREE.Texture> {
    const src = normalizeImageUrl(url);

    return new Promise((resolve, reject) => {
      texLoader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  // ---------------------------
  // Frames + artwork placement
  // ---------------------------
  const framesGroup = new THREE.Group();
  room.add(framesGroup);

  const frameOuterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111111'),
    roughness: 0.35,
    metalness: 0.10,
  });

  const frameInnerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const artworkByMesh = new WeakMap<THREE.Object3D, MuseumArtwork>();

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;

    let texture: THREE.Texture | null = null;
    try {
      texture = await loadArtworkTexture(artwork.imageUrl);
    } catch {
      texture = null;
    }

    let aspect = 4 / 5;
    if (texture?.image && (texture.image as any).width && (texture.image as any).height) {
      const w = (texture.image as any).width as number;
      const h = (texture.image as any).height as number;
      aspect = w / h;
    }

    let artW = targetMaxWidth;
    let artH = artW / aspect;
    if (artH > targetMaxHeight) {
      artH = targetMaxHeight;
      artW = artH * aspect;
    }

    const group = new THREE.Group();
    group.position.copy(position);
    group.rotation.y = rotationY;

    const frameT = 0.08;
    const depth = 0.08;

    const outer = new THREE.Mesh(new THREE.BoxGeometry(artW + frameT, artH + frameT, depth), frameOuterMat);
    outer.castShadow = true;
    group.add(outer);

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.006), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    artMesh.position.z = depth / 2 + 0.012;
    group.add(artMesh);

    artworkByMesh.set(artMesh, artwork);

    framesGroup.add(group);
  }

  // Layout: right wall first, then left wall
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const y = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({
      pos: new THREE.Vector3(roomW / 2 - 0.06, y, z),
      rotY: -Math.PI / 2,
    });
  }

  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({
      pos: new THREE.Vector3(-roomW / 2 + 0.06, y, z),
      rotY: Math.PI / 2,
    });
  }

  (async () => {
    for (let i = 0; i < artworks.length; i++) {
      if (disposed) return;

      const p =
        placements[i] ??
        ({
          pos: new THREE.Vector3(roomW / 2 - 0.06, y, 9 - i * 5.2),
          rotY: -Math.PI / 2,
        } as const);

      await addFramedArtwork({
        artwork: artworks[i],
        position: p.pos,
        rotationY: p.rotY,
        targetMaxWidth: 1.6,
        targetMaxHeight: 2.0,
      });
    }
  })();

  // ---------------------------
  // Controls: drag look + wheel move + click
  // ---------------------------
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();

  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownTime = 0;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownTime = performance.now();

    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * 0.0032;
    pitch -= dy * 0.0032;
    pitch = Math.max(minPitch, Math.min(maxPitch, pitch));
  }

  function onPointerUp(e: PointerEvent) {
    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {}
    renderer.domElement.style.cursor = 'grab';

    const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    const dt = performance.now() - pointerDownTime;
    if (moved > 6 || dt > 450) return;

    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    raycaster.setFromCamera(ndc, camera);

    const hits = raycaster.intersectObjects(framesGroup.children, true);
    if (!hits.length) return;

    for (const hit of hits) {
      const a = artworkByMesh.get(hit.object);
      if (a) {
        onArtworkClick?.(a);
        return;
      }
    }
  }

  function onWheel(e: WheelEvent) {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    basePos.addScaledVector(forward, step);

    const margin = 0.9;
    basePos.x = THREE.MathUtils.clamp(basePos.x, -roomW / 2 + margin, roomW / 2 - margin);
    basePos.z = THREE.MathUtils.clamp(basePos.z, -roomD / 2 + margin, roomD / 2 - margin);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  // ---------------------------
  // Resize
  // ---------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  // ---------------------------
  // Loop
  // ---------------------------
  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;
    clock.getDelta();

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.position.copy(basePos);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ---------------------------
  // Dispose
  // ---------------------------
  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerUp);
    renderer.domElement.removeEventListener('wheel', onWheel as any);

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();

      const mat = (mesh as any).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if ((m as any).map) (m as any).map.dispose?.();
          if ((m as any).roughnessMap) (m as any).roughnessMap.dispose?.();
          if ((m as any).normalMap) (m as any).normalMap.dispose?.();
          m.dispose?.();
        }
      }
    });

    renderer.dispose();

    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return {
    dispose,
    focusArtwork: () => {},
    clearFocus: () => {},
  };
}
