"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { chapters } from "@/data/chapters";

type Point = [number, number, number];
type Role = "host" | "customer" | "leader" | "engineering";

const palette = {
  ink: "#263a35",
  paper: "#f4f1e9",
  ivory: "#fffaf0",
  metal: "#b7a98f",
  host: "#df634f",
  customer: "#f3bd48",
  leader: "#8860cf",
  engineering: "#328cda",
  discovery: "#ed9b75",
  strategy: "#ae90e0",
  design: "#edcc5e",
  build: "#69b9e6",
  delivery: "#62c4a6",
  outcomes: "#99c773",
};

function roundedRectangle(width: number, depth: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function Slab({
  position,
  size,
  color,
  radius = 0.18,
  metalness = 0.04,
}: {
  position: Point;
  size: [number, number, number];
  color: string;
  radius?: number;
  metalness?: number;
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => {
    const shape = roundedRectangle(width, depth, Math.min(radius, width / 3, depth / 3));
    return new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: Math.min(height * 0.22, 0.05),
      bevelThickness: Math.min(height * 0.22, 0.05),
      curveSegments: 6,
    });
  }, [depth, height, radius, width]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial color={color} roughness={0.4} metalness={metalness} clearcoat={0.18} />
    </mesh>
  );
}

function Block({
  position,
  size,
  color,
  rotation = 0,
  radius = 0,
}: {
  position: Point;
  size: Point;
  color: string;
  rotation?: number;
  radius?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={radius ? 0.5 : 0.68} metalness={radius ? 0.1 : 0.02} />
    </mesh>
  );
}

function Person({
  position,
  role,
  progress,
  stage,
  phase = 0,
}: {
  position: Point;
  role: Role;
  progress: React.MutableRefObject<number>;
  stage: number;
  phase?: number;
}) {
  const body = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const suit = palette[role];
  const hair = role === "leader" ? "#332b40" : role === "engineering" ? "#26394a" : "#493b32";

  useFrame(({ clock }) => {
    const time = clock.elapsedTime + phase;
    const focus = THREE.MathUtils.clamp(1 - Math.abs(progress.current - stage) / 0.95, 0, 1);
    if (body.current) body.current.rotation.y = Math.sin(time * 0.65) * 0.025;
    if (head.current) head.current.rotation.x = -focus * (0.035 + Math.sin(time * 1.2) * 0.015);
    if (rightArm.current) rightArm.current.rotation.x = -focus * (0.24 + Math.sin(time * 1.6) * 0.06);
  });

  return (
    <group position={position}>
      <group ref={body}>
        <mesh position={[0, 0.58, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.42, 5, 12]} />
          <meshPhysicalMaterial color={suit} roughness={0.38} clearcoat={0.35} />
        </mesh>
        <mesh position={[-0.22, 0.61, 0]} rotation={[0, 0, -0.24]} castShadow>
          <capsuleGeometry args={[0.07, 0.28, 4, 9]} />
          <meshStandardMaterial color={suit} roughness={0.44} />
        </mesh>
        <mesh ref={rightArm} position={[0.22, 0.68, 0]} rotation={[0, 0, 0.24]} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 4, 9]} />
          <meshStandardMaterial color={suit} roughness={0.44} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.19, 20, 16]} />
          <meshStandardMaterial color="#d7a988" roughness={0.64} />
        </mesh>
        <mesh position={[0, 1.2, -0.025]} castShadow>
          <sphereGeometry args={[0.192, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2.25]} />
          <meshStandardMaterial color={hair} roughness={0.82} />
        </mesh>
        <group ref={head}>
          <mesh position={[-0.058, 1.12, 0.173]}>
            <sphereGeometry args={[0.019, 10, 8]} />
            <meshBasicMaterial color={palette.ink} />
          </mesh>
          <mesh position={[0.058, 1.12, 0.173]}>
            <sphereGeometry args={[0.019, 10, 8]} />
            <meshBasicMaterial color={palette.ink} />
          </mesh>
        </group>
        <mesh position={[0, 0.91, 0.183]}>
          <boxGeometry args={[0.065, 0.15, 0.018]} />
          <meshStandardMaterial color={role === "host" ? palette.ivory : palette.paper} roughness={0.34} />
        </mesh>
      </group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.12, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.56} />
      </mesh>
    </group>
  );
}

