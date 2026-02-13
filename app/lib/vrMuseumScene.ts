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
  // Kept for compatibility with your embed, but intentionally not used here (no modal).
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

type ArtMeshRecord = {
  artwork: MuseumArtwork;
  clickable: THREE.Object3D;
  frameGroup: THREE.Group;
  artW: number;
  artH: number;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

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

/**
 * Build a single large floor texture by stamping the source image into a canvas.
 * Uses feathered-edge stamps so the stamp grid disappears.
 */
function createStampedFloorTexture(
  image: HTMLImageElement,
  opts?: {
    size?: number;
    stampsX?: number;
    stampsY?: number;
    seed?: number;
    overlapPct?: number;
    jitterPct?: number;
    alpha?: number;
  }
) {
  const size = opts?.size ?? 2048;
  const stampsX = opts?.stampsX ?? 6;
  const stampsY = opts?.stampsY ?? 6;
  const seed = opts?.seed ?? 424242;

  const overlapPct = opts?.overlapPct ?? 0.30;
  const jitterPct = opts?.jitterPct ?? 0.06;
  const alpha = opts?.alpha ?? 0.95;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const rnd = mulberry32(seed);

  // Subtle warm base
  ctx.fillStyle = '#d8c29a';
  ctx.fillRect(0, 0, size, size);

  const cellW = size / stampsX;
  const cellH = size / stampsY;
  const overlapW = cellW * overlapPct;
  const overlapH = cellH * overlapPct;

  const drawW = cellW + overlapW;
  const drawH = cellH + overlapH;

  const featherPx = Math.max(18, Math.floor(Math.min(drawW, drawH) * 0.08));

  const featherStamp = (
    src: HTMLImageElement,
    w: number,
    h: number,
    feather: number,
    flipX: number
  ) => {
    const t = document.createElement('canvas');
    t.width = Math.max(2, Math.ceil(w));
    t.height = Math.max(2, Math.ceil(h));

    const tctx = t.getContext('2d');
    if (!tctx) return null;

    tctx.save();
    tctx.translate(w / 2, h / 2);
    tctx.scale(flipX, 1);
    tctx.drawImage(src, -w / 2, -h / 2, w, h);
    tctx.restore();

    tctx.globalCompositeOperation = 'destination-in';

    const fx = Math.min(0.49, feather / w);
    const fy = Math.min(0.49, feather / h);

    const gx = tctx.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, 'rgba(0,0,0,0)');
    gx.addColorStop(fx, 'rgba(0,0,0,1)');
    gx.addColorStop(1 - fx, 'rgba(0,0,0,1)');
    gx.addColorStop(1, 'rgba(0,0,0,0)');
    tctx.fillStyle = gx;
    tctx.fillRect(0, 0, w, h);

    const gy = tctx.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, 'rgba(0,0,0,0)');
    gy.addColorStop(fy, 'rgba(0,0,0,1)');
    gy.addColorStop(1 - fy, 'rgba(0,0,0,1)');
    gy.addColorStop(1, 'rgba(0,0,0,0)');
    tctx.fillStyle = gy;
    tctx.fillRect(0, 0, w, h);

    tctx.globalCompositeOperation = 'source-over';
    return t;
  };

  for (let y = 0; y < stampsY; y++) {
    for (let x = 0; x < stampsX; x++) {
      const cx = x * cellW + cellW / 2;
      const cy = y * cellH + cellH / 2;

      const jx = (rnd() - 0.5) * cellW * jitterPct;
      const jy = (rnd() - 0.5) * cellH * jitterPct;

      const flipX = rnd() < 0.5 ? -1 : 1;

      const stamp = featherStamp(image, drawW, drawH, featherPx, flipX);
      if (!stamp) continue;

      ctx.globalAlpha = alpha;
      ctx.drawImage(stamp, cx + jx - drawW / 2, cy + jy - drawH / 2);
    }
  }

  ctx.globalAlpha = 1;

  // Subtle grain
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 10;
    d[i] = clamp(d[i] + n, 0, 255);
    d[i + 1] = clamp(d[i + 1] + n, 0, 255);
    d[i + 2] = clamp(d[i + 2] + n, 0, 255);
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  return tex;
}

