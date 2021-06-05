import React, { Suspense } from 'react'
import './App.css'
import TabelView from './views/TableView'

function App() {
  return (
    <div className="App" id="app">
      <Suspense fallback={'loading...'}>
        <TabelView />
      </Suspense>
    </div>
  )
}

export default App
