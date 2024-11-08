import './sass/app.scss/';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import "./sass/app.scss";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router >

  )
}

export default App;
