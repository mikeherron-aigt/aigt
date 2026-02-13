// app/lib/vrMuseumScene.ts
import * as THREE from "three";
import type { MuseumArtwork } from "@/app/components/VrMuseumEmbed";

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
  // plane that shows the art image (so we can compute aspect + bounds reliably)
  artPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  // full frame bounds in local space for better sizing
  frameBoundsLocal: THREE.Box3;
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

function normalizeUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (!url.startsWith("/")) return `/${url}`;
  return url;
}

function setDomStyles(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles);
}

export function createVrMuseumScene({ container, artworks, onArtworkClick }: CreateArgs): VrMuseumSceneHandle {
  console.log("VR_SCENE_VERSION", "2026-02-13-window-shadow-focus-v1");

  let disposed = false;

  // ----------------------------
  // Renderer
  // ----------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // Prevent the page from scrolling when the mouse wheel is over the museum
  // Important: must be non-passive to call preventDefault.
  const onWheel = (e: WheelEvent) => {
    // Always prevent page scroll while pointer is over the canvas.
    // We still use the wheel for movement or zoom inside the museum.
    e.preventDefault();

    if (focusState.active) {
      // While focused, wheel zooms in/out slightly (dolly) without changing final framing logic.
      const delta = clamp(e.deltaY, -200, 200);
      focusState.userDolly += delta * 0.0009;
      focusState.userDolly = clamp(focusState.userDolly, -0.18, 0.18);
      return;
    }

    // While exploring: wheel moves forward/back
    const delta = clamp(e.deltaY, -200, 200);
    const dir = new THREE.Vector3();
    activeCamera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const step = (delta * 0.006) * -1; // scroll down moves forward
    moveVelocity.addScaledVector(dir, step);
  };
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  // ----------------------------
  // Scene + Camera
  // ----------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9c9c9c);

  const exploreCamera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.05, 250);
  const inspectCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 400);

  let activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera = exploreCamera;

  // Start pose
  exploreCamera.position.set(0, 1.55, 9.5);
  exploreCamera.lookAt(0, 1.45, 0);

  // ----------------------------
  // Room Geometry
  // ----------------------------
  const roomW = 24;
  const roomD = 22;
  const roomH = 6.2;
  const backZ = -roomD * 0.5;
  const frontZ = roomD * 0.5;

  // Floor
  const floorGeo = new THREE.PlaneGeometry(roomW, roomD, 1, 1);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.0,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // Walls (simple)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xa1a1a1, roughness: 1.0, metalness: 0.0 });

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, backZ);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  frontWall.position.set(0, roomH / 2, frontZ);
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Ceiling
  const ceil = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomD),
    new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 1.0 })
  );
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = roomH;
  scene.add(ceil);

  // ----------------------------
  // Window: frame + glass + outside image (hamptons.jpg)
  // ----------------------------
  const windowGroup = new THREE.Group();
  scene.add(windowGroup);

  const windowW = 16.8;
  const windowH = 2.9;
  const windowY = 2.6;

  // Window opening frame
  const frameDepth = 0.15;
  const frameThickness = 0.12;
  const frameColor = new THREE.Color(0x9b9b9b);
  const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.9 });

  const makeFrameBar = (w: number, h: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, frameDepth), frameMat);

  const topBar = makeFrameBar(windowW + frameThickness * 2, frameThickness);
  topBar.position.set(0, windowY + windowH / 2 + frameThickness / 2, backZ + 0.02);
  const botBar = makeFrameBar(windowW + frameThickness * 2, frameThickness);
  botBar.position.set(0, windowY - windowH / 2 - frameThickness / 2, backZ + 0.02);
  const leftBar = makeFrameBar(frameThickness, windowH + frameThickness * 2);
  leftBar.position.set(-windowW / 2 - frameThickness / 2, windowY, backZ + 0.02);
  const rightBar = makeFrameBar(frameThickness, windowH + frameThickness * 2);
  rightBar.position.set(windowW / 2 + frameThickness / 2, windowY, backZ + 0.02);

  windowGroup.add(topBar, botBar, leftBar, rightBar);

  // Window mullions (verticals + middle horizontal)
  const mullionMat = new THREE.MeshStandardMaterial({ color: 0x8c8c8c, roughness: 0.95 });
  const mullionW = 0.06;

  const hMullion = new THREE.Mesh(new THREE.BoxGeometry(windowW, mullionW, frameDepth), mullionMat);
  hMullion.position.set(0, windowY, backZ + 0.03);
  windowGroup.add(hMullion);

  const vCount = 3; // 4 panels = 3 vertical mullions
  for (let i = 1; i <= vCount; i++) {
    const x = -windowW / 2 + (windowW * i) / (vCount + 1);
    const vMullion = new THREE.Mesh(new THREE.BoxGeometry(mullionW, windowH + mullionW, frameDepth), mullionMat);
    vMullion.position.set(x, windowY, backZ + 0.03);
    windowGroup.add(vMullion);
  }

  // Outside image plane (slightly behind the glass)
  const texLoader = new THREE.TextureLoader();
  const hamptonsTex = texLoader.load(normalizeUrl("/hamptons.jpg"));
  hamptonsTex.colorSpace = THREE.SRGBColorSpace;
  hamptonsTex.anisotropy = 8;

  // Add a small blur feel by lowering minFilter/magFilter quality slightly.
  // This is not a true blur, but it helps it feel less like a billboard.
  hamptonsTex.minFilter = THREE.LinearMipmapLinearFilter;
  hamptonsTex.magFilter = THREE.LinearFilter;

  const outsidePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(windowW, windowH),
    new THREE.MeshStandardMaterial({
      map: hamptonsTex,
      roughness: 1.0,
      metalness: 0.0,
    })
  );
  outsidePlane.position.set(0, windowY, backZ - 0.35);
  // Flip so it faces into the room
  outsidePlane.rotation.y = Math.PI;
  outsidePlane.receiveShadow = false;
  outsidePlane.castShadow = false;
  windowGroup.add(outsidePlane);

  // Glass plane (subtle reflect)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.0,
    transmission: 0.7,
    thickness: 0.02,
    transparent: true,
    opacity: 0.35,
    ior: 1.35,
  });
  const glassPlane = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), glassMat);
  glassPlane.position.set(0, windowY, backZ + 0.04);
  // Glass should NOT cast strong shadows
  glassPlane.castShadow = false;
  glassPlane.receiveShadow = false;
  windowGroup.add(glassPlane);

  // ----------------------------
  // Lighting tuned to hamptons.jpg (sun feels on the right side)
  // ----------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Key light coming from the right side of the window, angled into the room
  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  // Right side, slightly above window height, outside-ish
  sun.position.set(18, 4.2, backZ - 6);
  // Aim toward mid-floor, slightly left, deeper into the room
  sun.target.position.set(-3.5, 0.0, 4.5);
  sun.castShadow = true;

  // Shadow tuning: larger frustum and soft radius for longer, fuzzier shadows
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 80;
  sun.shadow.camera.left = -28;
  sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;

  // Softer shadow edges
  sun.shadow.radius = 10;

  // Reduce acne
  sun.shadow.bias = -0.00008;
  sun.shadow.normalBias = 0.02;

  scene.add(sun);
  scene.add(sun.target);

  // Gentle fill from above-left so the room is not dead
  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-10, 10, 8);
  scene.add(fill);

  // ----------------------------
  // Art Frames
  // ----------------------------
  const framesGroup = new THREE.Group();
  scene.add(framesGroup);

  // Place artworks on the right wall for now
  const artWallX = roomW / 2 - 0.02;
  const artBaseY = 2.1;
  const artStartZ = -3.0;
  const artGapZ = 3.3;

  const artRecords: ArtMeshRecord[] = [];

  // Frame look
  const frameOuterMat = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.6 });
  const frameInnerMat = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.6 });

  // For click tests
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  // Helper: create a framed artwork as a group
  function createArtworkFrame(artwork: MuseumArtwork, index: number) {
    const group = new THREE.Group();

    // Use provided aspect ratio if present, otherwise guess 1:1
    const imgW = (artwork as any).image_width ?? 1000;
    const imgH = (artwork as any).image_height ?? 1000;
    const aspect = imgW > 0 && imgH > 0 ? imgW / imgH : 1;

    // World size of visible art plane
    const artHeight = 2.0;
    const artWidth = artHeight * aspect;

    // Frame sizes (breathing room around the art image)
    const frameBorder = 0.12;
    const frameDepth = 0.10;

    const outerW = artWidth + frameBorder * 2;
    const outerH = artHeight + frameBorder * 2;

    // Frame outer
    const outer = new THREE.Mesh(new THREE.BoxGeometry(outerW, outerH, frameDepth), frameOuterMat);
    outer.castShadow = true;
    outer.receiveShadow = true;
    group.add(outer);

    // Frame inner recess
    const inner = new THREE.Mesh(new THREE.BoxGeometry(artWidth + frameBorder * 0.6, artHeight + frameBorder * 0.6, frameDepth * 0.75), frameInnerMat);
    inner.position.z = frameDepth * 0.12;
    inner.castShadow = true;
    inner.receiveShadow = true;
    group.add(inner);

    // Art plane
    const tex = texLoader.load(normalizeUrl(artwork.image_url || ""));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    const artMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.9,
      metalness: 0.0,
    });

    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(artWidth, artHeight), artMat);
    // Sit slightly in front of the inner recess
    artPlane.position.z = frameDepth * 0.52;
    artPlane.castShadow = false;
    artPlane.receiveShadow = false;
    group.add(artPlane);

    // Position on right wall and face inward
    const z = artStartZ + index * artGapZ;
    group.position.set(artWallX, artBaseY, z);
    group.rotation.y = -Math.PI / 2;

    // Clickable object: use the artPlane (best hit target)
    const clickable = artPlane;

    // Frame bounds local for sizing math
    const bounds = new THREE.Box3().setFromObject(outer);
    const boundsLocal = bounds.clone();
    // Convert to local by inverse of group matrix after update
    group.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
    boundsLocal.applyMatrix4(inv);

    framesGroup.add(group);

    const rec: ArtMeshRecord = {
      artwork,
      clickable,
      frameGroup: group,
      artPlane,
      frameBoundsLocal: boundsLocal,
    };
    artRecords.push(rec);
  }

  artworks.forEach((a, i) => createArtworkFrame(a, i));

  // ----------------------------
  // Placard (museum label) overlay
  // ----------------------------
  const placard = document.createElement("div");
  placard.setAttribute("data-museum-placard", "true");
  setDomStyles(placard, {
    position: "absolute",
    right: "5.5%",
    top: "50%",
    transform: "translateY(-50%)",
    width: "min(36vw, 520px)",
    maxWidth: "520px",
    background: "#f3f0e8",
    color: "#1a1a1a",
    padding: "18px 20px",
    boxSizing: "border-box",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "0px",
    boxShadow: "none",
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 220ms ease",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  });

  // Subtle engraved vibe using inset highlights and a faint bevel line
  placard.style.boxShadow =
    "inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.06)";

  placard.innerHTML = `
    <div style="letter-spacing:0.18em; font-size:12px; opacity:0.65; margin-bottom:10px;">MUSEUM LABEL</div>
    <div data-p-artist style="font-size:26px; font-weight:650; margin:0 0 6px 0;">Artist</div>
    <div data-p-title style="font-size:18px; font-style:italic; margin:0 0 14px 0; opacity:0.9;">Title</div>
    <div style="height:1px; background:rgba(0,0,0,0.14); margin: 10px 0 14px 0;"></div>
    <div style="display:grid; grid-template-columns: 120px 1fr; column-gap:18px; row-gap:8px; font-size:16px;">
      <div style="opacity:0.55;">Collection</div>
      <div data-p-collection style="font-weight:520;">Collection</div>

      <div style="opacity:0.55;">Title</div>
      <div data-p-title2 style="font-weight:520;">Title</div>

      <div style="opacity:0.55;">Catalog ID</div>
      <div data-p-id style="font-weight:520;">ID</div>
    </div>
  `;

  // Ensure container can hold absolute overlay
  const prevPos = getComputedStyle(container).position;
  if (prevPos === "static" || !prevPos) {
    container.style.position = "relative";
  }
  container.appendChild(placard);

  function setPlacardForArtwork(a: MuseumArtwork) {
    const artist = (a as any).artist || (a as any).artist_name || "Artist";
    const title = (a as any).title || "Untitled";
    const collection = (a as any).collection || (a as any).collection_name || "Collection";
    const id = (a as any).catalog_id || (a as any).sku || (a as any).id || "";

    const elArtist = placard.querySelector('[data-p-artist]') as HTMLElement | null;
    const elTitle = placard.querySelector('[data-p-title]') as HTMLElement | null;
    const elCollection = placard.querySelector('[data-p-collection]') as HTMLElement | null;
    const elTitle2 = placard.querySelector('[data-p-title2]') as HTMLElement | null;
    const elId = placard.querySelector('[data-p-id]') as HTMLElement | null;

    if (elArtist) elArtist.textContent = String(artist);
    if (elTitle) elTitle.textContent = String(title);
    if (elCollection) elCollection.textContent = String(collection);
    if (elTitle2) elTitle2.textContent = String(title);
    if (elId) elId.textContent = String(id);
  }

  function showPlacard(show: boolean) {
    placard.style.opacity = show ? "1" : "0";
  }

  // ----------------------------
  // Explore controls (drag to look, wheel to move)
  // ----------------------------
  let isPointerDown = false;
  let lastX = 0;
  let lastY = 0;

  // yaw around Y, pitch around X
  let yaw = 0;
  let pitch = 0;

  // movement smoothing
  const moveVelocity = new THREE.Vector3();

  const onPointerDown = (e: PointerEvent) => {
    if (focusState.active) return;

    isPointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    if (focusState.active) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    yaw -= dx * 0.0032;
    pitch -= dy * 0.0032;
    pitch = clamp(pitch, -1.25, 1.25);
  };

  const onPointerUp = (e: PointerEvent) => {
    isPointerDown = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointercancel", onPointerUp);

  // ----------------------------
  // Focus / Inspect logic (pixel-perfect, no snap)
  // Goal: artwork left, placard right, keep aspect ratio, always fully visible.
  // Use OrthographicCamera and compute frustum to fit the entire frame bounds.
  // ----------------------------
  const focusState = {
    active: false,
    animStart: 0,
    animDurMs: 1100,
    fromPos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromQuat: new THREE.Quaternion(),
    toQuat: new THREE.Quaternion(),
    fromZoom: 1,
    toZoom: 1,
    targetId: "" as string,
    targetRec: null as ArtMeshRecord | null,
    userDolly: 0,
    // keep a stable inspect basis
    inspectRight: new THREE.Vector3(),
    inspectUp: new THREE.Vector3(),
    inspectForward: new THREE.Vector3(),
    inspectCenter: new THREE.Vector3(),
  };

  function cancelFocusAndInspect() {
    focusState.active = false;
    focusState.targetId = "";
    focusState.targetRec = null;
    focusState.userDolly = 0;
    activeCamera = exploreCamera;
    showPlacard(false);
  }

  function computeInspectPose(rec: ArtMeshRecord) {
    // World center of the frame group (use bounds for better center)
    rec.frameGroup.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(rec.frameGroup);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    // The artwork normal (facing into the room)
    const forward = new THREE.Vector3(1, 0, 0); // local +X before rotation? safer: derive from group
    rec.frameGroup.getWorldDirection(forward); // this returns -Z direction of object, so we compute normal explicitly
    // Better: compute normal using group's world matrix basis.
    const basis = new THREE.Matrix3().setFromMatrix4(rec.frameGroup.matrixWorld);
    const xAxis = new THREE.Vector3(1, 0, 0).applyMatrix3(basis).normalize(); // local X axis in world
    const zAxis = new THREE.Vector3(0, 0, 1).applyMatrix3(basis).normalize(); // local Z axis in world
    // The frame faces along its local +Z for the artPlane, but the whole group is rotated.
    // Our artPlane is a PlaneGeometry facing +Z. So its normal is group's local +Z in world.
    const normal = zAxis.clone().normalize();

    // Place camera slightly in front of the art (toward the room)
    const distance = 2.4; // will be refined by ortho frustum sizing, this is just for depth separation
    const camPos = center.clone().add(normal.clone().multiplyScalar(distance));

    // Camera should look at the center
    const lookAt = center.clone();

    // Build a stable camera orientation: up is world up
    const up = new THREE.Vector3(0, 1, 0);

    // Compute right axis so we can offset the art to the left on screen
    const right = new THREE.Vector3().crossVectors(up, normal).normalize();
    const trueUp = new THREE.Vector3().crossVectors(normal, right).normalize();

    // We want the artwork to sit on the left side of the screen, with the placard on the right.
    // With an orthographic camera, we can shift the camera's "center" (lookAt) slightly to the right,
    // which pushes the artwork left on screen.
    const screenOffsetRight = 0.22; // normalized-ish, refined below with viewport sizing
    const offset = right.clone().multiplyScalar(screenOffsetRight * Math.max(size.x, size.y));

    const shiftedLookAt = lookAt.clone().add(offset);
    const shiftedCamPos = camPos.clone().add(offset);

    // Save basis
    focusState.inspectRight.copy(right);
    focusState.inspectUp.copy(trueUp);
    focusState.inspectForward.copy(normal);
    focusState.inspectCenter.copy(lookAt);

    return { camPos: shiftedCamPos, lookAt: shiftedLookAt, bounds, boundsCenter: center, boundsSize: size, normal, right, up: trueUp };
  }

  function fitOrthoToFrame(rec: ArtMeshRecord) {
    // We compute camera frustum so that the entire frame is visible,
    // while keeping a little breathing room around the black frame.
    const { boundsSize } = computeInspectPose(rec);

    const viewportW = container.clientWidth;
    const viewportH = container.clientHeight;

    // Reserve space on the right for the placard (roughly)
    // We keep the art fully visible in the remaining width.
    const placardFrac = 0.34; // approx. placard width share
    const gapFrac = 0.03; // spacing between art and placard
    const usableW = viewportW * (1 - placardFrac - gapFrac);
    const usableH = viewportH;

    const usableAspect = usableW / usableH;

    // boundsSize is in world units. We fit its width/height into usableAspect.
    const frameW = boundsSize.x;
    const frameH = boundsSize.y;

    const breathing = 1.06; // slight breathing room
    const targetW = frameW * breathing;
    const targetH = frameH * breathing;

    // Fit into usable viewport
    const neededHalfW = (targetW / 2);
    const neededHalfH = (targetH / 2);

    // Convert to full frustum by aspect constraints
    let halfW = neededHalfW;
    let halfH = neededHalfH;

    // Ensure the frame fits both dimensions under usable aspect
    const currentAspect = halfW / halfH;
    if (currentAspect > usableAspect) {
      // too wide, increase height
      halfH = halfW / usableAspect;
    } else {
      // too tall, increase width
      halfW = halfH * usableAspect;
    }

    inspectCamera.left = -halfW;
    inspectCamera.right = halfW;
    inspectCamera.top = halfH;
    inspectCamera.bottom = -halfH;

    inspectCamera.near = 0.01;
    inspectCamera.far = 400;
    inspectCamera.zoom = 1;

    inspectCamera.updateProjectionMatrix();
  }

  function focusArtworkByRecord(rec: ArtMeshRecord) {
    focusState.active = true;
    focusState.animStart = performance.now();
    focusState.targetId = String((rec.artwork as any).id ?? (rec.artwork as any).sku ?? "");
    focusState.targetRec = rec;
    focusState.userDolly = 0;

    // From: current explore camera
    focusState.fromPos.copy(exploreCamera.position);
    focusState.fromQuat.copy(exploreCamera.quaternion);
    focusState.fromZoom = 1;

    // Configure inspect camera frustum to guarantee full art visibility
    fitOrthoToFrame(rec);

    // Compute inspect pose
    const pose = computeInspectPose(rec);

    // To: inspect camera placed in front, oriented flat
    inspectCamera.position.copy(pose.camPos);
    inspectCamera.up.set(0, 1, 0);
    inspectCamera.lookAt(pose.lookAt);
    inspectCamera.updateMatrixWorld(true);

    focusState.toPos.copy(inspectCamera.position);
    focusState.toQuat.copy(inspectCamera.quaternion);
    focusState.toZoom = 1;

    // Start inspect camera as a copy of explore camera, then animate to ortho pose
    inspectCamera.position.copy(focusState.fromPos);
    inspectCamera.quaternion.copy(focusState.fromQuat);
    inspectCamera.zoom = 1;
    inspectCamera.updateProjectionMatrix();
    inspectCamera.updateMatrixWorld(true);

    activeCamera = inspectCamera;

    setPlacardForArtwork(rec.artwork);
    showPlacard(true);

    if (onArtworkClick) onArtworkClick(rec.artwork);
  }

  function focusArtwork(id: string) {
    const rec = artRecords.find((r) => String((r.artwork as any).id ?? (r.artwork as any).sku ?? "") === id);
    if (!rec) return;
    focusArtworkByRecord(rec);
  }

  function clearFocus() {
    cancelFocusAndInspect();
  }

  // ----------------------------
  // Click artwork
  // ----------------------------
  function onClickCanvas(e: PointerEvent) {
    if (focusState.active) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerNdc.set(x, y);

    raycaster.setFromCamera(pointerNdc, exploreCamera);

    const clickables = artRecords.map((r) => r.clickable);
    const hits = raycaster.intersectObjects(clickables, true);
    if (!hits.length) return;

    const hitObj = hits[0].object;
    const rec = artRecords.find((r) => r.clickable === hitObj || r.clickable.children.includes(hitObj));
    if (!rec) return;

    focusArtworkByRecord(rec);
  }

  renderer.domElement.addEventListener("click", onClickCanvas);

  // ----------------------------
  // Resize handling
  // ----------------------------
  const ro = new ResizeObserver(() => {
    if (disposed) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    exploreCamera.aspect = w / h;
    exploreCamera.updateProjectionMatrix();

    if (focusState.active && focusState.targetRec) {
      fitOrthoToFrame(focusState.targetRec);
    }
  });
  ro.observe(container);

  // ----------------------------
  // Animation loop
  // ----------------------------
  const tmpDir = new THREE.Vector3();

  function animate() {
    if (disposed) return;

    // Explore camera orientation
    if (!focusState.active) {
      // Apply look
      const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
      exploreCamera.quaternion.copy(qYaw).multiply(qPitch);

      // Apply movement velocity with damping
      exploreCamera.position.add(moveVelocity);
      moveVelocity.multiplyScalar(0.82);

      // Keep camera above floor
      exploreCamera.position.y = clamp(exploreCamera.position.y, 1.1, 2.4);

      // Clamp inside room bounds
      exploreCamera.position.x = clamp(exploreCamera.position.x, -roomW / 2 + 0.8, roomW / 2 - 0.8);
      exploreCamera.position.z = clamp(exploreCamera.position.z, backZ + 1.1, frontZ - 1.1);
    } else {
      // Focus animation (no snap, ends exactly on computed pose)
      const now = performance.now();
      const tRaw = clamp((now - focusState.animStart) / focusState.animDurMs, 0, 1);
      const t = easeInOutCubic(tRaw);

      // Interpolate camera pose
      inspectCamera.position.set(
        lerp(focusState.fromPos.x, focusState.toPos.x, t),
        lerp(focusState.fromPos.y, focusState.toPos.y, t),
        lerp(focusState.fromPos.z, focusState.toPos.z, t)
      );
      inspectCamera.quaternion.slerpQuaternions(focusState.fromQuat, focusState.toQuat, t);

      // Optional user dolly while focused (subtle)
      if (focusState.userDolly !== 0) {
        tmpDir.copy(focusState.inspectForward).normalize();
        // Pull camera slightly closer/farther along normal
        inspectCamera.position.addScaledVector(tmpDir, focusState.userDolly);
      }

      inspectCamera.updateMatrixWorld(true);

      // When finished, lock to exact end state (no jump because we already are there)
      if (tRaw >= 1) {
        inspectCamera.position.copy(focusState.toPos);
        inspectCamera.quaternion.copy(focusState.toQuat);
        inspectCamera.updateMatrixWorld(true);

        // Keep the final camera stable, but still allow a little user dolly.
        if (focusState.userDolly !== 0) {
          tmpDir.copy(focusState.inspectForward).normalize();
          inspectCamera.position.addScaledVector(tmpDir, focusState.userDolly);
          inspectCamera.updateMatrixWorld(true);
        }
      }
    }

    renderer.render(scene, activeCamera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ----------------------------
  // Dispose
  // ----------------------------
  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("pointercancel", onPointerUp);
    renderer.domElement.removeEventListener("wheel", onWheel as any);
    renderer.domElement.removeEventListener("click", onClickCanvas);

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
