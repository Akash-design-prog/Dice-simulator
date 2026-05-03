import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { RoundedBox, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { Dices, History } from 'lucide-react'
import * as THREE from 'three'

// Import dice images
import dice2Img from '../dice_2.jpg'

// This function creates the texture for each side of the dice
const createDiceTexture = (number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 256, 256);

  // Dots (Pips)
  ctx.fillStyle = '#000000'; // Pure Black
  const dotSize = 35; // Larger dots to fill the face
  const margin = 50;  // Pushed way out to the edges
  const center = 128;

  const dots = {
    1: [[center, center]],
    2: [[256 - margin, margin], [margin, 256 - margin]],
    3: [[256 - margin, margin], [center, center], [margin, 256 - margin]],
    4: [[margin, margin], [256 - margin, margin], [margin, 256 - margin], [256 - margin, 256 - margin]],
    5: [[margin, margin], [256 - margin, margin], [center, center], [margin, 256 - margin], [256 - margin, 256 - margin]],
    6: [[margin, margin], [256 - margin, margin], [margin, center], [256 - margin, center], [margin, 256 - margin], [256 - margin, 256 - margin]]
  };

  dots[number].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const DiceModel = ({ value, isRolling }) => {
  const meshRef = useRef()
  
  // Load images
  const dice2Texture = useLoader(THREE.TextureLoader, dice2Img)
  
  // Ensure texture stretches to fill the face
  useMemo(() => {
    if (dice2Texture) {
      dice2Texture.wrapS = THREE.ClampToEdgeWrapping;
      dice2Texture.wrapT = THREE.ClampToEdgeWrapping;
      dice2Texture.repeat.set(1, 1);
      dice2Texture.offset.set(0, 0);
      dice2Texture.needsUpdate = true;
    }
  }, [dice2Texture]);
  
  // Create textures for 1 through 6
  const textures = useMemo(() => ({
    1: createDiceTexture(1),
    2: dice2Texture,
    3: createDiceTexture(3),
    4: createDiceTexture(4),
    5: createDiceTexture(5),
    6: createDiceTexture(6),
    blank: createDiceTexture(1)
  }), [dice2Texture]);

  useFrame((state, delta) => {
    if (isRolling) {
      // Wild tumbling while rolling
      meshRef.current.rotation.x += delta * 15
      meshRef.current.rotation.y += delta * 12
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.5
    } else {
      // Smoothly snap to front-facing view when stopped
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.2)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.2)
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.2)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.2)
    }
  })

  // We apply the current texture to ALL faces so it's impossible to miss
  const currentTexture = value ? textures[value] : textures.blank;

  return (
    <RoundedBox ref={meshRef} args={[1.3, 1.3, 1.3]} radius={0.15} smoothness={4}>
      <meshStandardMaterial attach="material-0" map={currentTexture} roughness={0.05} metalness={0.1} />
      <meshStandardMaterial attach="material-1" map={currentTexture} roughness={0.05} metalness={0.1} />
      <meshStandardMaterial attach="material-2" map={currentTexture} roughness={0.05} metalness={0.1} />
      <meshStandardMaterial attach="material-3" map={currentTexture} roughness={0.05} metalness={0.1} />
      <meshStandardMaterial attach="material-4" map={currentTexture} roughness={0.05} metalness={0.1} />
      <meshStandardMaterial attach="material-5" map={currentTexture} roughness={0.05} metalness={0.1} />
    </RoundedBox>
  )
}

function App() {
  const [currentRoll, setCurrentRoll] = useState(null)
  const [history, setHistory] = useState([])
  const [isRolling, setIsRolling] = useState(false)

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true)
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/api/roll`)
        const data = await response.json()
        setCurrentRoll(data.result)
        setHistory(prev => [{ value: data.result }, ...prev].slice(0, 10))
      } catch (error) {
        alert("Check backend!")
      } finally {
        setIsRolling(false)
      }
    }, 800)
  }

  return (
    <div className="max-w-2xl w-full p-6 space-y-8 flex flex-col items-center select-none">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-black tracking-tighter text-white flex items-center justify-center gap-4 italic">
          <Dices className="w-12 h-12 text-purple-500 not-italic" />
          DICE.PRO
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Real-time WebGL Simulation</p>
      </div>

      <div className="w-full aspect-square max-w-sm bg-slate-900 rounded-[3rem] border-4 border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/10">
        <Canvas shadow>
          <PerspectiveCamera makeDefault position={[0, 0.05, 4]} />
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={1.5} color="#ffffff" />
          <group position={[0, 0.5, 0]}>
            <DiceModel value={currentRoll} isRolling={isRolling} />
          </group>
          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={8} blur={2.5} far={4} />
          <Environment preset="city" />
        </Canvas>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-2xl tracking-tighter transition-all shadow-[0_8px_0_rgb(126,34,206)] active:shadow-none active:translate-y-2 disabled:opacity-50 disabled:translate-y-2 disabled:shadow-none"
          >
            {isRolling ? 'ROLLING...' : 'ROLL DICE'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm bg-slate-800/20 rounded-3xl p-6 border border-slate-700/30">
        <h2 className="flex items-center gap-2 font-black text-slate-600 mb-4 uppercase tracking-[0.2em] text-[10px]">
          <History className="w-3 h-3" />
          Live Session History
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {history.map((roll, i) => (
            <div key={i} className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 text-xl shadow-lg">
              {roll.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
