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
 * VR Museum Scene (Jeff baseline + room realism pass)
 *
 * What this version does:
 * - Keeps Jeff-style bright museum look (no dark cave, no mystery hotspot)
 * - Stark white walls
 * - Light wood floor with a staggered plank pattern and subtle grain
 * - Big modern window wall at one end with a simple Hamptons-style outdoor backdrop
 * - Click artwork to open your existing details modal (no camera zoom yet)
 *
 * Notes:
 * - Artwork plane stays MeshBasicMaterial so art color is always correct
 * - Lighting + shadows stay conservative to avoid floor blobs
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
  renderer.toneMappingExposure = 1.08;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Cross-version: typings may not include this in your installed three
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
  scene.background = new THREE.Color('#e9eaec'); // bright neutral
  scene.fog = new THREE.Fog(new THREE.Color('#e9eaec'), 26, 110);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 180);
  camera.position.set(0, 1.55, 6.6);

  // ---------------------------
  // Room dimensions
  // ---------------------------
  const roomW = 14;
  const roomH = 4.2;
  const roomD = 28;

  const room = new THREE.Group();
  scene.add(room);

  // ---------------------------
  // Procedural textures (floor + outdoor)
  // ---------------------------
  function makeFloorTextures() {
    // Texture resolution (keep reasonable for load time)
    const texW = 2048;
    const texH = 2048;

    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = texW;
    colorCanvas.height = texH;
    const colorCtx = colorCanvas.getContext('2d');
    if (!colorCtx) {
      // Very defensive fallback so TS and runtime are happy
      const fallback = new THREE.Texture();
      fallback.needsUpdate = true;
      return { colorTex: fallback, bumpTex: fallback };
    }

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = texW;
    bumpCanvas.height = texH;
    const bumpCtx = bumpCanvas.getContext('2d');
    if (!bumpCtx) {
      const fallback = new THREE.Texture();
      fallback.needsUpdate = true;
      return { colorTex: new THREE.CanvasTexture(colorCanvas), bumpTex: fallback };
    }

    // Base tone similar to your reference image
    colorCtx.fillStyle = '#cfa56b';
    colorCtx.fillRect(0, 0, texW, texH);

    bumpCtx.fillStyle = 'rgb(128,128,128)';
    bumpCtx.fillRect(0, 0, texW, texH);

    // Plank sizing in "texture space"
    const plankWidth = Math.floor(texW / 10); // ~10 planks across
    const minLen = Math.floor(texH / 6); // long planks
    const maxLen = Math.floor(texH / 3);

    // Random helper
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    // Draw per plank with staggered joints
    // Grain runs along the long axis (Y in texture). Planks run "depth" direction in the room.
    const rows = Math.ceil(texW / plankWidth);

    // Keep joints offset by at least ~6 to 10 inches equivalent (in texture, a fraction of plank length)
    // We simulate by ensuring adjacent row joint positions differ enough.
    const prevRowJoints: number[] = [];

    for (let r = 0; r < rows; r++) {
      const x0 = r * plankWidth;
      const w = plankWidth + 1;

      // Create segments down the plank (staggered lengths)
      let y = 0;

      // Slight row-to-row tone variance
      const rowWarm = rand(-0.06, 0.06);
      const rowLight = rand(-0.07, 0.07);

      const rowJoints: number[] = [];

      // If not first row, start with a random offset so joints do not align
      if (r > 0) {
        const offset = rand(minLen * 0.2, minLen * 0.75);
        y -= offset;
      }

      while (y < texH) {
        const segLen = Math.floor(rand(minLen, maxLen));
        const y0 = y;
        const y1 = y + segLen;

        // Joint recording (ignore negative start)
        if (y0 > 0 && y0 < texH) rowJoints.push(y0);

        // Ensure joint offsets from previous row
        if (r > 0 && y0 > 0 && prevRowJoints.length) {
          const nearest = prevRowJoints.reduce((best, j) => (Math.abs(j - y0) < Math.abs(best - y0) ? j : best), prevRowJoints[0]);
          // If too close, nudge length
          if (Math.abs(nearest - y0) < minLen * 0.22) {
            // Push joint away a bit
            y += Math.floor(minLen * 0.22);
          }
        }

        // Segment color variation
        const segVar = rand(-0.10, 0.10);
        const light = clamp01(0.62 + rowLight + segVar);
        const warm = clamp01(0.55 + rowWarm + segVar * 0.5);

        // Build a warm wood-ish color in HSL space
        // Hue around 35 degrees, modest saturation
        const hue = 32 + rand(-4, 4);
        const sat = 35 + rand(-8, 8);
        const lum = 35 + light * 30; // 35..65
        colorCtx.fillStyle = `hsl(${hue} ${sat}% ${lum}%)`;

        const drawY0 = Math.max(0, y0);
        const drawH = Math.min(texH, y1) - drawY0;
        if (drawH > 0) {
          colorCtx.fillRect(x0, drawY0, w, drawH);

          // Subtle end joint dark line
          colorCtx.fillStyle = 'rgba(40,24,14,0.10)';
          colorCtx.fillRect(x0, drawY0, w, 2);

          // Plank edge seam
          colorCtx.fillStyle = 'rgba(20,12,8,0.09)';
          colorCtx.fillRect(x0, drawY0, 2, drawH);
          colorCtx.fillRect(x0 + w - 2, drawY0, 2, drawH);

          // Grain: vertical strokes along Y (long side), not horizontal
          const grainCount = 140;
          for (let g = 0; g < grainCount; g++) {
            const gx = x0 + rand(6, w - 6);
            const alpha = rand(0.02, 0.07);
            const gh = Math.floor(drawH * rand(0.35, 0.95));
            const gy = drawY0 + Math.floor(rand(0, Math.max(1, drawH - gh)));

            colorCtx.fillStyle = `rgba(60,40,20,${alpha})`;
            colorCtx.fillRect(gx, gy, 1, gh);

            // Bump grain (slight)
            const bump = 128 + Math.floor(rand(-10, 10));
            bumpCtx.fillStyle = `rgb(${bump},${bump},${bump})`;
            bumpCtx.fillRect(gx, gy, 1, gh);
          }

          // Occasional knots
          if (Math.random() < 0.18) {
            const kx = x0 + rand(w * 0.15, w * 0.85);
            const ky = drawY0 + rand(drawH * 0.15, drawH * 0.85);
            const kr = rand(6, 16);

            // Knot color
            colorCtx.beginPath();
            colorCtx.fillStyle = 'rgba(80,55,35,0.18)';
            colorCtx.arc(kx, ky, kr, 0, Math.PI * 2);
            colorCtx.fill();

            // Knot bump
            bumpCtx.beginPath();
            bumpCtx.fillStyle = 'rgb(118,118,118)';
            bumpCtx.arc(kx, ky, kr, 0, Math.PI * 2);
            bumpCtx.fill();
          }
        }

        y += segLen;
      }

      // Remember joints for next row
      prevRowJoints.length = 0;
      prevRowJoints.push(...rowJoints);
    }

    // Mild vignette to break the too-perfect look
    const grad = colorCtx.createRadialGradient(texW / 2, texH / 2, texW * 0.1, texW / 2, texH / 2, texW * 0.8);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.06)');
    colorCtx.fillStyle = grad;
    colorCtx.fillRect(0, 0, texW, texH);

    const colorTex = new THREE.CanvasTexture(colorCanvas);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.RepeatWrapping;

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.colorSpace = THREE.NoColorSpace;
    bumpTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;

    // Repeat so planks feel properly sized in world space
    colorTex.repeat.set(roomW / 3.4, roomD / 7.2);
    bumpTex.repeat.copy(colorTex.repeat);

    colorTex.needsUpdate = true;
    bumpTex.needsUpdate = true;

    return { colorTex, bumpTex };
  }

  function makeOutdoorBackdropTexture() {
    const w = 2048;
    const h = 1024;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const t = new THREE.Texture();
      t.needsUpdate = true;
      return t;
    }

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#bfe3ff');
    sky.addColorStop(0.55, '#dff2ff');
    sky.addColorStop(1, '#f7fbff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Distant haze near horizon
    const haze = ctx.createLinearGradient(0, h * 0.42, 0, h * 0.72);
    haze.addColorStop(0, 'rgba(255,255,255,0)');
    haze.addColorStop(1, 'rgba(255,255,255,0.55)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, h * 0.35, w, h * 0.55);

    // Sea band
    ctx.fillStyle = '#7fb6d6';
    ctx.fillRect(0, h * 0.62, w, h * 0.12);

    // Subtle sea shimmer
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * w;
      const y = h * (0.62 + Math.random() * 0.11);
      const a = 0.05 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(x, y, 30 + Math.random() * 80, 1);
    }

    // Tree line silhouettes
    ctx.fillStyle = '#5f7f5f';
    ctx.fillRect(0, h * 0.56, w, h * 0.06);

    // Tree blobs
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * w;
      const y = h * (0.50 + Math.random() * 0.12);
      const rx = 30 + Math.random() * 90;
      const ry = 14 + Math.random() * 38;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(70,105,70,${0.22 + Math.random() * 0.18})`;
      ctx.fill();
    }

    // Bright sun area
    const sun = ctx.createRadialGradient(w * 0.75, h * 0.18, 10, w * 0.75, h * 0.18, 240);
    sun.addColorStop(0, 'rgba(255,255,255,0.95)');
    sun.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  const { colorTex: floorColorTex, bumpTex: floorBumpTex } = makeFloorTextures();
  const outdoorTex = makeOutdoorBackdropTexture();

  // ---------------------------
  // Materials
  // ---------------------------
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.95,
    metalness: 0.0,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fbfbfb'),
    roughness: 0.98,
    metalness: 0.0,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.62,
    metalness: 0.02,
    map: floorColorTex,
    bumpMap: floorBumpTex,
    bumpScale: 0.06,
  });

  // ---------------------------
  // Room geometry
  // ---------------------------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.y = roomH;
  ceiling.rotation.x = Math.PI / 2;
  room.add(ceiling);

  // We will make the "back wall" a window wall (glass + mullions + outdoor plane)
  // and keep the other walls as standard.
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
    color: new THREE.Color('#f2f2f2'),
    roughness: 0.85,
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

  // No baseboard on back wall because it's windows
  addBaseboardAlongWall(roomW, 0, roomD / 2 - baseboardT / 2, 0);
  addBaseboardAlongWall(roomD, -roomW / 2 + baseboardT / 2, 0, Math.PI / 2);
  addBaseboardAlongWall(roomD, roomW / 2 - baseboardT / 2, 0, Math.PI / 2);

  // ---------------------------
  // Window wall (back end)
  // ---------------------------
  const windowGroup = new THREE.Group();
  windowGroup.position.set(0, 0, -roomD / 2 + 0.001);
  room.add(windowGroup);

  // Outdoor plane behind glass (slightly behind the window wall so no z-fighting)
  const outside = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW + 2.5, roomH + 1.6),
    new THREE.MeshBasicMaterial({
      map: outdoorTex,
    })
  );
  outside.position.set(0, roomH / 2, -0.22);
  windowGroup.add(outside);

  // Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.08,
    metalness: 0.0,
    transmission: 1.0,
    thickness: 0.04,
    ior: 1.5,
    transparent: true,
    opacity: 1.0,
  });

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), glassMat);
  glass.position.set(0, roomH / 2, 0);
  windowGroup.add(glass);

  // Mullions / frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d9dadd'),
    roughness: 0.55,
    metalness: 0.1,
  });

  const frameDepth = 0.06;
  const frameThick = 0.08;

  // Outer border
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(roomW, frameThick, frameDepth), frameMat);
  topFrame.position.set(0, roomH - frameThick / 2, 0.02);
  windowGroup.add(topFrame);

  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(roomW, frameThick, frameDepth), frameMat);
  bottomFrame.position.set(0, frameThick / 2, 0.02);
  windowGroup.add(bottomFrame);

  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, roomH, frameDepth), frameMat);
  leftFrame.position.set(-roomW / 2 + frameThick / 2, roomH / 2, 0.02);
  windowGroup.add(leftFrame);

  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, roomH, frameDepth), frameMat);
  rightFrame.position.set(roomW / 2 - frameThick / 2, roomH / 2, 0.02);
  windowGroup.add(rightFrame);

  // Vertical mullions
  const mullionCount = 4; // big contemporary panes
  for (let i = 1; i < mullionCount; i++) {
    const x = -roomW / 2 + (roomW / mullionCount) * i;
    const m = new THREE.Mesh(new THREE.BoxGeometry(frameThick * 0.6, roomH - frameThick * 2, frameDepth * 0.9), frameMat);
    m.position.set(x, roomH / 2, 0.02);
    windowGroup.add(m);
  }

  // Horizontal mullions
  const horizCount = 2;
  for (let i = 1; i < horizCount + 1; i++) {
    const y = (roomH / (horizCount + 1)) * i;
    const m = new THREE.Mesh(new THREE.BoxGeometry(roomW - frameThick * 2, frameThick * 0.55, frameDepth * 0.9), frameMat);
    m.position.set(0, y, 0.02);
    windowGroup.add(m);
  }

  // ---------------------------
  // Lighting (keep bright + believable)
  // ---------------------------
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8fa1b3, 0.7);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.28);
  scene.add(ambient);

  // Directional "sun" coming from the window wall into the room
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(3, 7.5, -10);
  sun.castShadow = true;

  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 90;
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;

  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.02;

  const sunTarget = new THREE.Object3D();
  sunTarget.position.set(0, 1.6, 2);
  scene.add(sunTarget);
  sun.target = sunTarget;
  scene.add(sun);

  // Gentle fill opposite
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(-8, 6, 10);
  scene.add(fill);

  // Ceiling track (subtle, no black bar)
  const trackMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f3f3f3'),
    roughness: 0.55,
    metalness: 0.08,
  });

  const track = new THREE.Mesh(new THREE.BoxGeometry(roomW - 1.8, 0.05, 0.05), trackMat);
  track.position.set(0, roomH - 0.28, 0);
  room.add(track);

  // Small spot heads with light cones (no floor shadow artifacts)
  const headMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e9e9e9'),
    roughness: 0.4,
    metalness: 0.1,
  });

  const heads = new THREE.Group();
  heads.position.set(0, roomH - 0.33, 0);
  room.add(heads);

  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const x = THREE.MathUtils.lerp(-roomW * 0.35, roomW * 0.35, t);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.12, 16), headMat);
    head.position.set(x, 0, 0);
    head.rotation.x = Math.PI / 2;
    heads.add(head);

    const s = new THREE.SpotLight(0xffffff, 0.55, 10, Math.PI / 7, 0.75, 1.0);
    s.position.set(x, 0.02, 0);
    s.target.position.set(x, -2.0, 0);
    s.castShadow = false;
    heads.add(s);
    heads.add(s.target);
  }

  // ---------------------------
  // Texture loading (art)
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
    color: new THREE.Color('#ffffff'),
    roughness: 0.98,
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

    const matte = new THREE.Mesh(new THREE.BoxGeometry(artW + 0.03, artH + 0.03, 0.005), frameInnerMat);
    matte.position.z = depth / 2 + 0.004;
    group.add(matte);

    // Artwork plane: always bright and true (art is the star)
    const artMat = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x2b2b2b,
      map: texture ?? undefined,
    });

    const art = new THREE.Mesh(new THREE.PlaneGeometry(artW, artH), artMat);
    art.position.z = depth / 2 + 0.011;
    art.userData = { artworkId: artwork.id, width: artW, height: artH };
    group.add(art);

    artMeshById.set(artwork.id, art);

    // Small wall wash per piece (no shadows)
    const spot = new THREE.SpotLight(0xffffff, 0.55, 10, Math.PI / 8, 0.7, 1.0);
    spot.position.set(0, 3.9, 1.45);
    spot.target = art;
    spot.castShadow = false;
    group.add(spot);
    group.add(spot.target);

    framesGroup.add(group);
  }

  // Layout: right wall then left wall (keeps window wall clear)
  const placements: Array<{ pos: THREE.Vector3; rotY: number }> = [];
  const y = 2.05;

  for (let i = 0; i < Math.min(artworks.length, 6); i++) {
    const z = 9 - i * 5.2;
    placements.push({
      pos: new THREE.Vector3(roomW / 2 - 0.06, y, z),
      rotY: -Math.PI / 2,
    });
  }

  for (let i = 6; i < Math.min(artworks.length, 12); i++) {
    const idx = i - 6;
    const z = 9 - idx * 5.2;
    placements.push({
      pos: new THREE.Vector3(-roomW / 2 + 0.06, y, z),
      rotY: Math.PI / 2,
    });
  }

  // Build async
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

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
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
  // Click raycast (open modal)
  // ---------------------------
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let didDrag = false;
  let downX = 0;
  let downY = 0;

  function onClickPointerDown(e: PointerEvent) {
    didDrag = false;
    downX = e.clientX;
    downY = e.clientY;
  }

  function onClickPointerMove(e: PointerEvent) {
    if (Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4) didDrag = true;
  }

  function onClickPointerUp(e: PointerEvent) {
    if (didDrag) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y2 = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouse.set(x, y2);
    raycaster.setFromCamera(mouse, camera);

    const artMeshes = Array.from(artMeshById.values());
    const hits = raycaster.intersectObjects(artMeshes, false);
    if (!hits.length) return;

    const hit = hits[0].object as THREE.Mesh;
    const artworkId = (hit.userData as any)?.artworkId as string | undefined;
    if (!artworkId) return;

    const artwork = artworkById.get(artworkId);
    if (artwork) onArtworkClick?.(artwork);
  }

  renderer.domElement.addEventListener('pointerdown', onClickPointerDown);
  renderer.domElement.addEventListener('pointermove', onClickPointerMove);
  renderer.domElement.addEventListener('pointerup', onClickPointerUp);

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
  // Focus API (no zoom for now)
  // ---------------------------
  function focusArtwork(_artworkId: string) {
    // Intentionally no-op in this "room dial in" phase.
    // VrMuseumClient opens the modal and you can add zoom later.
  }

  function clearFocus() {
    // no-op
  }

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

    renderer.domElement.removeEventListener('pointerdown', onClickPointerDown);
    renderer.domElement.removeEventListener('pointermove', onClickPointerMove);
    renderer.domElement.removeEventListener('pointerup', onClickPointerUp);

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();

      const mat = (mesh as any).material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          if (m.map) m.map.dispose?.();
          if ((m as any).bumpMap) (m as any).bumpMap.dispose?.();
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
