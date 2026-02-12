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
 * VR Museum Scene
 * Adds:
 * - Click raycast on artwork planes
 * - Camera focus animation that fits artwork to viewport (aspect aware)
 * - Clear focus to return to previous camera pose
 * - Higher realism defaults that still keep load manageable
 */
export function createVrMuseumScene({ container, artworks, onArtworkClick }: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  function normalizeImageUrl(url: string) {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
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
  renderer.toneMappingExposure = 1.02;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // A little realism without going crazy
  // Works across Three versions and avoids TS typing mismatch
(renderer as any).physicallyCorrectLights = true;

// Newer Three builds sometimes use this flag instead
if ('useLegacyLights' in renderer) {
  (renderer as any).useLegacyLights = false;
}


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
  scene.fog = new THREE.Fog(0x0b0b0b, 8, 38);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
  camera.position.set(0, 1.55, 6.6);

  // ---------------------------
  // Lighting
  // ---------------------------
  // Keep it museum-neutral. The artwork plane is MeshBasicMaterial so it stays true.
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -16;
  key.shadow.camera.right = 16;
  key.shadow.camera.top = 16;
  key.shadow.camera.bottom = -16;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-7, 7, -1);
  scene.add(fill);

  // A subtle ceiling bounce
  const rim = new THREE.PointLight(0xffffff, 0.25, 60);
  rim.position.set(0, 3.5, 10);
  scene.add(rim);

  // ---------------------------
  // Room geometry/materials
  // ---------------------------
  const room = new THREE.Group();
  scene.add(room);

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f2f2f2'),
    roughness: 0.92,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0f0f0'),
    roughness: 0.96,
    metalness: 0.0,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#101010'),
    roughness: 0.22,
    metalness: 0.05,
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

  // Baseboards
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

  // ---------------------------
  // Texture loading
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

  // Store clickable art planes by id
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

    // Aspect from loaded texture if available
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
    outer.receiveShadow = false;
    group.add(outer);

    // Matte
    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    // Artwork plane (kept Basic so it never gets crushed by lighting)
    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    art.position.z = depth / 2 + 0.011;
    art.userData = {
      kind: 'artwork',
      artworkId: artwork.id,
      width: artW,
      height: artH,
    };
    group.add(art);

    artMeshById.set(artwork.id, art);

    // Subtle spotlight for frame realism (does not affect MeshBasic art)
    const spot = new THREE.SpotLight(0xffffff, 1.2, 10, Math.PI / 7, 0.55, 1.1);
    spot.position.set(0, 3.6, 1.2);
    spot.target = art;
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    group.add(spot);
    group.add(spot.target);

    framesGroup.add(group);
  }

  // Layout
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
  // Controls: drag look + wheel move
  // ---------------------------
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const basePos = camera.position.clone();

  // Track click vs drag
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownTime = 0;

  // Focus state
  let isFocused = false;

  // Store "return" pose
  const returnPose = {
    pos: camera.position.clone(),
    yaw,
    pitch,
  };

  // Animated camera target
  const camTargetPos = new THREE.Vector3().copy(basePos);
  const camTargetLook = new THREE.Vector3(0, 1.5, 0);

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

    // If focused, ignore click-to-select (selection UI will handle close)
    if (isFocused) return;

    const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    const dt = performance.now() - pointerDownTime;

    // Only treat as click if short and low movement
    if (moved > 6 || dt > 450) return;

    // Raycast for artwork
    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);

    const clickable = Array.from(artMeshById.values());
    const hits = raycaster.intersectObjects(clickable, true);

    if (!hits.length) return;

    const hit = hits[0].object as THREE.Mesh;
    const artworkId = hit.userData?.artworkId as string | undefined;
    if (!artworkId) return;

    const artwork = artworkById.get(artworkId);
    if (!artwork) return;

    // Inform React
    onArtworkClick?.(artwork);

    // Focus camera
    focusArtwork(artworkId);
  }

  function onWheel(e: WheelEvent) {
    if (isFocused) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    basePos.addScaledVector(forward, step);

    const margin = 0.9;
    basePos.x = THREE.MathUtils.clamp(basePos.x, -roomW / 2 + margin, roomW / 2 - margin);
    basePos.z = THREE.MathUtils.clamp(basePos.z, -roomD / 2 + margin, roomD / 2 - margin);

    camTargetPos.copy(basePos);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  // ---------------------------
  // Focus helpers
  // ---------------------------
  function computeFitDistance(planeW: number, planeH: number) {
    // Fit plane in viewport with a little margin
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = camera.aspect;

    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    const distV = (planeH * 0.5) / Math.tan(vFov / 2);
    const distH = (planeW * 0.5) / Math.tan(hFov / 2);

    return Math.max(distV, distH) * 1.08; // margin factor
  }

  function focusArtwork(artworkId: string) {
    const art = artMeshById.get(artworkId);
    if (!art) return;

    // Store return pose
    returnPose.pos.copy(camera.position);
    returnPose.yaw = yaw;
    returnPose.pitch = pitch;

    // Determine center and normal
    const center = new THREE.Vector3();
    art.getWorldPosition(center);

    const normal = new THREE.Vector3(0, 0, 1);
    normal.applyQuaternion(art.getWorldQuaternion(new THREE.Quaternion()));
    normal.normalize();

    const planeW = Number(art.userData?.width ?? 1.2);
    const planeH = Number(art.userData?.height ?? 1.5);

    const dist = computeFitDistance(planeW, planeH);

    // Camera target position is along the normal, in front of the plane
    camTargetPos.copy(center).addScaledVector(normal, dist);
    camTargetLook.copy(center);

    // Compute yaw/pitch to face the artwork
    const dir = new THREE.Vector3().subVectors(camTargetLook, camTargetPos).normalize();
    const targetYaw = Math.atan2(dir.x, dir.z);
    const targetPitch = Math.asin(dir.y);

    yaw = yaw; // keep current during transition, animate below
    pitch = pitch;

    // Lock focus and set a separate animated yaw/pitch targets
    focusAnim.yawFrom = yaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.yawTo = targetYaw;
    focusAnim.pitchTo = THREE.MathUtils.clamp(targetPitch, minPitch, maxPitch);

    focusAnim.t = 0;
    focusAnim.active = true;

    isFocused = true;
  }

  function clearFocus() {
    if (!isFocused) return;

    // Return camera target to stored pose
    camTargetPos.copy(returnPose.pos);
    camTargetLook.copy(returnPose.pos).add(new THREE.Vector3(0, 0, -1)); // not used directly

    focusAnim.yawFrom = yaw;
    focusAnim.pitchFrom = pitch;
    focusAnim.yawTo = returnPose.yaw;
    focusAnim.pitchTo = returnPose.pitch;

    focusAnim.t = 0;
    focusAnim.active = true;

    isFocused = false;
  }

  const focusAnim = {
    active: false,
    t: 0,
    yawFrom: 0,
    yawTo: 0,
    pitchFrom: 0,
    pitchTo: 0,
  };

  function easeInOut(t: number) {
    // smoothstep-ish
    return t * t * (3 - 2 * t);
  }

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

    // Camera rotation update
    camera.rotation.order = 'YXZ';

    // Focus animation (position + yaw/pitch easing)
    if (focusAnim.active) {
      focusAnim.t = Math.min(1, focusAnim.t + dt / 0.55);
      const k = easeInOut(focusAnim.t);

      // Interpolate yaw/pitch
      yaw = THREE.MathUtils.lerp(focusAnim.yawFrom, focusAnim.yawTo, k);
      pitch = THREE.MathUtils.lerp(focusAnim.pitchFrom, focusAnim.pitchTo, k);

      if (focusAnim.t >= 1) {
        focusAnim.active = false;
      }
    }

    // Position easing for smoother motion
    basePos.lerp(camTargetPos, 0.14);

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
    focusArtwork,
    clearFocus,
  };
}
