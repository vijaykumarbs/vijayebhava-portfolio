"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { chapters } from "@/data/chapters";

const palette = {
  floor: "#e8dfd0",
  wall: "#eee6d8",
  trim: "#c9c1b2",
  ink: "#34443f",
  teal: "#62c9b2",
  tealDark: "#168c7c",
  clay: "#f06d55",
  gold: "#f4bd42",
  paper: "#faf8f2",
  customer: "#f4bd42",
  leader: "#8758d1",
  engineering: "#258ee8",
  host: "#ed624f",
};

function Block({
  position,
  size,
  color,
  rotation = 0,
  radius = 0,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: number;
  radius?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={radius ? 0.58 : 0.82} />
    </mesh>
  );
}

type CharacterRole = "host" | "customer" | "leader" | "engineering";

const roleColor: Record<CharacterRole, string> = {
  host: palette.host,
  customer: palette.customer,
  leader: palette.leader,
  engineering: palette.engineering,
};

function Person({ position, color, sitting = false, role = "host", phase = 0 }: { position: [number, number, number]; color?: string; sitting?: boolean; role?: CharacterRole; phase?: number }) {
  const character = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!character.current) return;
    const time = clock.elapsedTime + phase;
    character.current.position.y = Math.sin(time * 1.8) * 0.045;
    character.current.rotation.y = Math.sin(time * 0.8) * 0.08;
  });

  return (
    <group ref={character} position={position}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <capsuleGeometry args={[0.17, sitting ? 0.34 : 0.42, 3, 7]} />
        <meshStandardMaterial color={color ?? roleColor[role]} roughness={0.68} />
      </mesh>
      <mesh position={[-0.2, 0.61, 0]} rotation={[0, 0, -0.32]} castShadow>
        <capsuleGeometry args={[0.065, 0.26, 3, 6]} />
        <meshStandardMaterial color={color ?? roleColor[role]} roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 0.61, 0]} rotation={[0, 0, 0.32]} castShadow>
        <capsuleGeometry args={[0.065, 0.26, 3, 6]} />
        <meshStandardMaterial color={color ?? roleColor[role]} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#d6a782" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.14, -0.01]} castShadow>
        <sphereGeometry args={[0.166, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial color={role === "leader" ? "#302746" : role === "engineering" ? "#273c60" : "#513b33"} roughness={0.84} />
      </mesh>
      <mesh position={[-0.05, 1.055, 0.143]}>
        <sphereGeometry args={[0.018, 6, 5]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0.05, 1.055, 0.143]}>
        <sphereGeometry args={[0.018, 6, 5]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, 0.88, 0.174]}>
        <boxGeometry args={[0.07, 0.13, 0.018]} />
        <meshStandardMaterial color={role === "host" ? "#fff3df" : roleColor[role]} roughness={0.64} />
      </mesh>
    </group>
  );
}

function Desk({ position, color = palette.paper }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <Block position={[0, 0.68, 0]} size={[1.55, 0.12, 0.9]} color={color} />
      <Block position={[-0.6, 0.32, -0.3]} size={[0.09, 0.66, 0.09]} color={palette.trim} />
      <Block position={[0.6, 0.32, -0.3]} size={[0.09, 0.66, 0.09]} color={palette.trim} />
      <Block position={[-0.6, 0.32, 0.3]} size={[0.09, 0.66, 0.09]} color={palette.trim} />
      <Block position={[0.6, 0.32, 0.3]} size={[0.09, 0.66, 0.09]} color={palette.trim} />
      <Block position={[0, 0.92, -0.12]} size={[0.42, 0.32, 0.05]} color={palette.tealDark} />
      <Block position={[0, 0.77, -0.08]} size={[0.38, 0.025, 0.025]} color="#d8dfd8" />
    </group>
  );
}

function Room({
  position,
  size,
  floor,
  walls = true,
  accent = palette.teal,
  wall = palette.wall,
}: {
  position: [number, number, number];
  size: [number, number];
  floor: string;
  walls?: boolean;
  accent?: string;
  wall?: string;
}) {
  const [width, depth] = size;
  return (
    <group position={position}>
      <Block position={[0, 0.13, 0]} size={[width, 0.16, depth]} color={floor} />
      {walls && (
        <>
          <Block position={[-width / 2, 1.05, 0]} size={[0.12, 1.8, depth]} color={wall} />
          <Block position={[width / 2, 1.05, -depth / 2 + 0.7]} size={[0.12, 1.8, depth - 1.4]} color={wall} />
          <Block position={[0, 1.05, -depth / 2]} size={[width, 1.8, 0.12]} color={wall} />
          <Block position={[0, 1.96, -depth / 2 + 0.5]} size={[width * 0.76, 0.07, 0.1]} color={accent} />
        </>
      )}
    </group>
  );
}

