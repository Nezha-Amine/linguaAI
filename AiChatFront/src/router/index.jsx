import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
//import Login from "../pages/Login";

//import Unauthorized from "../pages/Unauthorized";
import ChatBot from "../pages/ChatBot";
import SignupForm from "../pages/SignupForm";
import LoginForm from "../pages/LoginForm";
import Quiz from "../pages/Quiz";

export const router = createBrowserRouter([
  // Private routes
  {
    element: (
      <PrivateRoutes>
        <ChatBot />
        
      </PrivateRoutes>
    ),
    path: "/chat",
  },
  {
    element: (
      <PrivateRoutes>
        <Quiz />
        
      </PrivateRoutes>
    ),
    path: "/quizz",
  },
  // Public routes
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  }
  
]);
