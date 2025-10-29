"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentResultModal({
  status,
  shippingAddress,
  orderId,
  amount,
  retryLoading,
  onRetry,
  onGoHome,
}: any) {
  
  return (
    <AnimatePresence>
      {status && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* ✅ Icon */}
            {status === "success" ? (
              <div className="w-14 h-14 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-14 h-14 bg-red-100 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}

            {/* ✅ Title */}
            <h2
              className={`text-2xl font-semibold mb-4 ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status === "success" ? "Successful payment" : "Payment failed"}
            </h2>

            {/* ✅ Details */}
            {status === "success" ? (
              <div className="text-left space-y-2 text-sm border-t border-gray-200 pt-4">
                <p>
                  <strong>Phone number:</strong> {shippingAddress?.phone}
                </p>
                <p>
                  <strong>Email:</strong> {shippingAddress?.email}
                </p>
                <p>
                  <strong>Order code:</strong> {orderId}
                </p>
                <p>
                  <strong>Amount paid:</strong> €{amount}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm border-t border-gray-200 pt-4">
                Your payment was not successful. Please try again.
              </p>
            )}

            {/* ✅ Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={status === "success" ? onGoHome : onRetry}
                className={`${
                  status === "success"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70`}
                disabled={retryLoading}
              >
                {retryLoading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : status === "success" ? (
                  "Go to Home"
                ) : (
                  "Try again"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