function Office() {
  return (
    <group>
      {/* One connected architectural base, with an open centre for the customer. */}
      <Block position={[0, -0.08, 0]} size={[12.4, 0.3, 8.4]} color={palette.ink} />
      <Block position={[0, 0.1, 0]} size={[12.15, 0.12, 8.15]} color="#e6dfd1" />
      <Room position={[-3.6, 0, -2.15]} size={[4.25, 3.2]} floor="#f4ad79" accent="#d9513e" wall="#f8c7a2" />
      <Room position={[0.9, 0, -2.15]} size={[4.45, 3.2]} floor="#bea0ea" accent="#7044bd" wall="#d7c5f2" />
      <Room position={[4.1, 0, 1.95]} size={[3.55, 3.25]} floor="#78c5f0" accent="#1879ca" wall="#b1e0f7" />
      <Room position={[-3.35, 0, 2.05]} size={[4.25, 3.15]} floor="#8fd4a0" accent="#348552" wall="#bfe9c9" />
      <Room position={[0.5, 0, 2.05]} size={[3.05, 3.15]} floor="#f4d16d" accent="#c18b17" wall="#f8e4a6" />

      {/* Discovery room */}
      <Desk position={[-3.55, 0.2, -2.1]} color="#f8f3e8" />
      <Person position={[-4.25, 0.2, -1.65]} role="customer" sitting phase={1} />
      <Person position={[-2.75, 0.2, -2.55]} role="host" sitting phase={2} />
      <Block position={[-3.55, 1.4, -3.62]} size={[1.45, 0.9, 0.08]} color="#e2d9c8" />
      <Block position={[-3.95, 1.5, -3.56]} size={[0.35, 0.035, 0.035]} color={palette.clay} />
      <Block position={[-3.45, 1.24, -3.56]} size={[0.62, 0.035, 0.035]} color={palette.tealDark} />
      <Block position={[-3.25, 1.62, -3.56]} size={[0.28, 0.035, 0.035]} color={palette.gold} />

      {/* Strategy and leadership room */}
      <Block position={[0.85, 0.23, -2.0]} size={[1.7, 0.1, 1.0]} color="#dfd8c9" />
      <Block position={[0.85, 0.77, -2.0]} size={[0.1, 0.98, 0.1]} color={palette.trim} />
      <Person position={[0.05, 0.2, -2.3]} role="leader" phase={1.5} />
      <Person position={[1.6, 0.2, -1.8]} role="host" phase={2.5} />
      <Block position={[2.4, 1.3, -3.62]} size={[1.0, 0.8, 0.08]} color="#e0e8df" />
      <Block position={[2.15, 1.3, -3.56]} size={[0.035, 0.58, 0.035]} color={palette.clay} />
      <Block position={[2.4, 1.3, -3.56]} size={[0.035, 0.58, 0.035]} color={palette.gold} />
      <Block position={[2.65, 1.3, -3.56]} size={[0.035, 0.58, 0.035]} color={palette.tealDark} />

      {/* Central customer collaboration space */}
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, 0.76, 0]} castShadow>
          <cylinderGeometry args={[1.28, 1.34, 0.16, 10]} />
          <meshStandardMaterial color="#f9f4e9" roughness={0.8} />
        </mesh>
        <Block position={[0, 0.64, 0]} size={[0.2, 0.16, 0.2]} color={palette.trim} />
        <Person position={[-0.55, 0.03, 0.9]} role="customer" sitting phase={0.8} />
        <Person position={[0.65, 0.03, 0.85]} role="host" sitting phase={1.8} />
        <Person position={[0.1, 0.03, -0.95]} role="leader" sitting phase={3} />
        <mesh position={[0.1, 1.28, 0]}>
          <sphereGeometry args={[0.17, 10, 8]} />
          <meshStandardMaterial color={palette.gold} emissive={palette.gold} emissiveIntensity={0.22} />
        </mesh>
      </group>

      {/* Product design room */}
      <Block position={[-3.25, 0.27, 2.0]} size={[2.2, 0.13, 1.0]} color="#f7f3ea" />
      <Block position={[-3.25, 0.9, 1.68]} size={[0.75, 0.06, 0.52]} color="#d8e2da" rotation={-0.12} />
      <Block position={[-4.0, 0.35, 2.0]} size={[0.1, 0.7, 0.1]} color={palette.trim} />
      <Block position={[-2.5, 0.35, 2.0]} size={[0.1, 0.7, 0.1]} color={palette.trim} />
      <Person position={[-3.9, 0.2, 2.65]} role="host" phase={1.2} />
      <Person position={[-2.7, 0.2, 2.6]} role="customer" phase={2.2} />

      {/* Engineering and delivery room */}
      <Desk position={[4.0, 0.2, 1.95]} />
      <Person position={[3.1, 0.2, 1.3]} role="engineering" phase={0.7} />
      <Person position={[4.8, 0.2, 2.55]} role="engineering" phase={2.7} />
      <Block position={[5.68, 1.24, 0.58]} size={[0.08, 0.8, 1.1]} color="#dce7df" />
      <Block position={[5.62, 1.35, 0.4]} size={[0.035, 0.035, 0.5]} color={palette.tealDark} />
      <Block position={[5.62, 1.1, 0.77]} size={[0.035, 0.035, 0.25]} color={palette.clay} />

      {/* Adoption handoff room */}
      <Person position={[-0.1, 0.2, 2.55]} role="host" phase={0.4} />
      <Person position={[1.1, 0.2, 2.55]} role="leader" phase={2.4} />

      {/* A visible path links every room back to the shared centre. */}
      <Block position={[-1.65, 0.19, 0]} size={[1.9, 0.06, 0.15]} color="#d6bd8f" />
      <Block position={[1.4, 0.19, 0]} size={[1.75, 0.06, 0.15]} color="#d6bd8f" />
      <Block position={[0, 0.19, -1.05]} size={[0.16, 0.06, 1.4]} color="#d6bd8f" />
      <Block position={[0, 0.19, 1.25]} size={[0.16, 0.06, 1.4]} color="#d6bd8f" />
    </group>
  );
}

