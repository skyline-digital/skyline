import Breadcrumbs from "@/components/breadcrumbs";
import DesktopNav from "@/components/nav/desktop-nav";
import MobileNav from "@/components/nav/mobile-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react";
import Image from "next/image";
import { signOutAction } from "../actions";

export default async function DashboardFunction({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: profile } = await supabase.from("profiles").select().single();

  return (
    <div className='flex-1 h-full w-full flex flex-col gap-12'>
      <div className='flex w-full flex-col'>
        <DesktopNav />
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <MobileNav />
            <Breadcrumbs />
            <div className='relative ml-auto flex-1 md:grow-0'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search...'
                className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
              />
            </div>
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
                        .map((name) => name[0].toUpperCase())}
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
                <Button variant='ghost' onClick={signOutAction} asChild>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className='p-4 sm:px-6 sm:py-0'>{children}</div>
        </div>
      </div>
    </div>
  );
}
