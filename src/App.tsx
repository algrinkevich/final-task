import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

import Authentication from "../src/pages/authentication/authentication.component";
import Header from "./pages/header/header.component";
import InitialPage from "./pages/initial-page/initial-page.component";
import SearchPage from "./pages/search-page/search-page.component";
import { setCurrentUser } from "./store/user/user.slice";
import { onAuthStateChangedListener } from "./utils/firebase/firebase.utils";

import "./App.scss";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubcribe = onAuthStateChangedListener((user: User | null) => {
      dispatch(setCurrentUser(user));

      if (user) {
        navigate("/search");
      } else if (location.pathname !== "/") {
        navigate("/auth");
      }
    });

    return unsubcribe;
  }, [dispatch, navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<InitialPage />} />
      <Route path="auth" element={<Authentication />} />
      <Route path="search" element={<Header />}>
        <Route index element={<SearchPage />} />
      </Route>
    </Routes>
  );
};

export default App;
