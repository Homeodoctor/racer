import { Suspense } from "react";
import RacingGame from "./components/RacingGame";
import "@fontsource/inter";
import "./index.css";

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading Racing Game...</p>
          </div>
        </div>
      }>
        <RacingGame />
      </Suspense>
    </div>
  );
}

export default App;