function Screen({ position, size = [0.8, 0.56], color = "#fffaf0" }: { position: Point; size?: [number, number]; color?: string }) {
  const [width, height] = size;
  return (
    <group position={position}>
      <Block position={[0, 0.06, 0]} size={[width, height, 0.075]} color="#34443f" />
      <Block position={[0, 0.06, 0.044]} size={[width - 0.1, height - 0.1, 0.012]} color={color} />
      <Block position={[0, -height / 2 - 0.03, -0.015]} size={[0.12, 0.08, 0.12]} color="#c5b79e" />
    </group>
  );
}

function Table({ position, size = [1.3, 0.78, 0.72], color = palette.ivory }: { position: Point; size?: Point; color?: string }) {
  const [width, height, depth] = size;
  return (
    <group position={position}>
      <Slab position={[0, height, 0]} size={[width, 0.11, depth]} color={color} radius={0.15} />
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => (
        <Block key={`${x}-${z}`} position={[x * (width / 2 - 0.1), height / 2, z * (depth / 2 - 0.1)]} size={[0.07, height, 0.07]} color="#d4c8b2" />
      )))}
    </group>
  );
}

function Room({
  position,
  size,
  floor,
  accent,
  progress,
  stage,
  children,
}: {
  position: [number, number, number];
  size: [number, number];
  floor: string;
  accent: string;
  progress: React.MutableRefObject<number>;
  stage: number;
  children: React.ReactNode;
}) {
  const [width, depth] = size;
  const room = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!room.current) return;
    const focus = THREE.MathUtils.clamp(1 - Math.abs(progress.current - stage) / 0.9, 0, 1);
    room.current.scale.setScalar(1 + focus * 0.012);
  });

  return (
    <group ref={room} position={position}>
      <Slab position={[0, 0.035, 0]} size={[width + 0.18, 0.22, depth + 0.18]} color={accent} radius={0.28} metalness={0.15} />
      <Slab position={[0, 0.19, 0]} size={[width, 0.16, depth]} color={floor} radius={0.24} />
      {/* Low rear and side partitions define a room without hiding its activity. */}
      <Slab position={[0, 0.54, -depth / 2 + 0.08]} size={[width - 0.28, 1.12, 0.16]} color="#fff8ec" radius={0.12} />
      <Slab position={[-width / 2 + 0.07, 0.4, -depth * 0.18]} size={[0.14, 0.84, depth * 0.62]} color="#fff8ec" radius={0.1} />
      <Slab position={[width / 2 - 0.07, 0.4, -depth * 0.18]} size={[0.14, 0.84, depth * 0.62]} color="#fff8ec" radius={0.1} />
      <Block position={[0, 0.92, -depth / 2 + 0.14]} size={[width * 0.48, 0.055, 0.055]} color={accent} radius={0.08} />
      {children}
    </group>
  );
}

