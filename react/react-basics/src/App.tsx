import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './Welcome.tsx'
import Greeting from './Greeting.tsx'
import Counter from './Counter.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Hello, this is React!</h1>
      <Welcome />
      <Greeting name="Jace" />
      <Counter />
    </div>
  )
}

export default App
