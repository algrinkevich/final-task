import { Route, Routes } from "react-router-dom"

import Authentication from "../src/pages/authentication/authentication.component"
import InitialPage from "../src/pages/initial-page/initial-page.component"

import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
      <Route path="auth" element={<Authentication />} />
    </Routes>
  )
}

export default App
