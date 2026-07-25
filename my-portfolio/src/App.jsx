import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home, Studio} from "./pages/Home";
import { NotFound } from "./pages/NOTFOUND";
import { Toaster } from "react-hot-toast";
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
        <Route path="/studio" element={<Studio />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
