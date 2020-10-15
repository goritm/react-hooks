// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useState, useRef, useEffect} from 'react'

//CUSTOM HOOK: FUNCTION THAT USES HOOKS, SHOULD START WITH 'use' PREFIX
function useLocalStorageState(
  key,
  defaultValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {}, //Options default values (stringify and parse), and object default value ({})
) {
  //Lazy State Initialization () => {}: We convert the parameter of useState to a function, so that it only runs in the first render
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) return deserialize(valueInLocalStorage)
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = useRef(key) //We create a reference of the key, so that we won't re-render the component

  useEffect(() => {
    // console.log('Render!')
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      // If key changes between renders, we remove the old key from local storage
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state)) //We use serialize to support other data types
  }, [key, serialize, state]) //Dependency array: re-renders when state dependency changes

  return [state, setState]
}

//FUNCTION COMPONENT
function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)
  // const [name, setName] = useState(initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Jose" />
}

export default App
