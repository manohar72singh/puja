import { Routes, Route, useLocation } from "react-router-dom";
import UserLayout from "./user/Layout/UserLayout";

import Home from "./user/Pages/Home";
import HomePuja from "./user/Pages/HomePuja";
import HomePujaBooking from "./user/Pages/HomePujaBooking";
import TemplePuja from "./user/Pages/TemplePuja";
import TemplePujaBooking from "./user/Pages/TemplePujaBooking";
import Gallery from "./user/Pages/Gallery";
import Pind_Dan from "./user/Pages/Pind_Dan";
import SignIn from "./user/Pages/SignIn";
import SignUp from "./user/Pages/SignUp";
import NavbarOnlyLayout from "./user/Layout/NavbarOnlyLayout"
import ProfileSection from "./user/Pages/ProfileSection"
import HelpSupportSection from "./user/Pages/HelpSupportSection"
import HomePujaPaymentDetails from "./user/Pages/HomePujaPaymentDetails";
import ManageSankalp from "./user/Pages/ManageSankalp";
import SavedAddresses from "./user/Pages/SavedAddresses";

import MyBookings from "./user/Pages/MyBooking";
import { RightFloatingMenu } from "./user/Components/RightFloatingMenu";
import PartnerSignIn from "./user/Pages/PartnerSignIn";
import PartnerSignUp from "./user/Pages/PartnerSignUp";
import UserAddressForm from "./user/Pages/UserAddressFrom"
import AddFamilyMemberForm from "./user/Pages/AddFamilyMemberForm";
import PartnerDashboard from "./user/Pages/PartnerDashboard";

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

          <Route path="/homePuja">
            <Route index element={<HomePuja />} />
            <Route path=":id" element={<HomePujaBooking />} />
            <Route path="payment-details" element={<HomePujaPaymentDetails />} />
          </Route>

          <Route path="/templePuja" element={<TemplePuja />} />
          <Route path="/templePuja/:id" element={<TemplePujaBooking />} />
          <Route path="/mybooking" element={<MyBookings />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pind_dan" element={<Pind_Dan />} />
        </Route>

        <Route element={<NavbarOnlyLayout />}>
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/help" element={<HelpSupportSection />} />

          <Route path="/manageSankalp" >
            <Route index element={<ManageSankalp />} />
            <Route path="add" element={<AddFamilyMemberForm />} />
          </Route>

          <Route path="/savedAddresses">
            <Route index element={<SavedAddresses />} />
            <Route path="add" element={<UserAddressForm />} />
            <Route path="edit/:id" element={<UserAddressForm />} />
          </Route>
        </Route>

        {/* Auth Pages WITHOUT layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/partnerSignIn" element={<PartnerSignIn />} />
        <Route path="/partnerSignUp" element={<PartnerSignUp />} />

        {/* Partner Routes */}
        <Route path="/partner">
          <Route path="dashboard" element={<PartnerDashboard />} />
          {/* <Route path="profile" element={<PartnerProfile />} /> Aapka Profile Edit Page */}
        </Route>
      </Routes>

      {/* Floating menu logic */}
      {!hideFloatingMenu && <RightFloatingMenu />}
    </>
  );
}

export default App;