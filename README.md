# 🎲 DICE.PRO - 3D WebGL Dice Simulator

A professional-grade, full-stack dice rolling application featuring high-fidelity 3D graphics and server-side randomness.

![Dice Pro Preview](https://play-dice-simulator.vercel.app/favicon.svg)

## 🚀 Live Demo
Check it out here: [play-dice-simulator.vercel.app](https://play-dice-simulator.vercel.app/)

## ✨ Features
- **Real-time 3D Simulation**: Powered by Three.js and React Three Fiber.
- **Server-Side Truth**: Randomness is generated on the backend to prevent client-side tampering.
- **Dynamic Textures**: Dice faces are rendered dynamically using HTML5 Canvas for instant loading and zero-asset overhead.
- **Premium Materials**: Uses `meshStandardMaterial` with custom roughness and metalness for a polished acrylic look.
- **Responsive UI**: Fully optimized for mobile and desktop using Tailwind CSS v4.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Three.js, React Three Fiber, Tailwind CSS v4.
- **Backend**: Node.js, Express.
- **Deployment**: Vercel (Monorepo configuration).

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/dice-simulator.git
cd dice-simulator
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🎨 Design Philosophy
- **Lighting**: A combination of `ambientLight` (1.2 intensity), `spotLight` for shadows, and a `pointLight` for specular highlights.
- **Environment**: Uses the `city` preset from `@react-three/drei` to provide realistic reflections on the white dice body.
- **Physics Feel**: Implements custom easing using `THREE.MathUtils.lerp` to make the dice "snap" into view after a wild tumble.

## 🚢 Deployment (Vercel)
The project is configured as a monorepo using `vercel.json`. It automatically routes API requests to the `backend/server.js` and serves the static React files from the `frontend/dist` folder.

## 🗺️ To do list
- [ ] **Global Luck**: MongoDB integration to track global roll statistics.
- [ ] **Audio**: Spatial 3D sound effects for dice collisions.
- [ ] **Customization**: Ability for users to change dice and dot colors.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.