import { useAuthStore } from "../store/auth"

export function isAuthenticated(){
       return localStorage.getItem('token') ? true : false
}

