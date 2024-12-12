import React from "react";
import "./styles/App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MovieSearchXml from "./pages/search/MovieSearchXml";
import Showtimes from "./pages/showtimes/Showtimes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/authContext";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Logout from "./pages/logout/logout";
import Delete from "./pages/delete/delete";
import { Toaster } from "react-hot-toast";
import ShowtimePage from "./pages/showtime/showtimePage";
import GroupForum from "./pages/forum/GroupForum";
import Home from "./pages/home/Home";
import GroupPageGeneral from "./pages/groups/groupsPageGeneral";
// import TheaterShowtimes from "./components/footer/TheaterShowtimes";
// import MovieShowtimes from "./MovieShowtimes"; // removed for now since I can't find the pages for some reason
import AboutUs from "./pages/aboutUs/AboutUs";
import Creategroup from "./pages/groups/Creategroup";
import GroupPage from "./pages/groups/groupsPage";
import YourGroups from "./pages/groups/yourGroups";
import FavouritePage from "./pages/favourite/favourites";

function App() {
  return (
    <AuthProvider>
      <Toaster />

      <div className="App">
        <BrowserRouter>
          <Header></Header>
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/delete/:id" element={<Delete />} />
              <Route path="/showtimes" element={<Showtimes />} />
              <Route path="/showtime/:id" element={<ShowtimePage />} />
              <Route path="/search" element={<MovieSearchXml />}></Route>
              <Route path="/favourites" element={<FavouritePage />}></Route>
              <Route path="/forum/:id" element={<GroupForum />} />
              <Route path="/aboutus" element={<AboutUs />}></Route>

              {/* Group Pages */}
              <Route path="/groups" element={<GroupPageGeneral />} />
              <Route path="/groupPage/:groupId" element={<GroupPage />} />
              <Route path="/createGroup" element={<Creategroup />} />
              <Route path="/yourGroup" element={<YourGroups />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Footer></Footer>
      </div>
    </AuthProvider>
  );
}

export default App;
