import { lazy, Suspense } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Home } from "./pages/Home";

const Studio = lazy(() => import("./pages/Studio").then((mod) => ({ default: mod.Studio })));
const NotFound = lazy(() => import("./pages/NOTFOUND").then((mod) => ({ default: mod.NotFound })));

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid rgb(var(--border))",
            borderRadius: "8px",
            background: "rgb(var(--card))",
            color: "rgb(var(--foreground))",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
          },
          success: {
            iconTheme: {
              primary: "rgb(var(--primary))",
              secondary: "rgb(var(--primary-foreground))",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}/>
          <Route path="/studio" element={
            <Suspense fallback={<div aria-busy="true" className="min-h-screen" />}>
              <Studio />
            </Suspense>
          }/>
          <Route path="/studis" element={
            <Suspense fallback={<div aria-busy="true" className="min-h-screen" />}>
              <Studio />
            </Suspense>
          }/>
          <Route path="*" element={
            <Suspense fallback={<div aria-busy="true" className="min-h-screen" />}>
              <NotFound />
            </Suspense>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
