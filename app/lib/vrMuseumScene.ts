import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export type VrMuseumSceneHandle = {
  dispose: () => void;
  focusArtwork: (artworkId: string) => void;
  clearFocus: () => void;
};

type CreateArgs = {
  container: HTMLDivElement;
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

/**
 * VR Museum Scene (Jeff baseline, upgraded)
 * Goals
 * - Keep the bright, clean "tan floor + windows" look
 * - Add more realistic materials and subtle detail (without heavy assets)
 * - Better lighting and believable shadows (without floor blotches)
 * - Smooth, slower zoom to clicked artwork (aspect-aware)
 * - Artwork stays color-true (MeshBasicMaterial)
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
  // Renderer
  // ---------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Cross-version and typing-safe
  (renderer as any).physicallyCorrectLights = true;
  if ('useLegacyLights' in renderer) (renderer as any).useLegacyLights = false;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  container.appendChild(renderer.domElement);

  // ---------------------------
  // Scene + Camera
  // ---------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0b0b);
  scene.fog = new THREE.Fog(0x0b0b0b, 8, 42);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 140);
  camera.position.set(0, 1.55, 6.6);

  // ---------------------------
  // Subtle procedural textures (cheap realism)
  // ---------------------------
  function makeNoiseTexture(size = 256, strength = 18) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() * strength - strength / 2);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    tex.needsUpdate = true;
    return tex;
  }

  function makeFloorTexture(size = 512) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    // Warm tan base
    ctx.fillStyle = '#cbb58a';
    ctx.fillRect(0, 0, size, size);

    // Very soft mottling
    for (let i = 0; i < 4200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 6 + Math.random() * 22;
      const a = 0.012 + Math.random() * 0.02;
      ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle directional grain
    ctx.globalAlpha = 0.10;
    for (let y = 0; y < size; y += 4) {
      const wobble = Math.sin(y * 0.05) * 1.3;
      ctx.fillStyle = y % 12 === 0 ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.06)';
      ctx.fillRect(0 + wobble, y, size, 2);
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.6, 5.4);
    tex.needsUpdate = true;
    return tex;
  }

  const wallNoise = makeNoiseTexture(256, 14);
  const floorTex = makeFloorTexture(512);

  // ---------------------------
  // Room geometry/materials
  // ---------------------------
  const room = new THREE.Group();
  scene.add(room);

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f2f2f2'),
    roughness: 0.92,
    metalness: 0.0,
    map: wallNoise ?? undefined,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0f0f0'),
    roughness: 0.97,
    metalness: 0.0,
    map: wallNoise ?? undefined,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cbb58a'),
    roughness: 0.78,
    metalness: 0.0,
    map: floorTex ?? undefined,
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

  // Baseboards (small detail)
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e8e8e8'),
    roughness: 0.75,
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

  // Crown molding (ceiling detail)
  const crownMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ededed'),
    roughness: 0.85,
    metalness: 0.0,
  });

  const crownH = 0.065;
  const crownT = 0.05;

  function addCrown(length: number, x: number, z: number, rotY: number) {
    const geo = new THREE.BoxGeometry(length, crownH, crownT);
    const mesh = new THREE.Mesh(geo, crownMat);
    mesh.position.set(x, roomH - crownH / 2, z);
    mesh.rotation.y = rotY;
    room.add(mesh);
  }

  addCrown(roomW, 0, -roomD / 2 + crownT / 2, 0);
  addCrown(roomW, 0, roomD / 2 - crownT / 2, 0);
  addCrown(roomD, -roomW / 2 + crownT / 2, 0, Math.PI / 2);
  addCrown(roomD, roomW / 2 - crownT / 2, 0, Math.PI / 2);

  // ---------------------------
  // Windows (visual + light contribution)
  // ---------------------------
  const windowGroup = new THREE.Group();
  room.add(windowGroup);

  const windowFrameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dedede'),
    roughness: 0.6,
    metalness: 0.0,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9fd3ff'),
    roughness: 0.05,
    metalness: 0.0,
    transparent: true,
    opacity: 0.65,
    emissive: new THREE.Color('#7bc7ff'),
    emissiveIntensity: 0.18,
  });

  function addWindow(x: number, y: number, z: number) {
    const w = 1.55;
    const h = 1.55;

    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.06), windowFrameMat);
    frame.position.set(x, y, z);
    frame.rotation.y = Math.PI;
    windowGroup.add(frame);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat);
    glass.position.set(x, y, z + 0.034);
    glass.rotation.y = Math.PI;
    windowGroup.add(glass);

    // Mullions
    const mullionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e6e6e6'),
      roughness: 0.7,
      metalness: 0.0,
    });

    const v1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, h, 0.03), mullionMat);
    v1.position.set(x, y, z + 0.036);
    v1.rotation.y = Math.PI;
    windowGroup.add(v1);

    const h1 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.03), mullionMat);
    h1.position.set(x, y, z + 0.036);
    h1.rotation.y = Math.PI;
    windowGroup.add(h1);

    // Cool daylight spill (no shadows, just fill)
    const day = new THREE.PointLight(0xbfe6ff, 0.55, 16);
    day.position.set(x, y, z - 1.4);
    scene.add(day);
  }

  // Place windows on the far wall (front wall), matching your screenshot vibe
  const wz = roomD / 2 - 0.02;
  addWindow(-3.2, 2.05, wz);
  addWindow(0.0, 2.05, wz);
  addWindow(3.2, 2.05, wz);

  // ---------------------------
  // Lighting (keep brightness, improve believability)
  // ---------------------------
  const ambient = new THREE.AmbientLight(0xffffff, 0.58);
  scene.add(ambient);

  // Key directional with tuned shadows
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(4.5, 9.2, 6.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 18;
  key.shadow.camera.bottom = -18;
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.02;

  const keyTarget = new THREE.Object3D();
  keyTarget.position.set(0, 1.6, 0);
  scene.add(keyTarget);
  key.target = keyTarget;

  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.28);
  fill.position.set(-6.5, 6.2, -2.0);
  scene.add(fill);

  // Gentle ceiling bounce
  const hemi = new THREE.HemisphereLight(0xffffff, 0x2b2b2b, 0.28);
  scene.add(hemi);

  // Subtle rim depth (helps corners feel less flat)
  const rim = new THREE.PointLight(0xffffff, 0.18, 48);
  rim.position.set(0, 2.8, 10);
  scene.add(rim);

  // ---------------------------
  // Ceiling spots (no big bar, just small fixtures)
  // ---------------------------
  const fixtureGroup = new THREE.Group();
  room.add(fixtureGroup);

  const fixtureBodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111111'),
    roughness: 0.4,
    metalness: 0.25,
  });

  const fixtureGlowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 1,
    metalness: 0,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 0.45,
  });

  function addCeilingSpot(x: number, z: number) {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 18), fixtureBodyMat);
    body.position.set(x, roomH - 0.08, z);
    body.rotation.x = Math.PI / 2;
    fixtureGroup.add(body);

    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.02, 16), fixtureGlowMat);
    glow.position.set(x, roomH - 0.13, z);
    glow.rotation.x = Math.PI / 2;
    fixtureGroup.add(glow);

    const light = new THREE.SpotLight(0xffffff, 0.45, 18, Math.PI / 7.5, 0.55, 1.1);
    light.position.set(x, roomH - 0.1, z);
    light.target.position.set(x, 0, z);
    light.castShadow = false; // avoids floor blob artifacts
    scene.add(light);
    scene.add(light.target);
  }

  // A few fixtures along center line
  addCeilingSpot(0, 6);
  addCeilingSpot(0, 1);
  addCeilingSpot(0, -4);
  addCeilingSpot(0, -9);

  // ---------------------------
  // Texture loading (robust)
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
    color: new THREE.Color('#141414'),
    roughness: 0.35,
    metalness: 0.15,
  });

  const frameInnerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f6f6f6'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const artMeshById = new Map<string, THREE.Mesh>();
  const artworkById = new Map<string, MuseumArtwork>();

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;
    artworkById.set(artwork.id, artwork);

    let texture: THREE.Texture | null = null;
    try {
      texture = await loadArtworkTexture(artwork.imageUrl);
    } catch {
      texture = null;
    }

    // Aspect
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

    // Outer frame
    const outer = new THREE.Mesh(new THREE.BoxGeometry(artW + frameT, artH + frameT, depth), frameOuterMat);
    outer.castShadow = true;
    group.add(outer);

    // Matte
    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    // Artwork plane (color-true)
    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    art.position.z = depth / 2 + 0.011;
    art.userData = { artworkId: artwork.id, width: artW, height: artH };
    group.add(art);
    artMeshById.set(artwork.id, art);

    // Gentle wash on the frame/matte (no shadows to avoid artifacts)
    const spot = new THREE.SpotLight(0xffffff, 0.55, 8.5, Math.PI / 7.2, 0.6, 1.1);
    spot.position.set(0, 3.7, 1.25);
    spot.target = art;
    spot.castShadow = false;
    group.add(spot);
    group.add(spot.target);

    framesGroup.add(group);
  }

  // Layout (right wall then left wall)
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const y = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({ pos: new THREE.Vector3(roomW / 2 - 0.06, y, z), rotY: -Math.PI / 2 });
  }
  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({ pos: new THREE.Vector3(-roomW / 2 + 0.06, y, z), rotY: Math.PI / 2 });
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
  // Controls + camera state (drag look + scroll move + click focus)
  // ---------------------------
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();
  const camTargetPos = basePos.clone();

  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownTime = 0;

  let isFocused = false;

  const returnPose = {
    pos: basePos.clone(),
    yaw: 0,
    pitch: 0,
  };

  const focusAnim = {
    active: false,
    t: 0,
    duration: 0.95, // slower zoom
    yawFrom: 0,
    yawTo: 0,
    pitchFrom: 0,
    pitchTo: 0,
    posFrom: basePos.clone(),
    posTo: basePos.clone(),
  };

  function easeInOut(t: number) {
    return t * t * (3 - 2 * t);
  }

  function computeFitDistance(planeW: number, planeH: number) {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = camera.aspect;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    const distV = (planeH * 0.5) / Math.tan(vFov / 2);
    const distH = (planeW * 0.5) / Math.tan(hFov / 2);

    // A touch of breathing room
    return Math.max(distV, distH) * 1.10;
  }

  function focusArtwork(artworkId: string) {
    const art = artMeshById.get(artworkId);
    if (!art) return;

    // Store return pose (only on first focus)
    returnPose.pos.copy(basePos);
    returnPose.yaw = yaw;
    returnPose.pitch = pitch;

    const center = new THREE.Vector3();
    art.getWorldPosition(center);

    // Normal of the artwork plane in world space
    const normal = new THREE.Vector3(0, 0, 1);
    normal.applyQuaternion(art.getWorldQuaternion(new THREE.Quaternion()));
    normal.normalize();

    // Force normal to face the camera so we do not zoom through the wall
    const cameraSide = new THREE.Vector3().subVectors(camera.position, center).normalize();
    if (normal.dot(cameraSide) < 0) normal.multiplyScalar(-1);

    const planeW = Number(art.userData?.width ?? 1.2);
    const planeH = Number(art.userData?.height ?? 1.5);

    const dist = computeFitDistance(planeW, planeH);
    const targetPos = new THREE.Vector3().copy(center).addScaledVector(normal, dist);

    const dir = new THREE.Vector3().subVectors(center, targetPos).normalize();
    const targetYaw = Math.atan2(dir.x, dir.z);
    const targetPitch = THREE.MathUtils.clamp(Math.asin(dir.y), minPitch, maxPitch);

    focusAnim.active = true;
    focusAnim.t = 0;
    focusAnim.yawFrom = yaw;
    focusAnim.yawTo = targetYaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.pitchTo = targetPitch;
    focusAnim.posFrom.copy(basePos);
    focusAnim.posTo.copy(targetPos);

    isFocused = true;
  }

  function clearFocus() {
    if (!isFocused) return;

    focusAnim.active = true;
    focusAnim.t = 0;
    focusAnim.yawFrom = yaw;
    focusAnim.yawTo = returnPose.yaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.pitchTo = returnPose.pitch;
    focusAnim.posFrom.copy(basePos);
    focusAnim.posTo.copy(returnPose.pos);

    isFocused = false;
  }

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
    if (isFocused) return;

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

    if (isFocused) return;

    const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    const dt = performance.now() - pointerDownTime;

    // Click, not drag
    if (moved > 6 || dt > 450) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);

    const hits = raycaster.intersectObjects(Array.from(artMeshById.values()), true);
    if (!hits.length) return;

    const hit = hits[0].object as THREE.Mesh;
    const artworkId = hit.userData?.artworkId as string | undefined;
    if (!artworkId) return;

    // Start the zoom immediately
    focusArtwork(artworkId);

    // Let the client overlay open (you already delay it in VrMuseumClient)
    const artwork = artworkById.get(artworkId);
    if (artwork) onArtworkClick?.(artwork);
  }

  function onWheel(e: WheelEvent) {
    if (isFocused) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    camTargetPos.copy(basePos).addScaledVector(forward, step);

    const margin = 0.9;
    camTargetPos.x = THREE.MathUtils.clamp(camTargetPos.x, -roomW / 2 + margin, roomW / 2 - margin);
    camTargetPos.z = THREE.MathUtils.clamp(camTargetPos.z, -roomD / 2 + margin, roomD / 2 - margin);
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

    const dt = clock.getDelta();

    if (focusAnim.active) {
      focusAnim.t = Math.min(1, focusAnim.t + dt / focusAnim.duration);
      const k = easeInOut(focusAnim.t);

      yaw = THREE.MathUtils.lerp(focusAnim.yawFrom, focusAnim.yawTo, k);
      pitch = THREE.MathUtils.lerp(focusAnim.pitchFrom, focusAnim.pitchTo, k);
      basePos.lerpVectors(focusAnim.posFrom, focusAnim.posTo, k);

      if (focusAnim.t >= 1) focusAnim.active = false;
    } else {
      basePos.lerp(camTargetPos, 0.14);
    }

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

    // Dispose textures we created
    wallNoise?.dispose?.();
    floorTex?.dispose?.();

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();

      const mat = (mesh as any).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if ((m as any).map) (m as any).map.dispose?.();
          m.dispose?.();
        }
      }
    });

    renderer.dispose();

    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { dispose, focusArtwork, clearFocus };
}