function Office({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <group>
      <Slab position={[0, -0.1, 0]} size={[12.6, 0.32, 9.35]} color={palette.ink} radius={0.55} metalness={0.22} />
      <Slab position={[0, 0.13, 0]} size={[12.35, 0.13, 9.1]} color="#ebe4d7" radius={0.48} />

      {/* Six open, individually furnished rooms form a clear customer journey. */}
      <Room position={[-4, 0, -1.65]} size={[3.45, 2.55]} floor={palette.discovery} accent="#dd8061" progress={progress} stage={1}>
        <Table position={[0, 0.34, 0.05]} size={[1.35, 0.78, 0.68]} />
        <Person position={[-0.76, 0.3, 0.24]} role="customer" stage={1} progress={progress} phase={0.5} />
        <Person position={[0.76, 0.3, 0.24]} role="host" stage={1} progress={progress} phase={1.5} />
        <Screen position={[0, 1.1, -1.12]} size={[0.92, 0.66]} color="#fff5e9" />
        <Block position={[-0.26, 1.12, -1.03]} size={[0.2, 0.17, 0.025]} color="#e98a68" />
        <Block position={[0.05, 1.12, -1.03]} size={[0.2, 0.17, 0.025]} color="#81c8b5" />
        <Block position={[0.35, 1.12, -1.03]} size={[0.2, 0.17, 0.025]} color="#ecc96b" />
      </Room>

      <Room position={[0, 0, -3.15]} size={[3.45, 2.55]} floor={palette.strategy} accent="#7954b8" progress={progress} stage={2}>
        <Table position={[0, 0.34, 0.08]} size={[1.42, 0.78, 0.7]} color="#fffdf7" />
        <Person position={[-0.85, 0.3, 0.32]} role="leader" stage={2} progress={progress} phase={1.1} />
        <Person position={[0.85, 0.3, 0.32]} role="host" stage={2} progress={progress} phase={2.1} />
        <Screen position={[0, 1.1, -1.12]} size={[1.05, 0.67]} color="#f8f3ff" />
        {["#ef9d76", "#7fc5ae", "#f2ca5f"].map((color, index) => (
          <Block key={color} position={[-0.32 + index * 0.32, 1.12, -1.025]} size={[0.22, 0.3, 0.025]} color={color} />
        ))}
      </Room>

      <Room position={[4, 0, -1.65]} size={[3.45, 2.55]} floor={palette.design} accent="#d0a331" progress={progress} stage={3}>
        <Table position={[0, 0.34, 0.08]} size={[1.65, 0.78, 0.78]} />
        <Person position={[-0.87, 0.3, 0.32]} role="host" stage={3} progress={progress} phase={0.8} />
        <Person position={[0.87, 0.3, 0.32]} role="customer" stage={3} progress={progress} phase={1.8} />
        <Block position={[-0.28, 0.83, -0.03]} size={[0.4, 0.025, 0.35]} color="#e98a68" />
        <Block position={[0.28, 0.83, -0.03]} size={[0.4, 0.025, 0.35]} color="#83c9b5" />
        <Block position={[0, 0.96, -0.04]} size={[0.62, 0.025, 0.035]} color="#4a6960" />
      </Room>

      <Room position={[4, 0, 1.65]} size={[3.45, 2.55]} floor={palette.build} accent="#287cb5" progress={progress} stage={4}>
        <Table position={[0, 0.34, 0.04]} size={[1.72, 0.78, 0.72]} />
        <Person position={[-0.88, 0.3, 0.33]} role="engineering" stage={4} progress={progress} phase={0.65} />
        <Person position={[0.88, 0.3, 0.33]} role="engineering" stage={4} progress={progress} phase={2.65} />
        <Screen position={[-0.48, 0.9, -0.11]} size={[0.54, 0.43]} color="#e9f7ff" />
        <Screen position={[0.48, 0.9, -0.11]} size={[0.54, 0.43]} color="#edf3ff" />
        <Block position={[-0.47, 0.91, -0.062]} size={[0.3, 0.025, 0.014]} color="#42a8d0" />
        <Block position={[0.45, 0.94, -0.062]} size={[0.31, 0.025, 0.014]} color="#8971d0" />
      </Room>

      <Room position={[0, 0, 3.15]} size={[3.45, 2.55]} floor={palette.delivery} accent="#348e79" progress={progress} stage={5}>
        <Table position={[0, 0.34, 0.1]} size={[1.5, 0.78, 0.65]} />
        <Person position={[-0.78, 0.3, 0.33]} role="host" stage={5} progress={progress} phase={0.4} />
        <Person position={[0.78, 0.3, 0.33]} role="leader" stage={5} progress={progress} phase={2.4} />
        <Screen position={[0, 1.1, -1.11]} size={[0.95, 0.66]} color="#effcf6" />
        {[0, 1, 2].map((index) => (
          <Block key={index} position={[-0.22 + index * 0.22, 1.12, -1.02]} size={[0.1, 0.34, 0.025]} color={index === 1 ? "#50aa8e" : "#f0bd48"} />
        ))}
      </Room>

      <Room position={[-4, 0, 1.65]} size={[3.45, 2.55]} floor={palette.outcomes} accent="#648e42" progress={progress} stage={6}>
        <Person position={[-0.82, 0.3, 0.39]} role="customer" stage={6} progress={progress} phase={1.2} />
        <Person position={[0.82, 0.3, 0.39]} role="host" stage={6} progress={progress} phase={2.2} />
        <Block position={[0, 0.75, -0.04]} size={[1.45, 0.08, 0.68]} color="#fffaf0" radius={0.1} />
        {[0, 1, 2, 3].map((index) => (
          <Block key={index} position={[-0.48 + index * 0.32, 0.9 + index * 0.13, -0.035]} size={[0.17, 0.28 + index * 0.26, 0.12]} color={["#4c9b73", "#f0bd48", "#ee926f", "#5fa8c5"][index]} radius={0.08} />
        ))}
        <mesh position={[0.86, 0.99, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.045, 10, 36]} />
          <meshStandardMaterial color="#fffaf0" roughness={0.35} metalness={0.15} />
        </mesh>
      </Room>

      {/* The shared customer hub stays visible between every department. */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.38, 1.48, 0.26, 64]} />
        <meshPhysicalMaterial color="#fffaf0" roughness={0.3} metalness={0.12} clearcoat={0.45} />
      </mesh>
      <mesh position={[0, 0.49, 0]}>
        <torusGeometry args={[1.08, 0.045, 12, 64]} />
        <meshStandardMaterial color="#e3b44e" emissive="#d6a334" emissiveIntensity={0.16} metalness={0.55} roughness={0.28} />
      </mesh>
      <Table position={[0, 0.52, 0]} size={[1.2, 0.68, 0.68]} color="#e9f3ec" />
      <Person position={[-0.72, 0.47, 0.63]} role="customer" stage={0} progress={progress} phase={0.8} />
      <Person position={[0.72, 0.47, 0.63]} role="host" stage={0} progress={progress} phase={1.8} />
      <Person position={[0, 0.47, -0.83]} role="leader" stage={0} progress={progress} phase={2.8} />

      <JourneyPath progress={progress} />
    </group>
  );
}

