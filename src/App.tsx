import React, { createContext, createRef, RefObject, Suspense } from 'react'
import './App.css'
import TabelView from './views/TableView'

export const AppContext = createContext<RefObject<any> | null>(null)

function App() {
  const appRef = createRef<HTMLDivElement>()
  return (
    <div className="App" id="app" ref={appRef}>
      <AppContext.Provider value={appRef}>
        <Suspense fallback={'loading...'}>
          <TabelView />
        </Suspense>
      </AppContext.Provider>
    </div>
  )
}

export default App