function FlowTrail() {
  const pulses = useRef<Array<THREE.Mesh | null>>([]);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.55, 0.3, -0.42),
      new THREE.Vector3(-2.1, 0.3, -0.42),
      new THREE.Vector3(-1.2, 0.3, -0.18),
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(1.1, 0.3, -0.45),
      new THREE.Vector3(0.25, 0.3, -0.9),
      new THREE.Vector3(-1.2, 0.3, 0.25),
      new THREE.Vector3(-3.35, 0.3, 3.5),
      new THREE.Vector3(-1.2, 0.3, 1.0),
      new THREE.Vector3(0.2, 0.3, 0.2),
      new THREE.Vector3(4.05, 0.3, 3.5),
      new THREE.Vector3(1.0, 0.3, 1.1),
      new THREE.Vector3(0.5, 0.3, 3.4),
      new THREE.Vector3(0.2, 0.3, 1.1),
      new THREE.Vector3(0, 0.3, 0),
    ], false, "centripetal"),
    [],
  );

  useFrame(({ clock }) => {
    pulses.current.forEach((pulse, index) => {
      if (!pulse) return;
      const progress = (clock.elapsedTime * 0.055 + index / 4) % 1;
      pulse.position.copy(curve.getPointAt(progress));
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 180, 0.035, 6, false]} />
        <meshBasicMaterial color="#2daea0" transparent opacity={0.72} />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} ref={(node) => { pulses.current[index] = node; }}>
          <sphereGeometry args={[0.105, 10, 8]} />
          <meshStandardMaterial color={index % 2 ? "#fff1a8" : "#38d9c3"} emissive={index % 2 ? "#ffb72e" : "#19b6a6"} emissiveIntensity={0.7} roughness={0.24} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const look = useRef(new THREE.Vector3(0, 0.8, 0));
  const target = useMemo(
    () => [
      { pos: [13, 14, 15], look: [0, 0.7, 0] },
      { pos: [-6.0, 9.7, -8.6], look: [-3.5, 0.7, -2.0] },
      { pos: [9.6, 9.2, -9.0], look: [0.9, 0.6, -2.0] },
      { pos: [-10.8, 9.0, 9.8], look: [-3.1, 0.5, 2.0] },
      { pos: [14.4, 9.5, 9.3], look: [4.0, 0.7, 1.9] },
      { pos: [4.0, 9.0, 9.2], look: [0.5, 0.6, 2.05] },
      { pos: [10.0, 12.5, 12.0], look: [0, 0.7, 0] },
      { pos: [10.0, 12.5, 12.0], look: [0, 0.7, 0] },
    ],
    [],
  );

  useFrame(({ camera }, delta) => {
    const value = THREE.MathUtils.clamp(progress.current, 0, target.length - 1);
    const index = Math.min(Math.floor(value), target.length - 2);
    const mix = THREE.MathUtils.smoothstep(value - index, 0, 1);
    const a = target[index];
    const b = target[index + 1];
    const desired = new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), mix);
    const desiredLook = new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), mix);
    const easing = 1 - Math.exp(-delta * 3.8);
    camera.position.lerp(desired, easing);
    look.current.lerp(desiredLook, easing);
    camera.lookAt(look.current);
  });
  return null;
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = size.width < 680 ? 49 : 34;
    perspective.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

