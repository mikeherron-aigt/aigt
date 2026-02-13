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

type ArtMeshRecord = {
  artwork: MuseumArtwork;
  clickable: THREE.Object3D;
  frameGroup: THREE.Group;
  artPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
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
 * This avoids visible tiling seams from RepeatWrapping.
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
  const overlapPct = opts?.overlapPct ?? 0.12;
  const jitterPct = opts?.jitterPct ?? 0.03;
  const alpha = opts?.alpha ?? 0.95;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const rnd = mulberry32(seed);

  // faint warm base
  ctx.fillStyle = '#d8c29a';
  ctx.fillRect(0, 0, size, size);

  const cellW = size / stampsX;
  const cellH = size / stampsY;
  const overlapW = cellW * overlapPct;
  const overlapH = cellH * overlapPct;

  // stamp with overlap and tiny jitter, no rotations (keep plank direction consistent)
  ctx.globalAlpha = alpha;

  for (let y = 0; y < stampsY; y++) {
    for (let x = 0; x < stampsX; x++) {
      const cx = x * cellW + cellW / 2;
      const cy = y * cellH + cellH / 2;

      const jx = (rnd() - 0.5) * cellW * jitterPct;
      const jy = (rnd() - 0.5) * cellH * jitterPct;

      const w = cellW + overlapW * 2;
      const h = cellH + overlapH * 2;

      ctx.save();
      ctx.translate(cx + jx, cy + jy);

      // optional mirror flip only
      const flipX = rnd() < 0.5 ? -1 : 1;
      ctx.scale(flipX, 1);

      ctx.drawImage(image, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }

  ctx.globalAlpha = 1;

  // subtle noise to break stamp boundaries
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 10; // -5..+5
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

function createPlacardEl(container: HTMLDivElement) {
  const placard = document.createElement('div');
  placard.setAttribute('data-placard', 'true');

  // Real plaque vibe: square corners, engraved feel, subtle bevel, no drop shadow
  placard.style.position = 'absolute';
  placard.style.right = '64px';
  placard.style.top = '50%';
  placard.style.transform = 'translateY(-50%)';
  placard.style.width = '420px';
  placard.style.padding = '22px 22px 18px 22px';
  placard.style.background =
    'linear-gradient(180deg, rgba(250,248,242,0.98), rgba(243,240,232,0.98))';
  placard.style.border = '1px solid rgba(0,0,0,0.18)';
  placard.style.borderRadius = '0px';
  placard.style.boxShadow =
    'inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -2px 4px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(0,0,0,0.04)';
  placard.style.color = '#1a1a1a';
  placard.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  placard.style.letterSpacing = '0.02em';
  placard.style.userSelect = 'none';
  placard.style.pointerEvents = 'none';
  placard.style.opacity = '0';
  placard.style.transition = 'opacity 220ms ease';

  placard.innerHTML = `
    <div style="font-size:12px; letter-spacing:0.18em; color:#6b6b6b;">MUSEUM LABEL</div>
    <div style="margin-top:10px; font-size:26px; font-weight:650; letter-spacing:0.01em;" data-artist></div>
    <div style="margin-top:6px; font-size:18px; font-style:italic; color:#2a2a2a;" data-title></div>

    <div style="margin-top:14px; height:1px; background:rgba(0,0,0,0.16);"></div>

    <div style="margin-top:14px; display:grid; grid-template-columns:120px 1fr; row-gap:8px; column-gap:18px; font-size:16px;">
      <div style="color:#7a7a7a;">Collection</div><div style="font-weight:550;" data-collection></div>
      <div style="color:#7a7a7a;">Title</div><div style="font-weight:550;" data-title2></div>
      <div style="color:#7a7a7a;">Catalog ID</div><div style="font-weight:550;" data-catalog></div>
    </div>
  `;

  // ensure container can host absolute overlay
  const style = window.getComputedStyle(container);
  if (style.position === 'static') container.style.position = 'relative';

  container.appendChild(placard);

  const setPlacard = (a?: MuseumArtwork) => {
    const artist = placard.querySelector('[data-artist]') as HTMLDivElement | null;
    const title = placard.querySelector('[data-title]') as HTMLDivElement | null;
    const collection = placard.querySelector('[data-collection]') as HTMLDivElement | null;
    const title2 = placard.querySelector('[data-title2]') as HTMLDivElement | null;
    const catalog = placard.querySelector('[data-catalog]') as HTMLDivElement | null;

    if (!artist || !title || !collection || !title2 || !catalog) return;

    if (!a) {
      artist.textContent = '';
      title.textContent = '';
      collection.textContent = '';
      title2.textContent = '';
      catalog.textContent = '';
      return;
    }

    artist.textContent = a.artist ?? '';
    title.textContent = a.title ?? '';
    collection.textContent = a.collection ?? '';
    title2.textContent = a.title ?? '';
    catalog.textContent = (a as any).catalogId ?? (a as any).catalog_id ?? a.id ?? '';
  };

  const showPlacard = (yes: boolean) => {
    placard.style.opacity = yes ? '1' : '0';
  };

  // responsive sizing: keep it secondary
  const resizePlacard = (w: number) => {
    // About 15% smaller than earlier: clamp width
    const target = clamp(Math.round(w * 0.26), 300, 420);
    placard.style.width = `${target}px`;
    placard.style.right = `${Math.round(clamp(w * 0.04, 22, 64))}px`;
  };

  return { placard, setPlacard, showPlacard, resizePlacard };
}

export function createVrMuseumScene({
  container,
  artworks,
  onArtworkClick,
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
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.touchAction = 'none'; // important for wheel/pointer
  container.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#cfe7ff');

  // Room sizing
  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const room = new THREE.Group();
  scene.add(room);

  // Camera rig
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);

  const yawObj = new THREE.Object3D();
  const pitchObj = new THREE.Object3D();
  yawObj.add(pitchObj);
  pitchObj.add(camera);
  scene.add(yawObj);

  yawObj.position.set(0, 1.55, 6.6);

  let yaw = 0;
  let pitch = 0;
  const minPitch = -0.55;
  const maxPitch = 0.45;

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

  // Floor
  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.78,
    metalness: 0.0,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  // Seam-free stamped floor
  const floorImg = new Image();
  floorImg.src = '/floor.png';
  floorImg.crossOrigin = 'anonymous';

  floorImg.onload = () => {
    if (disposed) return;

    const stamped = createStampedFloorTexture(floorImg, {
      size: 2048,
      stampsX: 5,
      stampsY: 9,
      seed: 424242,
      overlapPct: 0.14,
      jitterPct: 0.03,
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

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  // Walls
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

  // Window frame
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

  // Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.03,
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

  // Mullions
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

  // Outside vista: stable /hamptons.jpg plane
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
    new THREE.PlaneGeometry(openingW * 3.0, openingH * 3.0),
    vistaMat
  );

  const windowCenterY = openingBottom + openingH / 2;
  vista.position.set(0, windowCenterY, backZ - 40);
  vista.rotation.y = Math.PI;
  vista.renderOrder = -10;
  scene.add(vista);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.52));

  const sun = new THREE.DirectionalLight(0xffffff, 0.85);

  // Sun matches the photo: far right, low-ish, outside window, aimed into left interior
  sun.position.set(85, 2.2, backZ - 60);
  sun.target.position.set(-25, 0.2, 10);

  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 180;
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;

  // Softer edges but still defined
  sun.shadow.radius = 5;

  // Reduce acne without detaching shadows
  sun.shadow.bias = -0.00008;
  sun.shadow.normalBias = 0.02;

  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xffffff, 0.30);
  fill.position.set(6, 10, 10);
  scene.add(fill);

  // Art frames
const safeTexLoader = new THREE.TextureLoader();


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
      safeTexLoader.load(
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
      artPlane,
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
        placements[i] ?? ({
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

  // Placard overlay
  const { placard, setPlacard, showPlacard, resizePlacard } = createPlacardEl(container);

  // Inspect overlay (pixel-perfect, no perspective)
  const overlayScene = new THREE.Scene();
  const overlayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
  overlayCam.position.set(0, 0, 5);

  const overlayBg = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({ color: 0x8f8f8f })
  );
  overlayBg.position.z = -1;
  overlayScene.add(overlayBg);

  const overlayArtMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
  const overlayArt = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), overlayArtMat);
  overlayArt.position.z = 0;
  overlayScene.add(overlayArt);

  let isInspecting = false;
  let inspectT = 0;
  let inspectFromPos = new THREE.Vector3();
  let inspectToPos = new THREE.Vector3();
  let inspectFromYaw = 0;
  let inspectToYaw = 0;
  let inspectFromPitch = 0;
  let inspectToPitch = 0;
  let inspectRec: ArtMeshRecord | null = null;

  function cancelInspect() {
    isInspecting = false;
    inspectT = 0;
    inspectRec = null;
    showPlacard(false);
    setPlacard(undefined);

    // restore normal scene background
    scene.background = new THREE.Color('#cfe7ff');
  }

  // Fit artwork on left side, preserve aspect, never crop
  function layoutOverlayForTexture(tex: THREE.Texture) {
    const w = container.clientWidth;
    const h = container.clientHeight;

    // right area for placard (slightly smaller), and a narrow gap
    const rightFrac = 0.30; // placard area
    const gapPx = Math.max(18, Math.round(w * 0.02));

    const leftWpx = Math.max(1, Math.round(w * (1 - rightFrac)) - gapPx);

    const img: any = tex.image;
    const texAspect =
      img && img.width && img.height ? img.width / img.height : 1;

    // available pixel box for artwork in left area with breathing room
    const pad = Math.round(Math.min(leftWpx, h) * 0.06);
    const availW = Math.max(1, leftWpx - pad * 2);
    const availH = Math.max(1, h - pad * 2);

    // fit contain
    let drawW = availW;
    let drawH = drawW / texAspect;
    if (drawH > availH) {
      drawH = availH;
      drawW = drawH * texAspect;
    }

    // convert to NDC width/height on ortho (-1..1)
    const ndcW = (drawW / w) * 2;
    const ndcH = (drawH / h) * 2;

    overlayArt.scale.set(ndcW, ndcH, 1);

    // position artwork centered within left area
    const leftCenterXpx = pad + (availW / 2);
    const leftCenterXNdc = (leftCenterXpx / w) * 2 - 1;

    overlayArt.position.set(leftCenterXNdc, 0, 0);

    // place placard to the right, centered vertically
    const placardRightPx = Math.round(clamp(w * 0.04, 22, 64));
    placard.style.right = `${placardRightPx}px`;
    placard.style.top = '50%';
    placard.style.transform = 'translateY(-50%)';

    resizePlacard(w);
  }

  function startInspect(rec: ArtMeshRecord) {
    const tex = rec.artPlane.material.map;
    if (!tex) return;

    inspectRec = rec;

    // show placard data
    setPlacard(rec.artwork);
    showPlacard(true);

    // Layout overlay and swap background to neutral gray
    scene.background = new THREE.Color('#8f8f8f');
    overlayArtMat.map = tex;
    overlayArtMat.needsUpdate = true;
    layoutOverlayForTexture(tex);

    // animate camera movement into a stable "inspect spot" looking at the work
    const worldPos = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldPos);

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rec.frameGroup.quaternion);
    const targetPos = worldPos.clone().add(forward.clone().multiplyScalar(2.6));

    // lift camera so the final framing feels less "snap"
    targetPos.y = 1.75;

    inspectFromPos.copy(yawObj.position);
    inspectToPos.copy(targetPos);

    // yaw to face artwork
    const lookDir = worldPos.clone().sub(targetPos);
    lookDir.y = 0;
    lookDir.normalize();

    inspectFromYaw = yaw;
    inspectToYaw = Math.atan2(-lookDir.x, -lookDir.z);

    inspectFromPitch = pitch;
    inspectToPitch = 0;

    isInspecting = true;
    inspectT = 0;
  }

  // Controls
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  function onPointerDown(e: PointerEvent) {
    if (isInspecting) return; // lock while zooming
    isDragging = true;
    dragMoved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    if (isInspecting) return;

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
    if (!isDragging) return;

    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {}
    renderer.domElement.style.cursor = 'grab';

    if (isInspecting) return;

    if (!dragMoved) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const targets = clickableMeshes.map((m) => m.clickable);
      const hits = raycaster.intersectObjects(targets, true);

      if (hits.length) {
        const hit = hits[0].object;
        const id = (hit.userData?.__artworkId as string) ?? '';
        const rec = clickableMeshes.find((m) => m.artwork.id === id);
        if (rec) {
          onArtworkClick?.(rec.artwork);
          startInspect(rec);
        }
      }
    }
  }

  function onWheel(e: WheelEvent) {
    // If mouse is over the museum canvas, prevent page scroll and only move camera
    e.preventDefault();

    if (isInspecting) return;

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

  // passive must be false or preventDefault will be ignored
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

  // Resize
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    resizePlacard(w);

    if (isInspecting && inspectRec?.artPlane.material.map) {
      layoutOverlayForTexture(inspectRec.artPlane.material.map);
    }
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  function focusArtwork(id: string) {
    const rec = clickableMeshes.find((m) => m.artwork.id === id);
    if (!rec) return;
    startInspect(rec);
  }

  function clearFocus() {
    cancelInspect();

    yawObj.position.set(0, 1.55, 6.6);
    yaw = 0;
    pitch = 0;
    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;
  }

  function animate() {
    if (disposed) return;

    // animate inspect camera motion to avoid harsh snap
    if (isInspecting && inspectRec) {
      inspectT = clamp(inspectT + 1 / 60 / 1.0, 0, 1); // about 1s
      const t = easeInOutCubic(inspectT);

      yawObj.position.lerpVectors(inspectFromPos, inspectToPos, t);
      yaw = lerp(inspectFromYaw, inspectToYaw, t);
      pitch = lerp(inspectFromPitch, inspectToPitch, t);

      yawObj.rotation.y = yaw;
      pitchObj.rotation.x = pitch;

      // once finished, keep stable
      if (inspectT >= 1) {
        isInspecting = false;
      }
    }

    renderer.render(scene, camera);

    // When inspecting, render overlay artwork on top for pixel-perfect, no perspective
    if (inspectRec?.artPlane.material.map) {
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(overlayScene, overlayCam);
      renderer.autoClear = true;
    }

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

    overlayScene.traverse((obj) => {
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
