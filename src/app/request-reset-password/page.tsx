"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const RequestResetPasswordPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<any>("");
  const router = useRouter();

  const isDark = false; // Change this based on your theme preference

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "/api/auth/reset-password",
        {
          emailOrUsername,
          type: "request",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_t")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(
          <div>
            A reset link has been sent to your email. Please check your inbox.{" "}
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-blue-600 hover:underline"
            >
              Open Gmail
            </a>
            <br />
            You can also{" "}
            <Link href="/auth/signin" className="!text-blue-600 hover:underline">
              log in here
            </Link>{" "}
            if you remember your password.
          </div>
        );
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response
          ? err.response.data.message
          : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 my-14 bg-white rounded-lg shadow-lg ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Request Password Reset
        </h1>

        {error && (
          <div className="p-2 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-2 mb-4 text-green-700 bg-green-100 border border-green-300 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              disabled={success.length > 0}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full p-2 border tracking-wide text-xl font-sans border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success.length > 0}
            className={`w-full py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
          <span> | </span> {/* Optional separator */}
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
