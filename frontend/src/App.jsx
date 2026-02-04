import { Routes, Route, useLocation } from "react-router-dom";
import UserLayout from "./user/Layout/UserLayout";

import Home from "./user/Pages/Home";
import Puja from "./user/Pages/Puja";
import PujaBooking from "./user/Pages/PujaBooking";
import Products from "./user/Pages/Products";
import Gallery from "./user/Pages/Gallery";
import Pind_Dan from "./user/Pages/Pind_Dan";
import Puuja from "./user/Pages/Puuja";
import SignIn from "./user/Pages/SignIn";
import SignUp from "./user/Pages/SignUp";
import NavbarOnlyLayout from "./user/Layout/NavbarOnlyLayout"
import ProfileSection from "./user/Pages/ProfileSection"
import HelpSupportSection from "./user/Pages/HelpSupportSection"

import { RightFloatingMenu } from "./user/Components/RightFloatingMenu";

function App() {
  const location = useLocation();

  // Hide floating menu on both SignIn and SignUp pages
  const hideFloatingMenu = 
    ["/signin", "/signup", "/profile", "/help"].includes(location.pathname);

  return (
    <>
      <Routes >
        {/* Pages WITH navbar & footer (Layout wrapped) */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/puja" element={<Puja />} />
          <Route path="/puja/:id" element={<PujaBooking />} />
          <Route path="/katha" element={<Puuja />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pind_dan" element={<Pind_Dan />} />
        </Route>

        <Route element={<NavbarOnlyLayout />}>
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/help" element={<HelpSupportSection />} />
        </Route>

        {/* Auth Pages WITHOUT layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      {/* Floating menu logic */}
      {!hideFloatingMenu && <RightFloatingMenu />}
    </>
  );
}

export default App;