const chapterLabels = ["Discover", "Align", "Design", "Build", "Deliver", "Outcomes"];

function SceneWayfinding({ activeStep }: { activeStep: number }) {
  return (
    <>
      <nav className="scene-stage-track" aria-label="Transformation chapters">
        {chapters.map((chapter, index) => (
          <a
            className={`scene-stage${activeStep === index + 1 ? " is-active" : ""}`}
            href={`#${chapter.id}`}
            key={chapter.id}
            aria-current={activeStep === index + 1 ? "step" : undefined}
            title={chapter.eyebrow}
          >
            <span className="scene-stage-number">{chapter.number}</span>
            <span>{chapterLabels[index]}</span>
          </a>
        ))}
      </nav>
      <div className="scene-chapter-caption" aria-live="polite">
        {activeStep === 0 ? "Customer at the centre" : `${chapters[activeStep - 1]?.number} · ${chapters[activeStep - 1]?.eyebrow}`}
      </div>
    </>
  );
}

function CharacterLegend() {
  const roles: Array<{ role: CharacterRole; label: string }> = [
    { role: "host", label: "Me" },
    { role: "customer", label: "Customer" },
    { role: "leader", label: "CEO + stakeholders" },
    { role: "engineering", label: "Engineering team" },
  ];

  return (
    <aside className="scene-character-legend" aria-label="People in the transformation flow">
      {roles.map(({ role, label }) => (
        <span className="scene-character-key" key={role}>
          <span className={`scene-character-dot scene-character-dot--${role}`} aria-hidden="true" />
          {label}
        </span>
      ))}
    </aside>
  );
}

export default function OfficeScene() {
  const progress = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const update = () => {
      const chapterStarts = chapters.map((chapter) => {
        const element = document.getElementById(chapter.id);
        return element ? element.getBoundingClientRect().top + window.scrollY : window.innerHeight * (chapters.indexOf(chapter) + 1);
      });
      const y = window.scrollY;
      let segment = 0;
      while (segment < chapterStarts.length && y >= chapterStarts[segment]) segment += 1;
      const start = segment === 0 ? 0 : chapterStarts[segment - 1];
      const end = chapterStarts[segment] ?? document.getElementById("contact")?.offsetTop ?? start + window.innerHeight;
      const fraction = end > start ? THREE.MathUtils.clamp((y - start) / (end - start), 0, 1) : 0;
      progress.current = THREE.MathUtils.clamp(segment + fraction, 0, chapters.length);
      const nextStep = Math.round(progress.current);
      setActiveStep((previous) => (previous === nextStep ? previous : nextStep));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
    <div className="office-canvas" role="img" aria-label="Animated three-dimensional office showing Vijay, customers, business leaders and engineers moving through a colourful transformation journey">
        <Canvas
        camera={{ position: [13, 14, 15], fov: 34, near: 0.1, far: 100 }}
        dpr={[1, 1.3]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        frameloop="always"
        shadows
      >
        <color attach="background" args={["#f4f1e9"]} />
        <ambientLight intensity={0.88} />
        <directionalLight position={[6, 12, 8]} intensity={1.05} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-radius={4} />
        <ResponsiveCamera />
        <CameraRig progress={progress} />
        <Office />
        <FlowTrail />
      </Canvas>
    </div>
    <CharacterLegend />
    <SceneWayfinding activeStep={activeStep} />
    </>
  );
}
