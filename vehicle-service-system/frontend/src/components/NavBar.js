import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AutoService Pro
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/components">Components</Button>
        <Button color="inherit" component={Link} to="/vehicles">Vehicles</Button>
        <Button color='inherit' component = {Link} to="/issues">Add an issue</Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default NavBar