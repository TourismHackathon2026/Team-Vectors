import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './layouts/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ExploreMap from './pages/ExploreMap';
import HeritageDetails from './pages/HeritageDetails';
import Passport from './pages/Passport';
import Stamps from './pages/Stamps';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Quests from './pages/Quests';
import Itinerary from './pages/Itinerary';
import MemoryBook from './pages/MemoryBook';
import Emergency from './pages/Emergency';
import Story from './pages/Story';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/explore-map" element={<ExploreMap />} />
                <Route path="/heritage/:id" element={<HeritageDetails />} />
                <Route path="/passport" element={<Passport />} />
                <Route path="/stamps" element={<Stamps />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/itinerary" element={<Itinerary />} />
                <Route path="/memory-book" element={<MemoryBook />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/story" element={<Story />} />
              </Route>
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
