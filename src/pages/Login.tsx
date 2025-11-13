import React, { useState, useEffect } from "react";
import { Lock, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import img from '../assets/logo.webp'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { Api } from "../utils/http";
import { URL } from "../utils/urls";
import { ToastContainer, toast } from 'react-toastify';

export default function UltraTechLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const { login: loginStore , accessToken  } = useAuthStore();  // <- Zustand function renamed

  const loginApi = async (payload: { email: string; password: string }) => {
    const res = await Api.post({ url: URL.login, data: payload }); // <-- ()()
    return res?.data;
  };

  const setCookie = (name: string, value: string, days?: number) => {
    let cookieStr = `${name}=${value}; path=/;`;
    if (days) {
      const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
      cookieStr += `expires=${expires};`;
    }
    document.cookie = cookieStr;
  };

  const { mutate } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      loginStore(
        data.user,
        data.auth_token,
        data.rf_token
      );

      toast.success("Login Successful ✅");
      setIsLogin(false)
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(err || "Login Failed ❌");
       setIsLogin(false)
    },
  });

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLogin(true)
     if (rememberMe) {
      
      setCookie("savedEmail", email, 7);
      setCookie("savedPassword", password, 7); // <-- PASSWORD SAVED
    } else {
    
      deleteCookie("savedEmail");
      deleteCookie("savedPassword"); // <-- PASSWORD REMOVED
    }
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-105">
          <div className="flex justify-center mb-6">
            <img src={img} alt="" />
          </div>
          <div className="text-center mb-8">
            <p className="text-gray-300 mt-3 text-sm">Welcome back! Please login to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded mr-2"
                />
                <span className="group-hover:text-white">Remember me</span>
              </label>

              <a href="#" className="text-blue-400 hover:text-blue-300">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
             disabled={isLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105"
            >
              Login →
            </button>
          </form>
        </div>
      </div>
     
    </div>
  );
}
