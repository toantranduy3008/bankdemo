import { Navigate } from "react-router-dom"; 'react-router-dom';

import { getCurrentUser } from "../services/AuthServices";

const ProtectedRoute = ({ children }) => {
    const token = getCurrentUser();

    if (!token) {
        // return <Navigate to="/bankdemo/login" replace />;
    }

    return children;
};
export default ProtectedRoute