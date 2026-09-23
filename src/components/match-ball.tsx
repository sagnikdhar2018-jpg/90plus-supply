import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { COLORWAYS, FINISHES } from "@/data/colorways";

function panelTexture(a: string, b: string, name: string, number: string) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = b;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = a;
  ctx.lineWidth = 10;
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const ox = x * 128 + (y % 2 ? 64 : 0);
      const oy = y * 90;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        const px = ox + 58 + Math.cos(ang) * 46;
        const py = oy + 52 + Math.sin(ang) * 46;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = x % 2 === y % 2 ? a : b;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
    }
  }
  ctx.fillStyle = a;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(512, 256, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#f4f4f1";
  ctx.textAlign = "center";
  ctx.font = "700 72px Oswald, sans-serif";
  if (number) ctx.fillText(number, 512, 250);
  ctx.font = "600 28px JetBrains Mono, monospace";
  if (name) ctx.fillText(name.slice(0, 12).toUpperCase(), 512, 292);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type Props = {
  colorway?: number;
  finish?: number;
  name?: string;
  number?: string;
  className?: string;
  autoRotate?: boolean;
};

export function MatchBall({ colorway = 0, finish = 0, name = "", number = "", className, autoRotate = true }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ colorway, finish, name, number });
  state.current = { colorway, finish, name, number };

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.15, 3.4);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    const geo = new THREE.SphereGeometry(1, 64, 48);
    const mat = new THREE.MeshPhysicalMaterial({
      roughness: 0.32,
      metalness: 0.12,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0xc8ff2e, 8, 12);
    fill.position.set(-2, 1, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xffffff, 6, 10);
    rim.position.set(2, -1.5, -2);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 5.5;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;

    let tex: THREE.CanvasTexture | undefined;
    function apply() {
      const cw = COLORWAYS[state.current.colorway % COLORWAYS.length];
      const fin = FINISHES[state.current.finish % FINISHES.length];
      tex?.dispose();
      tex = panelTexture(cw.a, cw.b, state.current.name, state.current.number);
      mat.map = tex;
      mat.roughness = 0.85 - fin.sheen * 0.7;
      mat.metalness = 0.08 + fin.sheen * 0.7;
      mat.clearcoat = 0.2 + fin.sheen * 0.7;
      mat.needsUpdate = true;
    }
    apply();

    const applyRef = { current: apply };
    (el as HTMLDivElement & { __apply?: () => void }).__apply = () => applyRef.current();

    const resize = () => {
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      mat.dispose();
      tex?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [autoRotate]);

  useEffect(() => {
    const el = host.current as (HTMLDivElement & { __apply?: () => void }) | null;
    el?.__apply?.();
  }, [colorway, finish, name, number]);

  return <div ref={host} className={className} style={{ width: "100%", height: "100%" }} />;
}
