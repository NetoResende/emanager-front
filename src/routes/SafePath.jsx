import { Navigate, useNavigate } from "react-router";
import { API } from "../services";

const SafePath = ({ children }) => {
    const token = sessionStorage.getItem("token") || "";
    const navigate = useNavigate();
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    // Add a request interceptor
    API.interceptors.request.use(function (config) {
        // Do something before request is sent
        return config;
    }, function (error) {
        // Do something with request error
        navigate("/");
    }
        
    );

    // Add a response interceptor
    API.interceptors.response.use(function onFulfilled(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function onRejected(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
         navigate("/");
    });

    return token ? children : <Navigate to={"/"} />;
}

export default SafePath;