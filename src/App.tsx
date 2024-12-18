import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { auth } from "./firebase/firebaseConfig";
import ErrorPage from "./components/LandingPage/ErrorPage";
import { ToastContainer } from "react-toastify";
import settingStore from "./store/settingStore";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { themeMode } = settingStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        draggable
        theme={themeMode === "light" ? "light" : "dark"}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default App;
