// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import React from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'

function Tilt({children}) {
  const tiltRef = React.useRef() //We create the reference to the DOM node but it is undefined
  // console.log(tiltRef.current)
  React.useEffect(() => {
    const tiltNode = tiltRef.current //We are getting the DOM node value with the current prop

    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 100,
      glare: true,
      'max-glare': 0.2,
    })

    return () => tiltNode.vanillaTilt.destroy() //We return a cleanup function, that executes when the component dismounts
  }, []) //If we don't specify our effect's dependencies array, the component depends of everything, but we know that tiltNode doesn't changes, so we use []

  return (
    <div className="tilt-root" ref={tiltRef}>
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">gorimobile</div>
    </Tilt>
  )
}

export default App
