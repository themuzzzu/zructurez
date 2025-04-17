
import { useNavigate } from "react-router-dom";
import BusinessDashboard from "../BusinessDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  
  return <BusinessDashboard />;
}
