import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { GameContextProvider } from './context/GameContext.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <GameContextProvider>
        <App />
    </GameContextProvider>
);