export function createVrMuseumScene({
  container,
  artworks,
  onArtworkClick: _onArtworkClick,
}: CreateArgs): VrMuseumSceneHandle {
  let disposed = false;

  // Renderer
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

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';

  renderer.domElement.style.overscrollBehavior = 'contain';
  (renderer.domElement.style as any).touchAction = 'none';

  if (!container.style.position) container.style.position = 'relative';

  container.appendChild(renderer.domElement);

  // Placard overlay
  const placard = document.createElement('div');
  placard.style.position = 'absolute';
  placard.style.top = '50%';

  // Tighter right margin and smaller plaque for more artwork space
  placard.style.right = '18px';
  placard.style.transform = 'translateY(-50%)';

  // Smaller (about 15%)
  placard.style.width = '290px';
  placard.style.maxWidth = '32vw';

  placard.style.pointerEvents = 'none';
  placard.style.opacity = '0';
  placard.style.transition = 'opacity 220ms ease';

  placard.style.fontFamily =
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';
  placard.style.color = '#1b1b1b';

  placard.style.borderRadius = '0px';
  placard.style.border = '1px solid rgba(0,0,0,0.30)';
  placard.style.backgroundImage =
    'linear-gradient(180deg, rgba(246,244,238,0.98) 0%, rgba(236,233,224,0.98) 100%), repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.00) 3px, rgba(0,0,0,0.00) 6px)';

  // Slightly tighter padding
  placard.style.padding = '14px 14px 12px 14px';
  placard.style.lineHeight = '1.25';
  placard.style.boxShadow =
    'inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -2px 6px rgba(0,0,0,0.12)';

  placard.innerHTML = `
    <div style="font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: rgba(0,0,0,.55); margin-bottom: 10px;">
      Museum Label
    </div>

    <div data-artist style="font-size: 17px; font-weight: 650; margin-bottom: 5px;">
      Artist Name
    </div>

    <div data-title style="font-size: 14px; color: rgba(0,0,0,.86); margin-bottom: 9px;">
      <span style="font-style: italic;">Artwork Title</span>
    </div>

    <div style="height:1px; background: rgba(0,0,0,.18); margin: 10px 0;"></div>

    <div style="display:grid; grid-template-columns: 86px 1fr; gap: 7px 10px; font-size: 12px; color: rgba(0,0,0,.78);">
      <div style="color: rgba(0,0,0,.55);">Collection</div>
      <div data-collection>Collection Name</div>

      <div style="color: rgba(0,0,0,.55);">Title</div>
      <div data-title2>Artwork Title</div>

      <div style="color: rgba(0,0,0,.55);">Catalog ID</div>
      <div data-id>ABC-0001</div>
    </div>
  `;
  container.appendChild(placard);

  const placardArtist = placard.querySelector('[data-artist]') as HTMLDivElement | null;
  const placardTitle = placard.querySelector('[data-title]') as HTMLDivElement | null;
  const placardTitle2 = placard.querySelector('[data-title2]') as HTMLDivElement | null;
  const placardCollection = placard.querySelector('[data-collection]') as HTMLDivElement | null;
  const placardId = placard.querySelector('[data-id]') as HTMLDivElement | null;

  function showPlacard(artwork: MuseumArtwork) {
    const anyA: any = artwork as any;
    const artist = anyA.artist ?? anyA.artistName ?? 'Unknown Artist';
    const title = anyA.title ?? 'Untitled';
    const collection = anyA.collection ?? anyA.collectionName ?? 'Collection';
    const catalogId = anyA.sku ?? anyA.catalogId ?? artwork.id ?? 'ID';

    if (placardArtist) placardArtist.textContent = String(artist);
    if (placardTitle)
      placardTitle.innerHTML = `<span style="font-style: italic;">${String(title)}</span>`;
    if (placardTitle2) placardTitle2.textContent = String(title);
    if (placardCollection) placardCollection.textContent = String(collection);
    if (placardId) placardId.textContent = String(catalogId);

    placard.style.opacity = '1';
  }

  function hidePlacard() {
    placard.style.opacity = '0';
  }

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#cfe7ff');

  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const room = new THREE.Group();
  scene.add(room);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);

  const yawObj = new THREE.Object3D();
  const pitchObj = new THREE.Object3D();
  yawObj.add(pitchObj);
  pitchObj.add(camera);
  scene.add(yawObj);

  const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 400);
  let activeCamera: THREE.Camera = camera;

  yawObj.position.set(0, 1.55, 6.6);
  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

  const clock = new THREE.Clock();

  let focusActive = false;
  let focusTime = 0;
  let focusDuration = 1.35;
  let focusTargetRec: ArtMeshRecord | null = null;

  const focusFrom = {
    pos: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    fov: 55,
  };

  const focusTo = {
    pos: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    fov: 35,
  };

  let inspecting = false;
  let inspectRec: ArtMeshRecord | null = null;

  // Layout knobs for inspect view
  // We compute these from the live placard width so we always preserve aspect ratio and maximize size.
  const VIEW_MARGIN_PX = 18; // tighter margins
  const GAP_PX = 14; // smaller gap between artwork and plaque
  const ART_LEFT_BREATHING_PX = 12; // small left margin

  function getPlacardReservedWidthPx() {
    // Use actual rendered width (or fallback), plus right margin and gap
    const w = placard.getBoundingClientRect().width || 290;
    // right: 18px already, but include it plus a little safety
    return Math.ceil(w + 18 + GAP_PX);
  }

  function getUsableArtViewportPx() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);

    const reserved = getPlacardReservedWidthPx();

    const usableW = Math.max(1, w - reserved - ART_LEFT_BREATHING_PX - VIEW_MARGIN_PX);
    const usableH = Math.max(1, h - VIEW_MARGIN_PX * 2);

    return { w, h, usableW, usableH, reserved };
  }

  function updateOrthoFrustumToArtwork(rec: ArtMeshRecord) {
    // Maintain artwork aspect ratio strictly (ortho does not distort geometry).
    // We maximize the size by fitting within usableW x usableH.
    const { usableW, usableH } = getUsableArtViewportPx();

    const viewportAspect = usableW / Math.max(1, usableH);
    const artAspect = rec.artW / Math.max(1e-6, rec.artH);

    // Fit by whichever dimension is limiting, keep a tiny buffer
    const buffer = 0.97;

    let halfH: number;
    let halfW: number;

    if (viewportAspect >= artAspect) {
      // Height limits (we have more width than needed)
      halfH = (rec.artH / 2) / buffer;
      halfW = halfH * viewportAspect;
    } else {
      // Width limits
      // width in ortho = 2*halfW, and that width maps to usableW area
      // so halfW should be based on art width, while halfH follows viewport aspect
      halfW = (rec.artW / 2) / buffer;
      halfH = halfW / viewportAspect;
    }

    orthoCamera.left = -halfW;
    orthoCamera.right = halfW;
    orthoCamera.top = halfH;
    orthoCamera.bottom = -halfH;
    orthoCamera.near = 0.01;
    orthoCamera.far = 400;
    orthoCamera.updateProjectionMatrix();
  }

  function enterOrthoInspect(rec: ArtMeshRecord) {
    inspecting = true;
    inspectRec = rec;

    const worldPos = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldPos);

    const normalOut = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(rec.frameGroup.quaternion)
      .normalize();

    const artRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(rec.frameGroup.quaternion)
      .normalize();

    const artUp = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(rec.frameGroup.quaternion)
      .normalize();

    // Compute how far to shift the camera target right so that, on screen,
    // the artwork is centered inside the usable viewport (left side area).
    const { w, usableW, reserved } = getUsableArtViewportPx();

    // Fraction of full canvas occupied by reserved (plaque side)
    const reservedFrac = reserved / Math.max(1, w);
    const usableFrac = usableW / Math.max(1, w);

    // We want the artwork centered in the usable region, whose center is at:
    // x = -0.5 + (usableFrac/2) in NDC terms.
    // That implies a camera target shift in world units proportional to ortho halfW.
    // In ortho, 1 NDC x unit corresponds to halfW world units.
    updateOrthoFrustumToArtwork(rec);

    const halfW = Math.abs(orthoCamera.right);

    const centerNdcX = -1 + usableFrac; // center of usable region in [-1..1]
    const targetShiftWorld = (centerNdcX * 0.5) * (2 * halfW);

    // If targetShiftWorld is negative, that would move target left. We need target right
    // to make artwork appear left, so invert sign.
    const sideShift = -targetShiftWorld;

    const dist = 10;

    const target = worldPos.clone().add(artRight.clone().multiplyScalar(sideShift));

    orthoCamera.position.copy(target).add(normalOut.clone().multiplyScalar(dist));
    orthoCamera.up.copy(artUp);
    orthoCamera.lookAt(target);

    // Recompute frustum again after target shift since reserved width could change on layout
    updateOrthoFrustumToArtwork(rec);

    activeCamera = orthoCamera;
    showPlacard(rec.artwork);
  }

  function exitOrthoInspect() {
    inspecting = false;
    inspectRec = null;
    activeCamera = camera;
    hidePlacard();
  }

  function cancelFocusAndInspect() {
    focusActive = false;
    focusTargetRec = null;
    if (inspecting) exitOrthoInspect();
  }

  function startFocusOnRecord(rec: ArtMeshRecord, opts?: { duration?: number }) {
    cancelFocusAndInspect();

    focusActive = true;
    focusTargetRec = rec;
    focusTime = 0;
    focusDuration = opts?.duration ?? 1.35;

    focusFrom.pos.copy(yawObj.position);
    focusFrom.yaw = yaw;
    focusFrom.pitch = pitch;
    focusFrom.fov = camera.fov;

    const worldPos = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldPos);

    const normalOut = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(rec.frameGroup.quaternion)
      .normalize();

    const targetFov = 35;
    const vFovRad = (targetFov * Math.PI) / 180;
    const fillPct = 0.92;

    const neededDist = (rec.artH / 2) / Math.tan(vFovRad / 2) / fillPct;
    const dist = clamp(neededDist, 1.25, 4.5);

    focusTo.pos.copy(worldPos).add(normalOut.clone().multiplyScalar(dist));
    focusTo.pos.y = worldPos.y;

    const lookDir = worldPos.clone().sub(focusTo.pos);
    lookDir.y = 0;
    lookDir.normalize();

    focusTo.yaw = Math.atan2(-lookDir.x, -lookDir.z);
    focusTo.pitch = 0;
    focusTo.fov = targetFov;

    activeCamera = camera;
  }

  // Materials
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.94,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.98,
    metalness: 0.0,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.58,
    metalness: 0.02,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const floorImg = new Image();
  floorImg.src = '/floor.png';
  floorImg.crossOrigin = 'anonymous';

  floorImg.onload = () => {
    if (disposed) return;

    const stamped = createStampedFloorTexture(floorImg, {
      size: 2048,
      stampsX: 6,
      stampsY: 12,
      seed: 424242,
      overlapPct: 0.30,
      jitterPct: 0.06,
      alpha: 0.95,
    });

    floorMat.map = stamped;
    floorMat.needsUpdate = true;
  };

  floorImg.onerror = () => {
    floorMat.color = new THREE.Color('#d6d6d6');
    floorMat.map = null;
    floorMat.needsUpdate = true;
  };

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

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
    color: new THREE.Color('#f1f1f1'),
    roughness: 0.85,
    metalness: 0.0,
  });

  const baseboardH = 0.09;
  const baseboardT = 0.03;

  function addBaseboard(length: number, x: number, z: number, rotY: number) {
    const geo = new THREE.BoxGeometry(length, baseboardH, baseboardT);
    const mesh = new THREE.Mesh(geo, baseboardMat);
    mesh.position.set(x, baseboardH / 2, z);
    mesh.rotation.y = rotY;
    room.add(mesh);
  }

  addBaseboard(roomW, 0, roomD / 2 - baseboardT / 2, 0);
  addBaseboard(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboard(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // Window wall
  const windowWall = new THREE.Group();
  room.add(windowWall);

  const backZ = -roomD / 2;

  const openingW = roomW * 0.86;
  const openingH = roomH * 0.62;
  const openingBottom = 0.55;
  const sideW = (roomW - openingW) / 2;

  const bottomBand = new THREE.Mesh(new THREE.PlaneGeometry(roomW, openingBottom), wallMat);
  bottomBand.position.set(0, openingBottom / 2, backZ);
  windowWall.add(bottomBand);

  const topY0 = openingBottom + openingH;
  const topH = roomH - topY0;
  const topBand = new THREE.Mesh(new THREE.PlaneGeometry(roomW, topH), wallMat);
  topBand.position.set(0, topY0 + topH / 2, backZ);
  windowWall.add(topBand);

  const leftBand = new THREE.Mesh(new THREE.PlaneGeometry(sideW, openingH), wallMat);
  leftBand.position.set(-(openingW / 2 + sideW / 2), openingBottom + openingH / 2, backZ);
  windowWall.add(leftBand);

  const rightBand = new THREE.Mesh(new THREE.PlaneGeometry(sideW, openingH), wallMat);
  rightBand.position.set(openingW / 2 + sideW / 2, openingBottom + openingH / 2, backZ);
  windowWall.add(rightBand);

  addBaseboard(roomW, 0, backZ + baseboardT / 2, 0);

  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f7f7f7'),
    roughness: 0.55,
    metalness: 0.0,
  });

  const frameDepth = 0.06;
  const frameBorder = 0.09;
  const mullionT = 0.035;

  const frameGroup = new THREE.Group();
  frameGroup.position.set(0, openingBottom + openingH / 2, backZ + frameDepth / 2);
  windowWall.add(frameGroup);

  const topBorder = new THREE.Mesh(
    new THREE.BoxGeometry(openingW, frameBorder, frameDepth),
    frameMat
  );
  topBorder.position.set(0, openingH / 2 - frameBorder / 2, 0);
  topBorder.castShadow = true;
  frameGroup.add(topBorder);

  const bottomBorder2 = new THREE.Mesh(
    new THREE.BoxGeometry(openingW, frameBorder, frameDepth),
    frameMat
  );
  bottomBorder2.position.set(0, -openingH / 2 + frameBorder / 2, 0);
  bottomBorder2.castShadow = true;
  frameGroup.add(bottomBorder2);

  const leftBorder2 = new THREE.Mesh(
    new THREE.BoxGeometry(frameBorder, openingH, frameDepth),
    frameMat
  );
  leftBorder2.position.set(-openingW / 2 + frameBorder / 2, 0, 0);
  leftBorder2.castShadow = true;
  frameGroup.add(leftBorder2);

  const rightBorder2 = new THREE.Mesh(
    new THREE.BoxGeometry(frameBorder, openingH, frameDepth),
    frameMat
  );
  rightBorder2.position.set(openingW / 2 - frameBorder / 2, 0, 0);
  rightBorder2.castShadow = true;
  frameGroup.add(rightBorder2);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.04,
    metalness: 0.0,
    transmission: 0.96,
    thickness: 0.03,
    transparent: true,
    opacity: 1.0,
    ior: 1.45,
  });

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(openingW - frameBorder * 1.6, openingH - frameBorder * 1.6),
    glassMat
  );
  glass.position.set(0, openingBottom + openingH / 2, backZ + frameDepth + 0.01);
  windowWall.add(glass);

  const cols = 4;
  const rows = 2;

  for (let c = 1; c < cols; c++) {
    const x = -openingW / 2 + (openingW * c) / cols;
    const v = new THREE.Mesh(
      new THREE.BoxGeometry(mullionT, openingH - frameBorder * 1.6, frameDepth),
      frameMat
    );
    v.position.set(x, openingBottom + openingH / 2, backZ + frameDepth / 2);
    v.castShadow = true;
    windowWall.add(v);
  }

  for (let r = 1; r < rows; r++) {
    const y = openingBottom + (openingH * r) / rows;
    const h = new THREE.Mesh(
      new THREE.BoxGeometry(openingW - frameBorder * 1.6, mullionT, frameDepth),
      frameMat
    );
    h.position.set(0, y, backZ + frameDepth / 2);
    h.castShadow = true;
    windowWall.add(h);
  }

  // Window view: hamptons.jpg only
  const vistaLoader = new THREE.TextureLoader();
  const vistaTex = vistaLoader.load('/hamptons.jpg', (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 12);
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
  });

  const vistaMat = new THREE.MeshBasicMaterial({
    map: vistaTex,
    toneMapped: false,
  });

  const vista = new THREE.Mesh(
    new THREE.PlaneGeometry(openingW * 1.55, openingH * 1.55),
    vistaMat
  );

  const windowCenterY = openingBottom + openingH / 2;
  vista.position.set(0, windowCenterY, backZ - 1.2);
  vista.rotation.y = Math.PI;
  vista.renderOrder = -10;
  scene.add(vista);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));

  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(0, 7.5, -18);
  sun.target.position.set(0, 1.4, -6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 90;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xffffff, 0.30);
  fill.position.set(6, 10, 10);
  scene.add(fill);

  // Art frames
  const texLoader = new THREE.TextureLoader();
  const framesGroup = new THREE.Group();
  room.add(framesGroup);

  const frameOuterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a1a'),
    roughness: 0.35,
    metalness: 0.12,
  });

  const matteMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f8f8f8'),
    roughness: 0.98,
    metalness: 0.0,
  });

  const clickableMeshes: ArtMeshRecord[] = [];

  function loadArtworkTexture(url: string): Promise<THREE.Texture | null> {
    const src = normalizeImageUrl(url);
    return new Promise((resolve) => {
      texLoader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  async function addFramedArtwork(opts: {
    artwork: MuseumArtwork;
    position: THREE.Vector3;
    rotationY: number;
    targetMaxWidth: number;
    targetMaxHeight: number;
  }) {
    const { artwork, position, rotationY, targetMaxWidth, targetMaxHeight } = opts;

    const tex = await loadArtworkTexture(artwork.imageUrl);

    let aspect = 4 / 5;
    const img: any = tex?.image;
    if (img?.width && img?.height) aspect = img.width / img.height;

    let artW = targetMaxWidth;
    let artH = artW / aspect;
    if (artH > targetMaxHeight) {
      artH = targetMaxHeight;
      artW = artH * aspect;
    }

    const g = new THREE.Group();
    g.position.copy(position);
    g.rotation.y = rotationY;

    const depth = 0.08;
    const frameT = 0.09;

    const outer = new THREE.Mesh(
      new THREE.BoxGeometry(artW + frameT, artH + frameT, depth),
      frameOuterMat
    );
    outer.castShadow = true;
    outer.receiveShadow = true;
    g.add(outer);

    const matte = new THREE.Mesh(
      new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.006),
      matteMat
    );
    matte.position.z = depth / 2 + 0.004;
    g.add(matte);

    const artMat = new THREE.MeshBasicMaterial({
      color: tex ? 0xffffff : 0x2b2b2b,
      map: tex ?? undefined,
    });

    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    artPlane.position.z = depth / 2 + 0.01;
    artPlane.userData.__artworkId = artwork.id;
    g.add(artPlane);

    framesGroup.add(g);

    clickableMeshes.push({
      artwork,
      clickable: artPlane,
      frameGroup: g,
      artW,
      artH,
    });
  }

  // Placements
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const artY = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({
      pos: new THREE.Vector3(roomW / 2 - 0.06, artY, z),
      rotY: -Math.PI / 2,
    });
  }

  for (let i = 6; i < artworks.length; i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({
      pos: new THREE.Vector3(-roomW / 2 + 0.06, artY, z),
      rotY: Math.PI / 2,
    });
  }

  (async () => {
    for (let i = 0; i < artworks.length; i++) {
      if (disposed) return;

      const p =
        placements[i] ??
        ({
          pos: new THREE.Vector3(roomW / 2 - 0.06, artY, 9 - i * 5.2),
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

  // Controls
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  function onPointerDown(e: PointerEvent) {
    cancelFocusAndInspect();

    isDragging = true;
    dragMoved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;

    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * 0.0032;
    pitch -= dy * 0.0032;
    pitch = clamp(pitch, minPitch, maxPitch);

    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;
  }

  function onPointerUp(e: PointerEvent) {
    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {}
    renderer.domElement.style.cursor = 'grab';

    if (!dragMoved) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), activeCamera);

      const targets = clickableMeshes.map((m) => m.clickable);
      const hits = raycaster.intersectObjects(targets, true);

      if (hits.length) {
        const hit = hits[0].object;
        const id = (hit.userData?.__artworkId as string) ?? '';
        const rec = clickableMeshes.find((m) => m.artwork.id === id);
        if (rec) startFocusOnRecord(rec, { duration: 1.35 });
      }
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    cancelFocusAndInspect();

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(yawObj.quaternion);
    forward.y = 0;
    forward.normalize();

    const step = e.deltaY * 0.004;
    yawObj.position.addScaledVector(forward, step);

    const margin = 0.9;
    yawObj.position.x = clamp(yawObj.position.x, -roomW / 2 + margin, roomW / 2 - margin);
    yawObj.position.z = clamp(yawObj.position.z, -roomD / 2 + margin, roomD / 2 - margin);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

  // Resize
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;

    renderer.setSize(w, h, false);

    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();

    if (inspectRec) {
      // If plaque size changes due to responsive layout, keep maximizing art size
      updateOrthoFrustumToArtwork(inspectRec);
      // Recenter after frustum update
      enterOrthoInspect(inspectRec);
    }
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  function focusArtwork(id: string) {
    const rec = clickableMeshes.find((m) => m.artwork.id === id);
    if (!rec) return;
    startFocusOnRecord(rec, { duration: 1.35 });
  }

  function clearFocus() {
    cancelFocusAndInspect();

    yawObj.position.set(0, 1.55, 6.6);
    yaw = 0;
    pitch = 0;

    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;

    camera.fov = 55;
    camera.updateProjectionMatrix();

    activeCamera = camera;
  }

  function animate() {
    if (disposed) return;

    const dt = clock.getDelta();

    if (focusActive) {
      focusTime += dt;
      const t = clamp(focusTime / focusDuration, 0, 1);

      const e = easeInOutCubic(t);
      const eY = easeOutCubic(clamp(t * 1.05, 0, 1));

      yawObj.position.set(
        lerp(focusFrom.pos.x, focusTo.pos.x, e),
        lerp(focusFrom.pos.y, focusTo.pos.y, eY),
        lerp(focusFrom.pos.z, focusTo.pos.z, e)
      );

      yaw = lerp(focusFrom.yaw, focusTo.yaw, e);
      pitch = lerp(focusFrom.pitch, focusTo.pitch, e);

      yawObj.rotation.y = yaw;
      pitchObj.rotation.x = pitch;

      camera.fov = lerp(focusFrom.fov, focusTo.fov, e);
      camera.updateProjectionMatrix();

      if (t >= 1) {
        focusActive = false;

        const rec = focusTargetRec;
        focusTargetRec = null;

        if (rec) enterOrthoInspect(rec);
      }
    }

    renderer.render(scene, activeCamera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerUp);
    renderer.domElement.removeEventListener('wheel', onWheel as any);

    scene.traverse((obj) => {
      const anyObj: any = obj;
      if (anyObj.geometry?.dispose) anyObj.geometry.dispose();

      const mat = anyObj.material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if (m.map?.dispose) m.map.dispose();
          if (m.dispose) m.dispose();
        }
      }
    });

    renderer.dispose();

    if (placard.parentElement === container) container.removeChild(placard);
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
  }

  return { dispose, focusArtwork, clearFocus };
}
