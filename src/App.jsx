// APP.JSX - Le composant racine
// C'est le point d'entrée de ton interface.
// Il contient juste la "scène" et le livre.
//
// En React, l'arbre de composants ressemble à ça :
//   <App>
//     <div.scene>
//       <Book>
//         <Rings />
//         <Cover />
//         <LoginPage />
//         <SportCover />
//         <SportPage />
//         ...
//       </Book>
//     </div.scene>
//   </App>

import Book from './components/Book';
import './App.css';

function App() {
  return (
    <div className="scene">
      <Book />
    </div>
  );
}

export default App;
