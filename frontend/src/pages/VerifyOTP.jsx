import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";

import toast from "react-hot-toast";

import PageContainer from "../components/layout/PageContainer";

export default function VerifyOTP() {

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [countdown, setCountdown] =
    useState(60);

  const navigate = useNavigate();

  const location = useLocation();

  // EMAIL FROM STATE OR SESSION STORAGE

  const email =
    location.state?.email ||
    sessionStorage.getItem(
      "verify_email"
    );

  /* ================= REDIRECT ================= */

  useEffect(() => {

    const timer = setTimeout(() => {

      if (!email) {

        toast.error(
          "Verification session expired"
        );

        navigate("/register");

      }

    }, 100);

    return () => clearTimeout(timer);

  }, [email, navigate]);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {

    if (countdown <= 0) return;

    const timer = setTimeout(() => {

      setCountdown((prev) => prev - 1);

    }, 1000);

    return () => clearTimeout(timer);

  }, [countdown]);

  /* ================= VERIFY OTP ================= */

  const handleVerify = async (
    e
  ) => {

    e.preventDefault();

    setError("");

    if (!otp.trim()) {

      setError("OTP is required");

      return;

    }

    try {

      setLoading(true);

      await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      toast.success(
        "Account verified successfully"
      );

      // CLEANUP

      sessionStorage.removeItem(
        "verify_email"
      );

      navigate("/login");

    } catch (err) {

      console.error(err);

      // SAFE ERROR HANDLING

      const responseData =
        err.response?.data;

      const message =

        typeof responseData?.error ===
        "string"

          ? responseData.error

          : typeof responseData?.message ===
            "string"

          ? responseData.message

          : responseData?.message?.message ||

            "OTP verification failed";

      setError(message);

      toast.error(message);

    } finally {

      setLoading(false);

    }

  };

  /* ================= RESEND OTP ================= */

  const handleResend =
    async () => {

      try {

        setResendLoading(true);

        await api.post(
          "/auth/send-otp",
          {
            email,
          }
        );

        toast.success(
          "OTP resent successfully"
        );

        setCountdown(60);

      } catch (err) {

        console.error(err);

        const responseData =
          err.response?.data;

        const message =

          typeof responseData?.error ===
          "string"

            ? responseData.error

            : typeof responseData?.message ===
              "string"

            ? responseData.message

            : responseData?.message?.message ||

              "Failed to resend OTP";

        toast.error(message);

      } finally {

        setResendLoading(false);

      }

    };

  // PREVENT CRASH RENDER

  if (!email) {
    return null;
  }

  return (

    <PageContainer>

      <div className="flex justify-center py-24">

        <div
          className="
            w-full max-w-md
            bg-[#161616]
            border border-[#2a2a2a]
            rounded-2xl
            p-8
            shadow-xl
          "
        >

          {/* HEADER */}

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold text-white mb-2">
              Verify OTP
            </h2>

            <p className="text-sm text-[#8a8a8a]">
              Enter the OTP sent to
            </p>

            <p className="text-green-400 text-sm mt-1 break-all">
              {email}
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div
              className="
                mb-6
                rounded-lg
                border border-red-700/40
                bg-red-900/30
                text-red-300
                px-4 py-3
                text-sm
              "
            >

              {error}

            </div>

          )}

          {/* FORM */}

          <form
            onSubmit={handleVerify}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm text-[#8a8a8a] mb-2">
                OTP Code
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                placeholder="Enter 6-digit OTP"
                className="
                  w-full
                  px-4 py-3
                  bg-[#0d0d0d]
                  border border-[#2a2a2a]
                  rounded-lg
                  text-white
                  placeholder-[#6a6a6a]
                  focus:outline-none
                  focus:border-green-500
                "
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-green-600
                hover:bg-green-700
                text-black
                font-bold
                py-3
                rounded-lg
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Verifying..."
                : "Verify OTP"}

            </button>

          </form>

          {/* RESEND */}

          <div className="mt-6 text-center">

            {countdown > 0 ? (

              <p className="text-sm text-[#8a8a8a]">

                Resend OTP in{" "}

                <span className="text-green-400">
                  {countdown}s
                </span>

              </p>

            ) : (

              <button
                onClick={
                  handleResend
                }
                disabled={
                  resendLoading
                }
                className="
                  text-sm
                  text-green-400
                  hover:text-green-300
                "
              >

                {resendLoading
                  ? "Resending..."
                  : "Resend OTP"}

              </button>

            )}

          </div>

        </div>

      </div>

    </PageContainer>

  );

}