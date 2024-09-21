"use client";

import React from "react";
import { signOutAction } from "@/app/actions";

export default function LogoutButton() {
  return (
    <button className='text-red-500' onClick={() => signOutAction()}>
      Logout
    </button>
  );
}