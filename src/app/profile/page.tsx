"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout success", response.data);
      toast.success("Logout success");
      router.push("/login");
    } catch (error: any) {
      // Check if the error is an Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error login user:", error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
        toast.error(error.message);
      }
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/identity");
      console.log(res.data);
      setData(res.data.data.id);
    } catch (error: any) {
      // Check if the error is an Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error login user:", error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2>
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>Link to your profile</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="p-2 border rounded-lg mt-4 focus:outline-none focus:border-gray-600 border-white text-white"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="p-2 border rounded-lg mt-4 focus:outline-none focus:border-gray-600 border-white text-white"
      >
        Get User Details
      </button>
    </div>
  );
};

export default ProfilePage;