const journeyStations = [
  new THREE.Vector3(0, 0.35, 0),
  new THREE.Vector3(-4, 0.35, -1.65),
  new THREE.Vector3(0, 0.35, -3.15),
  new THREE.Vector3(4, 0.35, -1.65),
  new THREE.Vector3(4, 0.35, 1.65),
  new THREE.Vector3(0, 0.35, 3.15),
  new THREE.Vector3(-4, 0.35, 1.65),
  new THREE.Vector3(0, 0.35, 0),
];

function JourneyPath({ progress }: { progress: React.MutableRefObject<number> }) {
  const markers = useRef<Array<THREE.Mesh | null>>([]);
  const route = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(-2.4, 0.35, -0.45),
    new THREE.Vector3(-4, 0.35, -1.65),
    new THREE.Vector3(-2.4, 0.35, -3.2),
    new THREE.Vector3(0, 0.35, -3.15),
    new THREE.Vector3(2.5, 0.35, -2.6),
    new THREE.Vector3(4, 0.35, -1.65),
    new THREE.Vector3(4, 0.35, 1.65),
    new THREE.Vector3(2.4, 0.35, 3.2),
    new THREE.Vector3(0, 0.35, 3.15),
    new THREE.Vector3(-2.5, 0.35, 2.55),
    new THREE.Vector3(-4, 0.35, 1.65),
    new THREE.Vector3(-2.4, 0.35, 0.4),
    new THREE.Vector3(0, 0.35, 0),
  ], false, "centripetal"), []);
  const stationTimes = useMemo(() => journeyStations.map((station, stationIndex) => {
    if (stationIndex === 0) return 0;
    if (stationIndex === journeyStations.length - 1) return 1;
    let nearestTime = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let sample = 0; sample <= 400; sample += 1) {
      const time = sample / 400;
      const distance = route.getPointAt(time).distanceToSquared(station);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTime = time;
      }
    }
    return nearestTime;
  }), [route]);

  useFrame(({ clock }) => {
    const stage = THREE.MathUtils.clamp(progress.current, 0, 6);
    const start = stationTimes[Math.floor(stage)];
    const end = stationTimes[Math.floor(stage) + 1];
    const blend = stage - Math.floor(stage);
    const head = THREE.MathUtils.lerp(start, end, blend) + 0.0025 * Math.sin(clock.elapsedTime * 1.8);
    markers.current.forEach((marker, index) => {
      if (!marker) return;
      marker.position.copy(route.getPointAt(THREE.MathUtils.euclideanModulo(head - index * 0.025, 1)));
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[route, 220, 0.035, 8, false]} />
        <meshStandardMaterial color="#d4a64e" metalness={0.28} roughness={0.48} transparent opacity={0.82} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} ref={(mesh) => { markers.current[index] = mesh; }}>
          <sphereGeometry args={[index === 0 ? 0.11 : 0.065, 16, 12]} />
          <meshBasicMaterial color={index === 0 ? "#fff5ce" : "#40bda5"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const look = useRef(new THREE.Vector3(0, 0.8, 0));
  const { size } = useThree();
  const mobile = size.width < 680;
  const targets = [
    { position: [12, 15, 17], look: [0, 0.55, 0] },
    { position: [3.5, 7.4, 6.4], look: [-4, 0.6, -1.65] },
    { position: [6.8, 7.4, 5.3], look: [0, 0.6, -3.15] },
    { position: [10.6, 7.4, 4.8], look: [4, 0.6, -1.65] },
    { position: [10.6, 7.4, 8.5], look: [4, 0.6, 1.65] },
    { position: [6.8, 7.4, 10.2], look: [0, 0.6, 3.15] },
    { position: [2.5, 7.4, 9.2], look: [-4, 0.6, 1.65] },
    { position: [12, 15, 17], look: [0, 0.55, 0] },
  ];

  useFrame(({ camera }, delta) => {
    const value = THREE.MathUtils.clamp(progress.current, 0, 6.999);
    const index = Math.min(Math.floor(value), targets.length - 2);
    const mix = THREE.MathUtils.smoothstep(value - index, 0, 1);
    const a = targets[index];
    const b = targets[index + 1];
    const desired = new THREE.Vector3(...a.position).lerp(new THREE.Vector3(...b.position), mix);
    const desiredLook = new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), mix);
    if (mobile) {
      desired.sub(desiredLook).multiplyScalar(0.88).add(desiredLook);
    }
    const easing = 1 - Math.exp(-delta * 2.7);
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
    perspective.fov = size.width < 680 ? 48 : size.width < 900 ? 70 : 52;
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
      setActiveStep((previous) => previous === nextStep ? previous : nextStep);
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
      <div className="office-canvas" role="img" aria-label="A polished three-dimensional customer journey through discovery, alignment, design, engineering, delivery and business outcomes">
        <Canvas
          camera={{ position: [12, 15, 17], fov: 34, near: 0.1, far: 100 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          frameloop="always"
          shadows
        >
          <color attach="background" args={[palette.paper]} />
          <hemisphereLight args={["#fffdf6", "#91a59a", 0.95]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[-7, 12, 8]} intensity={1.45} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-radius={2} />
          <directionalLight position={[8, 7, -8]} intensity={0.4} color="#fff0d8" />
          <ResponsiveCamera />
          <CameraRig progress={progress} />
          <Office progress={progress} />
        </Canvas>
      </div>
      <SceneWayfinding activeStep={activeStep} />
    </>
  );
}
