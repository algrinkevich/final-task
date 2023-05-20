import { Route, Routes } from "react-router-dom"

import InitialPage from "../src/pages/initial-page/initial-page.component"

import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
    </Routes>
  )
}

export default App
