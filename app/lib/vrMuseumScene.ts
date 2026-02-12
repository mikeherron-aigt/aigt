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
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
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
    size?: number; // canvas size (power of two recommended)
    stamps?: number; // how many tiles across/down
    seed?: number;
    overlapPct?: number; // overlap between stamps
    toneJitter?: number; // small brightness variation per stamp
    jitterPct?: number; // small positional jitter
  }
) {
  const size = opts?.size ?? 2048;
  const stamps = opts?.stamps ?? 6;
  const seed = opts?.seed ?? 424242;
  const overlapPct = opts?.overlapPct ?? 0.10;
  const toneJitter = opts?.toneJitter ?? 0.10;
  const jitterPct = opts?.jitterPct ?? 0.06;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Base warm fill
  ctx.fillStyle = '#d3b78b';
  ctx.fillRect(0, 0, size, size);

  const rnd = mulberry32(seed);
  const cell = size / stamps;
  const overlap = cell * overlapPct;

  // Helper to draw a stamp with soft edges so overlaps blend
  const drawFeatheredStamp = (
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) => {
    // Draw stamp into an offscreen canvas so we can feather its alpha
    const oc = document.createElement('canvas');
    oc.width = Math.max(1, Math.floor(dw));
    oc.height = Math.max(1, Math.floor(dh));
    const octx = oc.getContext('2d');
    if (!octx) return;

    octx.drawImage(image, sx, sy, sw, sh, 0, 0, oc.width, oc.height);

    // Feather alpha at the edges
    const feather = Math.floor(Math.min(oc.width, oc.height) * 0.06);
    octx.globalCompositeOperation = 'destination-in';

    // left
    {
      const g = octx.createLinearGradient(0, 0, feather, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,1)');
      octx.fillStyle = g;
      octx.fillRect(0, 0, feather, oc.height);
    }
    // right
    {
      const g = octx.createLinearGradient(oc.width - feather, 0, oc.width, 0);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      octx.fillStyle = g;
      octx.fillRect(oc.width - feather, 0, feather, oc.height);
    }
    // top
    {
      const g = octx.createLinearGradient(0, 0, 0, feather);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,1)');
      octx.fillStyle = g;
      octx.fillRect(0, 0, oc.width, feather);
    }
    // bottom
    {
      const g = octx.createLinearGradient(0, oc.height - feather, 0, oc.height);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      octx.fillStyle = g;
      octx.fillRect(0, oc.height - feather, oc.width, feather);
    }

    octx.globalCompositeOperation = 'source-over';

    // Draw into final canvas
    ctx.drawImage(oc, dx, dy, dw, dh);
  };

  for (let y = 0; y < stamps; y++) {
    for (let x = 0; x < stamps; x++) {
      const cx = x * cell + cell / 2;
      const cy = y * cell + cell / 2;

      // Rotation in 90 degree steps helps hide obvious repetition
      const rotSteps = Math.floor(rnd() * 4);
      const rot = rotSteps * (Math.PI / 2);

      // Slight per-stamp brightness variation
      const b = 1 - toneJitter / 2 + rnd() * toneJitter;

      // small jitter
      const jx = (rnd() - 0.5) * cell * jitterPct;
      const jy = (rnd() - 0.5) * cell * jitterPct;

      const w = cell + overlap * 2;
      const h = cell + overlap * 2;

      ctx.save();
      ctx.translate(cx + jx, cy + jy);
      ctx.rotate(rot);

      // Stamp the full source image into each cell.
      // If your source has obvious borders, we can crop here instead.
      const dx = -w / 2;
      const dy = -h / 2;

      // Draw with feathering so overlaps blend
      drawFeatheredStamp(0, 0, image.width, image.height, dx, dy, w, h);

      // Multiply subtle tone tint
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgba(${Math.floor(255 * b)},${Math.floor(255 * b)},${Math.floor(
        255 * b
      )},0.22)`;
      ctx.fillRect(dx, dy, w, h);
      ctx.globalCompositeOperation = 'source-over';

      ctx.restore();
    }
  }

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
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'grab';
  container.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();

  // IMPORTANT: Do NOT use hamptons.jpg as scene.background.
  // Backgrounds are camera-relative and will "move" when you look around.
  scene.background = new THREE.Color('#cfe7ff');

  // Room sizing
  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const room = new THREE.Group();
  scene.add(room);

  // FPS camera rig: yaw (body), pitch (head), camera (eyes)
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);

  const yawObj = new THREE.Object3D();
  const pitchObj = new THREE.Object3D();
  yawObj.add(pitchObj);
  pitchObj.add(camera);
  scene.add(yawObj);

  // Start pose
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
    color: 0xffffff,
    roughness: 0.62,
    metalness: 0.02,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  // Seam-free stamped floor from /floor.png
  const floorImg = new Image();
  floorImg.src = '/floor.png';
  floorImg.crossOrigin = 'anonymous';
  floorImg.onload = () => {
    if (disposed) return;

    const stamped = createStampedFloorTexture(floorImg, {
      size: 2048,
      stamps: 6,
      seed: 424242,
      overlapPct: 0.12,
      toneJitter: 0.10,
      jitterPct: 0.05,
    });

    // Scale the stamped texture across the floor by adjusting UV repeat on the material map
    // Because this is ClampToEdge, we "zoom" by using repeat < 1 and offsets.
    // Easier: set repeat to 1 and adjust texture transform via the floor geometry UVs.
    // For now, keep it 1:1 and tune how the stamp looks using stamps/size above.
    stamped.repeat.set(1, 1);
    stamped.offset.set(0, 0);

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

  // Wall pieces around opening
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

  // Hollow window frame
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

  // Stable outside view
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

  // Optional outside depth, pushed down
  const outsideGroup = new THREE.Group();
  scene.add(outsideGroup);

  const outsideY = -3.0;

  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#cdbb95'),
      roughness: 0.98,
      metalness: 0.0,
    })
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(0, outsideY, backZ - 35);
  outsideGroup.add(sand);

  const ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(340, 340),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2f6f9a'),
      roughness: 0.30,
      metalness: 0.10,
    })
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, outsideY - 0.15, backZ - 120);
  outsideGroup.add(ocean);

  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 95),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    })
  );
  haze.position.set(0, 18, backZ - 155);
  outsideGroup.add(haze);

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

  // Controls
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  function onPointerDown(e: PointerEvent) {
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
        if (rec) onArtworkClick?.(rec.artwork);
      }
    }
  }

  function onWheel(e: WheelEvent) {
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
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  // Resize
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

  function focusArtwork(id: string) {
    const rec = clickableMeshes.find((m) => m.artwork.id === id);
    if (!rec) return;

    const worldPos = new THREE.Vector3();
    rec.frameGroup.getWorldPosition(worldPos);

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rec.frameGroup.quaternion);
    const targetPos = worldPos.clone().add(forward.clone().multiplyScalar(2.6));
    targetPos.y = 1.55;

    yawObj.position.copy(targetPos);

    const lookDir = worldPos.clone().sub(targetPos);
    lookDir.y = 0;
    lookDir.normalize();

    yaw = Math.atan2(-lookDir.x, -lookDir.z);
    pitch = 0;

    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;
  }

  function clearFocus() {
    yawObj.position.set(0, 1.55, 6.6);
    yaw = 0;
    pitch = 0;
    yawObj.rotation.y = yaw;
    pitchObj.rotation.x = pitch;
  }

  function animate() {
    if (disposed) return;
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

    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { dispose, focusArtwork, clearFocus };
}
