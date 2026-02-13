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
  artPlane: THREE.Mesh;
  tex: THREE.Texture;
  aspect: number; // width/height
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
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  )
    return url;
  if (!url.startsWith("/")) return `/${url}`;
  return url;
}

function toAbsUrl(url: string) {
  const u = normalizeUrl(url);
  return new URL(u, window.location.origin).toString();
}

function getArtworkImageUrl(a: any): string {
  // Your MuseumArtwork type uses imageUrl (per your TS error).
  // Keep compatibility in case anything else slips in.
  return (
    (typeof a?.imageUrl === "string" && a.imageUrl) ||
    (typeof a?.image_url === "string" && a.image_url) ||
    (typeof a?.image === "string" && a.image) ||
    ""
  );
}

function getArtworkTitle(a: any): string {
  return (a?.title as string) || "Untitled";
}

function getArtworkArtist(a: any): string {
  return (a?.artist as string) || "Artist";
}

function getArtworkCollection(a: any): string {
  return (a?.collection as string) || (a?.collectionName as string) || (a?.collection_name as string) || "";
}

function getArtworkCatalogId(a: any): string {
  return (a?.catalogId as string) || (a?.catalog_id as string) || (a?.sku as string) || (a?.id as string) || "";
}

export function createVrMuseumScene({
  container,
  artworks,
  onArtworkClick: _onArtworkClick,
}: CreateArgs): VrMuseumSceneHandle {
  console.log("VR_SCENE_VERSION", "2026-02-13-window-lighting-placard-ortho-v1");

  let disposed = false;

  // ---------- Renderer ----------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Color management + tone mapping (prevents washed/gray look)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  container.appendChild(renderer.domElement);

  // ---------- Scene ----------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9a9a9a);

  // ---------- Cameras ----------
  const aspect = container.clientWidth / Math.max(1, container.clientHeight);
  const camera = new THREE.PerspectiveCamera(55, aspect, 0.05, 300);

  // Ortho camera used only in inspect mode so the artwork is perfectly flat on screen
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
  ortho.position.set(0, 0, 10);
  ortho.lookAt(0, 0, 0);
  ortho.updateProjectionMatrix();

  let activeCamera: THREE.Camera = camera;

  // ---------- Room dimensions ----------
  const roomW = 28;
  const roomH = 9;
  const roomD = 36;

  const backZ = -roomD / 2;
  const frontZ = roomD / 2;

  // ---------- Controls state ----------
  let yaw = 0;
  let pitch = 0;
  let isPointerDown = false;
  let lastX = 0;
  let lastY = 0;

  // Forward movement along Z axis (scroll)
  let scrollZ = 0;
  let targetScrollZ = 0;

  // Limit forward/back movement a bit so you don't clip through walls
  const minScroll = -8;
  const maxScroll = 10;

  // Start camera
  camera.position.set(0, 2.2, 10);
  camera.lookAt(0, 2.0, 0);

  // ---------- Geometry: floor/walls/ceiling ----------
  const floorGeo = new THREE.PlaneGeometry(roomW, roomD, 1, 1);
  floorGeo.rotateX(-Math.PI / 2);

  const texLoader = new THREE.TextureLoader();

  // Floor texture (your existing floor texture url may differ; keep this as you had it)
  const floorTex = texLoader.load(toAbsUrl("/floor.jpg"));
  floorTex.colorSpace = THREE.SRGBColorSpace;
  floorTex.wrapS = THREE.RepeatWrapping;
  floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(6, 10);
  floorTex.anisotropy = 8;

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.75,
    metalness: 0.05,
  });

  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  floor.position.y = 0;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x9b9b9b,
    roughness: 0.95,
    metalness: 0.0,
  });

  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  wallBack.position.set(0, roomH / 2, backZ);
  wallBack.receiveShadow = true;
  scene.add(wallBack);

  const wallFront = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  wallFront.position.set(0, roomH / 2, frontZ);
  wallFront.rotateY(Math.PI);
  wallFront.receiveShadow = true;
  scene.add(wallFront);

  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  wallLeft.position.set(-roomW / 2, roomH / 2, 0);
  wallLeft.rotateY(Math.PI / 2);
  wallLeft.receiveShadow = true;
  scene.add(wallLeft);

  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  wallRight.position.set(roomW / 2, roomH / 2, 0);
  wallRight.rotateY(-Math.PI / 2);
  wallRight.receiveShadow = true;
  scene.add(wallRight);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), wallMat);
  ceiling.position.set(0, roomH, 0);
  ceiling.rotateX(Math.PI / 2);
  ceiling.receiveShadow = false;
  scene.add(ceiling);

  // ---------- Window with hamptons.jpg ----------
  // Back wall window (centered)
  const windowW = roomW * 0.78;
  const windowH = roomH * 0.36;
  const windowY = roomH * 0.55;

  const windowFrameDepth = 0.12;
  const frameColor = 0x8f8f8f;

  // Frame: simple box border pieces
  const frameMat = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.9,
    metalness: 0.0,
  });

  function addFramePiece(w: number, h: number, x: number, y: number, z: number) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, windowFrameDepth), frameMat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  const windowZ = backZ + 0.02;

  // Outer border
  addFramePiece(windowW, 0.12, 0, windowY + windowH / 2, windowZ);
  addFramePiece(windowW, 0.12, 0, windowY - windowH / 2, windowZ);
  addFramePiece(0.12, windowH, -windowW / 2, windowY, windowZ);
  addFramePiece(0.12, windowH, windowW / 2, windowY, windowZ);

  // Interior mullions (4 columns, 2 rows)
  const cols = 4;
  const rows = 2;

  for (let c = 1; c < cols; c++) {
    const x = -windowW / 2 + (windowW * c) / cols;
    addFramePiece(0.08, windowH, x, windowY, windowZ + 0.01);
  }
  for (let r = 1; r < rows; r++) {
    const y = windowY - windowH / 2 + (windowH * r) / rows;
    addFramePiece(windowW, 0.08, 0, y, windowZ + 0.01);
  }

  // Outside image plane behind glass (slightly behind wall so it feels "outside")
  const outsideTex = texLoader.load(toAbsUrl("/hamptons.jpg"));
  outsideTex.colorSpace = THREE.SRGBColorSpace;
  outsideTex.anisotropy = 8;

  const outsideMat = new THREE.MeshBasicMaterial({
    map: outsideTex,
  });

  const outsidePlane = new THREE.Mesh(new THREE.PlaneGeometry(windowW - 0.16, windowH - 0.16), outsideMat);
  outsidePlane.position.set(0, windowY, backZ - 0.18);
  scene.add(outsidePlane);

  // Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.0,
    transmission: 0.85,
    thickness: 0.2,
    ior: 1.45,
    transparent: true,
    opacity: 1.0,
  });

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(windowW - 0.1, windowH - 0.1), glassMat);
  glass.position.set(0, windowY, windowZ + 0.02);
  glass.castShadow = false;
  glass.receiveShadow = false;
  scene.add(glass);

  // ---------- Lighting (this is the block you wanted) ----------
  const ambient = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9c7d6, 0.45);
  hemi.position.set(0, 10, 0);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1.05);

  // Sun from camera-right; casts shadows leftward into room
  sun.position.set(34, 14, backZ - 48);
  sun.target.position.set(-6, 0.15, backZ + 6);

  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 140;
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 30;
  sun.shadow.camera.bottom = -30;

  sun.shadow.radius = 14;
  sun.shadow.bias = -0.00006;
  sun.shadow.normalBias = 0.03;

  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-10, 16, 8);
  scene.add(fill);

  // ---------- Art frames ----------
  const framesGroup = new THREE.Group();
  scene.add(framesGroup);

  const artRecords: ArtMeshRecord[] = [];

  const frameDepth = 0.18;
  const frameBorder = 0.16;

  const frameMatArt = new THREE.MeshStandardMaterial({
    color: 0x0d0d0d,
    roughness: 0.55,
    metalness: 0.05,
  });

  const matteMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.95,
    metalness: 0.0,
  });

  // Right wall layout
  const wallZSpan = roomD * 0.7;
  const baseZ = -wallZSpan / 2;
  const spacingZ = wallZSpan / Math.max(1, artworks.length);
  const centerY = 4.2;

  function createFrameForArtwork(artwork: MuseumArtwork, index: number) {
    const imgUrl = getArtworkImageUrl(artwork);
    const tex = texLoader.load(toAbsUrl(imgUrl));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    // Default aspect (if texture not ready yet)
    let aspectWH = 1.0;

    // When loaded, update aspect (we keep the plane correct in inspect mode regardless)
    tex.onUpdate = () => {
      if ((tex.image as any)?.width && (tex.image as any)?.height) {
        const w = (tex.image as any).width as number;
        const h = (tex.image as any).height as number;
        if (w > 0 && h > 0) aspectWH = w / h;
      }
    };

    // Physical size of the framed piece in the room
    // We keep a consistent height and derive width from aspect
    const artH = 2.8;
    const artW = artH * aspectWH;

    // Matte + art
    const matte = new THREE.Mesh(new THREE.PlaneGeometry(artW + frameBorder * 0.9, artH + frameBorder * 0.9), matteMat);
    matte.position.set(0, 0, 0.01);
    matte.receiveShadow = true;

    const artPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(artW, artH),
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.85,
        metalness: 0.0,
      })
    );
    artPlane.position.set(0, 0, 0.02);
    artPlane.receiveShadow = false;

    // Frame border (simple box)
    const frameW = artW + frameBorder * 2;
    const frameH = artH + frameBorder * 2;

    const frame = new THREE.Mesh(new THREE.BoxGeometry(frameW, frameH, frameDepth), frameMatArt);
    frame.castShadow = true;
    frame.receiveShadow = true;

    const group = new THREE.Group();
    group.add(frame);
    group.add(matte);
    group.add(artPlane);

    // Place on right wall
    const x = roomW / 2 - 0.06; // slightly in from wall plane
    const z = baseZ + spacingZ * index + spacingZ / 2;
    group.position.set(x, centerY, z);
    group.rotateY(-Math.PI / 2);

    framesGroup.add(group);

    // clickable object: use the artPlane (raycast)
    const record: ArtMeshRecord = {
      artwork,
      clickable: artPlane,
      frameGroup: group,
      artPlane,
      tex,
      aspect: aspectWH,
    };

    artRecords.push(record);
  }

  artworks.forEach((a, i) => createFrameForArtwork(a, i));

  // ---------- Placard DOM (museum label) ----------
  const placard = document.createElement("div");
  placard.style.position = "absolute";
  placard.style.right = "24px";
  placard.style.top = "50%";
  placard.style.transform = "translateY(-50%)";
  placard.style.width = "360px";
  placard.style.maxWidth = "38%";
  placard.style.background = "#f4f1ea";
  placard.style.color = "#222";
  placard.style.border = "1px solid rgba(0,0,0,0.28)";
  placard.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -2px 6px rgba(0,0,0,0.10)";
  placard.style.padding = "18px 18px 14px 18px";
  placard.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  placard.style.display = "none";
  placard.style.pointerEvents = "none"; // doesn’t block drag
  placard.style.userSelect = "none";

  const placardSmall = "letter-spacing: 0.18em; font-size: 12px; opacity: 0.65;";
  const placardTitle = "font-size: 24px; font-weight: 650; margin-top: 10px;";
  const placardItalic = "font-size: 18px; font-style: italic; margin-top: 6px;";
  const placardRowLabel = "font-size: 16px; opacity: 0.65;";
  const placardRowVal = "font-size: 16px; font-weight: 520;";

  function setPlacard(art: MuseumArtwork) {
    const artist = getArtworkArtist(art);
    const title = getArtworkTitle(art);
    const collection = getArtworkCollection(art);
    const catalog = getArtworkCatalogId(art);

    placard.innerHTML = `
      <div style="${placardSmall}">MUSEUM LABEL</div>
      <div style="${placardTitle}">${artist}</div>
      <div style="${placardItalic}">${title}</div>
      <div style="height:1px; background:rgba(0,0,0,0.18); margin:14px 0 12px 0;"></div>
      <div style="display:grid; grid-template-columns: 120px 1fr; gap: 8px 18px;">
        <div style="${placardRowLabel}">Collection</div><div style="${placardRowVal}">${collection}</div>
        <div style="${placardRowLabel}">Title</div><div style="${placardRowVal}">${title}</div>
        <div style="${placardRowLabel}">Catalog ID</div><div style="${placardRowVal}">${catalog}</div>
      </div>
    `;
  }

  // Ensure container is position: relative so placard can be positioned
  const prevPos = getComputedStyle(container).position;
  if (prevPos === "static") container.style.position = "relative";
  container.appendChild(placard);

  // ---------- Inspect mode (flat, pixel-perfect, painting left + placard right) ----------
  let inspecting = false;
  let inspected: ArtMeshRecord | null = null;

  // A full-screen quad-like plane shown in ortho mode
  const inspectGroup = new THREE.Group();
  inspectGroup.visible = false;
  scene.add(inspectGroup);

  const inspectPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  inspectPlane.position.set(0, 0, 0);
  inspectGroup.add(inspectPlane);

  // Optional subtle “wall” behind for a clean presentation
  const inspectBg = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshBasicMaterial({ color: 0x9a9a9a })
  );
  inspectBg.position.set(0, 0, -0.01);
  inspectGroup.add(inspectBg);

  // Controls how much space plaque gets, and padding
  const PLAQUE_FRACTION = 0.33; // about 1/3 width for plaque
  const PADDING_NDC = 0.06; // padding in normalized ortho space

  function resizeOrtho() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);

    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();

    // Keep ortho in normalized space [-1..1]
    ortho.left = -1;
    ortho.right = 1;
    ortho.top = 1;
    ortho.bottom = -1;
    ortho.updateProjectionMatrix();

    // If inspecting, re-lay out the plane to preserve aspect and show fully
    if (inspecting && inspected) layoutInspect(inspected);
  }

  function layoutInspect(rec: ArtMeshRecord) {
    // Use real texture dimensions if available
    let w = 1;
    let h = 1;
    const img: any = rec.tex.image;
    if (img && img.width && img.height) {
      w = img.width;
      h = img.height;
    }
    const artAspect = w / Math.max(1, h);

    // Available NDC area for artwork on the left
    const leftAvailW = (1 - PLAQUE_FRACTION) * 2 - PADDING_NDC * 2; // from -1..(1-PLAQUE_FRACTION)*2? simplified into width
    const fullH = 2 - PADDING_NDC * 2;

    // Left panel spans from -1 to (1 - PLAQUE_FRACTION)
    const leftMinX = -1 + PADDING_NDC;
    const leftMaxX = (1 - PLAQUE_FRACTION) - PADDING_NDC;

    const availW = leftMaxX - leftMinX;
    const availH = fullH;

    // Fit artwork fully into available box while preserving aspect
    let planeW = availW;
    let planeH = planeW / artAspect;
    if (planeH > availH) {
      planeH = availH;
      planeW = planeH * artAspect;
    }

    // Center it inside the left panel
    const cx = (leftMinX + leftMaxX) / 2;
    const cy = 0;

    // Background should fill full screen
    inspectBg.scale.set(1.0, 1.0, 1.0);
    inspectBg.position.set(0, 0, -0.01);

    // Update plane geometry to correct aspect
    inspectPlane.geometry.dispose();
    inspectPlane.geometry = new THREE.PlaneGeometry(planeW, planeH);

    (inspectPlane.material as THREE.MeshBasicMaterial).map = rec.tex;
    (inspectPlane.material as THREE.MeshBasicMaterial).needsUpdate = true;

    inspectPlane.position.set(cx, cy, 0);

    // Place placard on the right, vertically centered
    placard.style.display = "block";
    placard.style.right = "24px";
    placard.style.top = "50%";
    placard.style.transform = "translateY(-50%)";

    // Make placard a bit smaller so art stays primary
    placard.style.width = "320px";
    placard.style.padding = "16px 16px 12px 16px";
  }

  function enterInspect(rec: ArtMeshRecord) {
    inspecting = true;
    inspected = rec;

    setPlacard(rec.artwork);
    inspectGroup.visible = true;

    activeCamera = ortho;

    // Keep the scene view but we’re now rendering a flat presentation plane
    layoutInspect(rec);
  }

  function exitInspect() {
    inspecting = false;
    inspected = null;

    placard.style.display = "none";
    inspectGroup.visible = false;

    activeCamera = camera;
  }

  // Exposed helpers
  function focusArtwork(id: string) {
    const rec = artRecords.find((r) => String((r.artwork as any)?.id || "") === id);
    if (!rec) return;
    enterInspect(rec);
  }

  function clearFocus() {
    exitInspect();
  }

  // ---------- Raycasting for clicks ----------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function pointerToNdc(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointer.set(x, y);
  }

  function onPointerDown(e: PointerEvent) {
    if (disposed) return;
    isPointerDown = true;
    lastX = e.clientX;
    lastY = e.clientY;

    // If clicking in inspect mode, click anywhere to close
    if (inspecting) {
      exitInspect();
      return;
    }

    // Click artwork to inspect
    pointerToNdc(e);
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(artRecords.map((r) => r.clickable), true);
    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const rec = artRecords.find((r) => r.clickable === hitObj || r.clickable === hitObj.parent);
      if (rec) enterInspect(rec);
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (disposed) return;
    if (!isPointerDown) return;
    if (inspecting) return; // no rotate while inspecting

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    yaw += dx * 0.0032;
    pitch += dy * 0.0028;
    pitch = clamp(pitch, -0.9, 0.75);
  }

  function onPointerUp() {
    isPointerDown = false;
  }

  // ---------- Wheel: prevent page scroll when over museum ----------
  function onWheel(e: WheelEvent) {
    if (disposed) return;

    // If inspecting, let wheel do nothing (or you can close on wheel if you want)
    if (inspecting) {
      e.preventDefault();
      return;
    }

    // Stop page from scrolling while cursor is over the museum canvas
    e.preventDefault();

    // Move forward/back in the room
    const delta = e.deltaY;
    targetScrollZ += delta * 0.008;
    targetScrollZ = clamp(targetScrollZ, minScroll, maxScroll);
  }

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointercancel", onPointerUp);

  // IMPORTANT: passive:false so preventDefault works
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

  // ---------- Resize ----------
  const ro = new ResizeObserver(() => {
    if (disposed) return;
    resizeOrtho();
  });
  ro.observe(container);

  // ---------- Simple HUD hint (optional) ----------
  // (You already have a tooltip in your UI, so we don't add another.)

  // ---------- Animate loop ----------
  function animate() {
    if (disposed) return;

    // Smooth scroll
    scrollZ = lerp(scrollZ, targetScrollZ, 0.12);

    if (!inspecting) {
      // Apply look
      const lookDir = new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const basePos = new THREE.Vector3(0, 2.2, 10 + scrollZ);
      camera.position.copy(basePos);

      const target = new THREE.Vector3().copy(camera.position).add(lookDir.multiplyScalar(10));
      camera.lookAt(target);
    }

    renderer.render(scene, activeCamera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ---------- Dispose ----------
  function dispose() {
    disposed = true;
    ro.disconnect();

    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("pointercancel", onPointerUp);
    renderer.domElement.removeEventListener("wheel", onWheel as any);

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
