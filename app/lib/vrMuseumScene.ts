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
  artW: number;
  artH: number;
  outerW: number;
  outerH: number;
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
  const stampsY = opts?.stampsY ?? 12;
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
  console.log('VR_SCENE_VERSION', '2026-02-12-filmOffset-clamp-v1');

  let disposed = false;

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

  // Plaque overlay
  const placard = document.createElement('div');
  placard.style.position = 'absolute';
  placard.style.top = '50%';
  placard.style.right = '18px';
  placard.style.transform = 'translateY(-50%)';
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

  // Camera rig
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);
  camera.filmGauge = 35;

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

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.58,
    metalness: 0.02,
  });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const floorImg = new Image();
  floorImg.src = '/floor.png';
  floorImg.crossOrigin = 'anonymous';

  floorImg.onload = () => {
    if (disposed) return;
    floorMat.map = createStampedFloorTexture(floorImg, {
      size: 2048,
      stampsX: 6,
      stampsY: 12,
      seed: 424242,
      overlapPct: 0.30,
      jitterPct: 0.06,
      alpha: 0.95,
    });
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

  // Window wall and vista
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

  const topBorder = new THREE.Mesh(new THREE.BoxGeometry(openingW, frameBorder, frameDepth), frameMat);
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

  const leftBorder2 = new THREE.Mesh(new THREE.BoxGeometry(frameBorder, openingH, frameDepth), frameMat);
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

  for (let c = 1; c < 4; c++) {
    const x = -openingW / 2 + (openingW * c) / 4;
    const v = new THREE.Mesh(
      new THREE.BoxGeometry(mullionT, openingH - frameBorder * 1.6, frameDepth),
      frameMat
    );
    v.position.set(x, openingBottom + openingH / 2, backZ + frameDepth / 2);
    v.castShadow = true;
    windowWall.add(v);
  }

  const midY = openingBottom + openingH / 2;
  const hM = new THREE.Mesh(
    new THREE.BoxGeometry(openingW - frameBorder * 1.6, mullionT, frameDepth),
    frameMat
  );
  hM.position.set(0, midY, backZ + frameDepth / 2);
  hM.castShadow = true;
  windowWall.add(hM);

  const vistaTex = new THREE.TextureLoader().load('/hamptons.jpg', (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 12);
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
  });

  const vista = new THREE.Mesh(
    new THREE.PlaneGeometry(openingW * 1.55, openingH * 1.55),
    new THREE.MeshBasicMaterial({ map: vistaTex, toneMapped: false })
  );
  vista.position.set(0, openingBottom + openingH / 2, backZ - 1.2);
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

    const outerW = artW + frameT;
    const outerH = artH + frameT;

    const outer = new THREE.Mesh(new THREE.BoxGeometry(outerW, outerH, depth), frameOuterMat);
    outer.castShadow = true;
    outer.receiveShadow = true;
    g.add(outer);

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.006), matteMat);
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
      outerW,
      outerH,
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

  // Focus animation state
  const clock = new THREE.Clock();

  let focusActive = false;
  let focusTime = 0;
  let focusDuration = 1.25;
  let focusTargetRec: ArtMeshRecord | null = null;

  const focusFrom = {
    pos: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    fov: 55,
    filmOffset: 0,
  };

  const focusTo = {
    pos: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    fov: 22,
    filmOffset: 0,
  };

  function cancelFocus() {
    focusActive = false;
    focusTargetRec = null;
  }

  function startFocusOnRecord(rec: ArtMeshRecord) {
    cancelFocus();

    showPlacard(rec.artwork);

    // Measure plaque width without flashing it
    placard.style.visibility = 'hidden';
    placard.style.opacity = '1';
    void placard.getBoundingClientRect();
    const plaqueW = placard.getBoundingClientRect().width || 290;
    placard.style.opacity = '0';
    placard.style.visibility = 'visible';

    focusActive = true;
    focusTargetRec = rec;
    focusTime = 0;
    focusDuration = 1.25;

    focusFrom.pos.copy(yawObj.position);
    focusFrom.yaw = yaw;
    focusFrom.pitch = pitch;
    focusFrom.fov = camera.fov;
    focusFrom.filmOffset = camera.filmOffset || 0;

    // Fit based on OUTER frame
    const frameW = rec.outerW;
    const frameH = rec.outerH;

    const worldCenter = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldCenter);

    const normalOut = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(rec.frameGroup.quaternion)
      .normalize();

    // Viewport math
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);

    // Pixels in DOM overlay space
    const margin = 18;
    const gap = 12;
    const rightPad = 18;
    const leftPad = 12;

    // Rectangle where the painting must fit
    const regionLeft = leftPad + margin;
    const regionRight = w - (plaqueW + gap + rightPad) - margin;
    const regionTop = margin;
    const regionBottom = h - margin;

    const regionW = Math.max(1, regionRight - regionLeft);
    const regionH = Math.max(1, regionBottom - regionTop);

    const usableWidthRatio = regionW / w;
    const usableHeightRatio = regionH / h;

    // Camera optics for focus
    const targetFov = 22;
    focusTo.fov = targetFov;

    const vFov = (targetFov * Math.PI) / 180;
    const aspect = w / h;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    // Distances to fit frame in the usable region
    const distForHeight = (frameH / 2) / (Math.tan(vFov / 2) * usableHeightRatio);
    const distForWidth = (frameW / 2) / (Math.tan(hFov / 2) * usableWidthRatio);

    const dist = Math.max(distForHeight, distForWidth) * 1.12;

    // Position camera straight out from the artwork center (no sideways move)
    focusTo.pos.copy(worldCenter).add(normalOut.clone().multiplyScalar(dist));
    focusTo.pos.y = worldCenter.y;

    // Yaw toward center, no pitch
    const lookDir = worldCenter.clone().sub(focusTo.pos);
    lookDir.y = 0;
    lookDir.normalize();

    focusTo.yaw = Math.atan2(-lookDir.x, -lookDir.z);
    focusTo.pitch = 0;

    // Lens shift so ART CENTER lands in the center of the usable region
    const regionCenterPx = (regionLeft + regionRight) / 2;
    const desiredCenterNdcX = (regionCenterPx / w) * 2 - 1;

    const filmWidth = camera.getFilmWidth();
    const filmOffsetMm = (desiredCenterNdcX * filmWidth) / 2;

    // Reduce how hard we shift, then clamp so it can never shove the art off screen
    const shiftStrength = 0.85;
    const maxShift = filmWidth * 0.22;
    const targetOffset = (-filmOffsetMm) * shiftStrength;

    focusTo.filmOffset = clamp(targetOffset, -maxShift, maxShift);

    placard.style.opacity = '0';
  }

  // Controls
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  function onPointerDown(e: PointerEvent) {
    cancelFocus();
    hidePlacard();

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
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const targets = clickableMeshes.map((m) => m.clickable);
      const hits = raycaster.intersectObjects(targets, true);

      if (hits.length) {
        const hit = hits[0].object;
        const id = (hit.userData?.__artworkId as string) ?? '';
        const rec = clickableMeshes.find((m) => m.artwork.id === id);
        if (rec) startFocusOnRecord(rec);
      }
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (focusActive) return;

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
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  resize();

  function focusArtwork(id: string) {
    const rec = clickableMeshes.find((m) => m.artwork.id === id);
    if (!rec) return;
    startFocusOnRecord(rec);
  }

  function clearFocus() {
    cancelFocus();
    hidePlacard();

    yawObj.position.set(0, 1.55, 6.6);
    yaw = 0;
    pitch = 0;

    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;

    camera.fov = 55;
    camera.filmOffset = 0;
    camera.updateProjectionMatrix();
  }

  // Render loop
  function animate() {
    if (disposed) return;

    const dt = clock.getDelta();

    if (focusActive) {
      focusTime += dt;
      const t = clamp(focusTime / focusDuration, 0, 1);

      placard.style.opacity = String(clamp((t - 0.35) / 0.35, 0, 1));

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
      camera.filmOffset = lerp(focusFrom.filmOffset, focusTo.filmOffset, e);
      camera.updateProjectionMatrix();

      if (t >= 1) {
        focusActive = false;
      }
    }

    renderer.render(scene, camera);
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
