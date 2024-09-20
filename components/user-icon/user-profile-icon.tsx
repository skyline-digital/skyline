import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { signOutAction } from "@/app/actions";
import UserIconLogout from "./user-icon-logout";

export default async function UserProfileIcon() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user?.id as string)
    .single();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='overflow-hidden rounded-full'
        >
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              width={36}
              height={36}
              alt='Avatar'
              className='overflow-hidden rounded-full'
            />
          ) : (
            <div className='w-9 h-9 bg-accent rounded-full flex items-center justify-center'>
              {profile?.name
                ?.split(" ")
                .map((name: string) => name[0].toUpperCase())}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <UserIconLogout>Logout</UserIconLogout>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
