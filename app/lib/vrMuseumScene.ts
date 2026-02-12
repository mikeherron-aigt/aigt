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
      // Fallback solid texture
      const fallback = new THREE.DataTexture(new Uint8Array([210, 197, 170, 255]), 1, 1);
      fallback.colorSpace = THREE.SRGBColorSpace;
      fallback.needsUpdate = true;
      return { map: fallback, roughnessMap: null as THREE.Texture | null, normalMap: null as THREE.Texture | null };
    }

    // Base tone
    ctx.fillStyle = '#d8c8aa';
    ctx.fillRect(0, 0, size, size);

    // Planks
    const plankCount = 10;
    const plankW = size / plankCount;

    // Slight per-plank variation + grain
    for (let i = 0; i < plankCount; i++) {
      const x0 = Math.floor(i * plankW);
      const w = Math.ceil(plankW + 1);

      const tint = 0.92 + Math.random() * 0.16; // subtle
      ctx.fillStyle = `rgba(${Math.floor(216 * tint)}, ${Math.floor(200 * tint)}, ${Math.floor(
        170 * tint
      )}, 1)`;
      ctx.fillRect(x0, 0, w, size);

      // grain lines (horizontal-ish flow)
      ctx.globalAlpha = 0.10;
      ctx.strokeStyle = '#8a6f4a';
      ctx.lineWidth = 1;

      for (let g = 0; g < 140; g++) {
        const y = Math.random() * size;
        ctx.beginPath();
        const wobble = (Math.random() - 0.5) * 16;
        ctx.moveTo(x0 + 2, y);
        ctx.bezierCurveTo(
          x0 + w * 0.35,
          y + wobble,
          x0 + w * 0.65,
          y - wobble,
          x0 + w - 2,
          y
        );
        ctx.stroke();
      }

      // seams
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#000000';
      ctx.fillRect(x0, 0, 2, size);
      ctx.globalAlpha = 1;
    }

    // Add a very soft vignette / variation to avoid flatness
    const grad = ctx.createRadialGradient(size * 0.5, size * 0.5, size * 0.1, size * 0.5, size * 0.5, size * 0.75);
    grad.addColorStop(0, 'rgba(255,255,255,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(4, 10);
    map.anisotropy = 8;
    map.needsUpdate = true;

    // Roughness map (separate canvas)
    const rCanvas = document.createElement('canvas');
    rCanvas.width = size;
    rCanvas.height = size;
    const rCtx = rCanvas.getContext('2d');
    if (!rCtx) return { map, roughnessMap: null as THREE.Texture | null, normalMap: null as THREE.Texture | null };

    // Start moderately rough
    rCtx.fillStyle = 'rgb(170,170,170)';
    rCtx.fillRect(0, 0, size, size);

    // Plank seams slightly rougher
    rCtx.fillStyle = 'rgb(210,210,210)';
    for (let i = 0; i < plankCount; i++) {
      const x0 = Math.floor(i * plankW);
      rCtx.fillRect(x0, 0, 2, size);
    }

    // Random micro variation
    rCtx.globalAlpha = 0.08;
    rCtx.fillStyle = 'black';
    for (let i = 0; i < 2000; i++) {
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

    // Very subtle normal map
    const nCanvas = document.createElement('canvas');
    nCanvas.width = size;
    nCanvas.height = size;
    const nCtx = nCanvas.getContext('2d');
    if (!nCtx) return { map, roughnessMap, normalMap: null as THREE.Texture | null };

    // Flat normal base (128,128,255)
    nCtx.fillStyle = 'rgb(128,128,255)';
    nCtx.fillRect(0, 0, size, size);

    // Fake seam normals by drawing thin vertical lines offset in red/green
    nCtx.globalAlpha = 0.12;
    for (let i = 0; i < plankCount; i++) {
      const x0 = Math.floor(i * plankW);
      nCtx.fillStyle = 'rgb(118,138,255)'; // tiny tilt
      nCtx.fillRect(x0, 0, 2, size);
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
    normalScale: new THREE.Vector2(0.25, 0.25),
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
