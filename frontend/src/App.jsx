import { Routes, Route, useLocation } from "react-router-dom";
import UserLayout from "./user/Layout/UserLayout";
import NavbarOnlyLayout from "./user/Layout/NavbarOnlyLayout";
import {ProtectedLayout,CustomerProtectedLayout} from "./user/Layout/ProtectedLayout";

import Home from "./user/Pages/Home";
import Gallery from "./user/Pages/Gallery";
import Pind_Dan from "./user/Pages/Pind_Dan";

import HomePuja from "./user/Pages/HomePuja";
import HomePujaBooking from "./user/Pages/HomePujaBooking";
import HomePujaPaymentDetails from "./user/Pages/HomePujaPaymentDetails";

import TemplePuja from "./user/Pages/TemplePuja";
import TemplePujaBooking from "./user/Pages/TemplePujaBooking";

import KathaPuja from "./user/Pages/KathaPuja";
import KathaPujaBooking from "./user/Pages/KathaPujaBooking";
import KathaPujaBookingDetails from "./user/Pages/KathaPujaBookingDetails";

import ProfileSection from "./user/Pages/ProfileSection";
import HelpSupportSection from "./user/Pages/HelpSupportSection";
import ManageSankalp from "./user/Pages/ManageSankalp";
import SavedAddresses from "./user/Pages/SavedAddresses";
import MyBookings from "./user/Pages/MyBooking";

import SignIn from "./user/Pages/SignIn";
import SignUp from "./user/Pages/SignUp";
import PartnerSignIn from "./user/Pages/PartnerSignIn";
import PartnerSignUp from "./user/Pages/PartnerSignUp";
import PartnerDashboard from "./user/Pages/PartnerDashboard";

import CustomerCareSignIn from "./admin/pages/CustomerCareSignIn";

import ScrollToTop from "./user/Components/ScrollToTop";

import { RightFloatingMenu } from "./user/Components/RightFloatingMenu";
import CustomerCareDashboard from "./admin/pages/CustomerCareDashboard";

function App() {
  const location = useLocation();

  const hideFloatingMenu =
    ["/signin", "/signup", "/profile", "/help", '/manageSankalp', "/savedAddresses", "/partnerSignIn"
      , "/partnerSignUp", "/partner/dashboard", "/customerCare/signIn", "/customerCare/dashboard"
    ]
      .includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* ================= PUBLIC USER LAYOUT ================= */}
        <Route element={<UserLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pind_dan" element={<Pind_Dan />} />

          {/* Home Puja */}
          <Route path="/homePuja">
            <Route index element={<HomePuja />} />
            <Route path=":id" element={<HomePujaBooking />} />

            {/* 🔐 Protected Payment */}
            <Route element={<ProtectedLayout />}>
              <Route
                path="payment-details/:id"
                element={<HomePujaPaymentDetails />}
              />
            </Route>
          </Route>

          {/* Katha Jaap */}
          <Route path="/katha-jaap">
            <Route index element={<KathaPuja />} />
            <Route path=":id" element={<KathaPujaBooking />} />

            {/* 🔐 Protected Payment */}
            <Route element={<ProtectedLayout />}>
              <Route
                path="payment-details/:id"
                element={<KathaPujaBookingDetails />}
              />
            </Route>
          </Route>

          {/* Temple Puja */}
          <Route path="/temple-puja">
            <Route index element={<TemplePuja />} />
            <Route path=":id" element={<TemplePujaBooking />} />
          </Route>

          {/* 🔐 My Booking Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/my-booking" element={<MyBookings />} />
          </Route>

        </Route>

        {/* ================= NAVBAR ONLY LAYOUT ================= */}
        <Route element={<NavbarOnlyLayout />}>

          {/* 🔐 Protected Profile Section */}
          <Route element={<ProtectedLayout />}>
            <Route path="/profile" element={<ProfileSection />} />
            <Route path="/manageSankalp" element={<ManageSankalp />} />
            <Route path="/savedAddresses" element={<SavedAddresses />} />
          </Route>

          <Route path="/help" element={<HelpSupportSection />} />

        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/partnerSignIn" element={<PartnerSignIn />} />
        <Route path="/partnerSignUp" element={<PartnerSignUp />} />

        {/* ================= PARTNER ROUTES ================= */}
        <Route element={<ProtectedLayout />}>
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        </Route>

        <Route path='/customerCare/signIn' element={<CustomerCareSignIn />} />

        <Route element={<CustomerProtectedLayout />}>
          <Route path="/customerCare/dashboard" element={<CustomerCareDashboard />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<h1>Not Found</h1>} />

      </Routes>

      {!hideFloatingMenu && <RightFloatingMenu />}
    </>
  );
}

export default App;
