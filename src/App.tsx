import { ShapeContextProvider } from './ShapeContext';
import UI from './ui';

function App() {
  return (
    <div>
      <header>
        <ShapeContextProvider>
          <UI/>
        </ShapeContextProvider>
      </header>
    </div>
  );
}

export default App;
