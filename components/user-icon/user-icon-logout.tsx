"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOutAction } from "@/app/actions";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function UserIconLogout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem className='text-red-500' onClick={() => signOutAction()}>
      {children}
    </DropdownMenuItem>
  );
}
