import { signIn } from "next-auth/react";

export const refreshSession = async () => {
  try {
    // Refresh the session on the client side
    const updatedSession = await fetch('/api/auth/session'); // Fetch updated session
    const sessionData = await updatedSession.json();
    // You could set the session manually here
    signIn('credentials', { redirect: false, email: sessionData.user.email, password: '' }); 
  } catch (err) {
    console.error('Error refreshing session:', err);
  }
};