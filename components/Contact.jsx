import React, { useState } from "react";
import { PhoneCall, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult("Sending....");
    setStatus(null);

    const formData = new FormData(event.target);
    formData.append("access_key", "dd48860e-b3af-4ef5-b3dc-8ad93c545f95");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully!");
        setStatus("success");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message || "Something went wrong");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error", error.message);
      setResult("Failed to send message");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  placeholder="Tell us what's on your mind..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Message */}
              {result && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    status === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : status === "error"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  }`}
                >
                  {status === "success" && <CheckCircle size={20} />}
                  {status === "error" && <AlertCircle size={20} />}
                  <span className="text-sm">{result}</span>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl hover:bg-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <PhoneCall className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-400">+212 663-121121</p>
                  <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9am-6pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl hover:bg-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-3 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Mail className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Email
                  </h3>
                  <p className="text-gray-400 break-all">
                    aboubatraore04@gmail.com
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-2">
                Quick Response
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We typically respond to all inquiries within 24 hours during
                business days. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
