import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import ComponentForm from './components/ComponentForm';
import VehicleForm from './components/VehicleForm';
import IssueForm from './components/IssueForm';
import Payment from './components/Payment';

function App() {
  return (
    <Router>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/components" element={<ComponentForm />} />
          <Route path="/vehicles" element={<VehicleForm />} />
          <Route path="/issues" element={<IssueForm />} />
          <Route path="/payment/:issueId" element={<Payment />} />
          
        </Routes>
      </Container>
    </Router>
  );
}

export default App