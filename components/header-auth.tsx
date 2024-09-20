import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className='flex items-center gap-4'>
      Hey, {user.email}!
      <form action={await signOutAction()}>
        <Button type='submit' variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className='flex gap-2'>
      <Button asChild size='sm' variant={"outline"}>
        <Link href='/login'>Log In</Link>
      </Button>
      <Button asChild size='sm' variant={"default"}>
        <Link href='/register'>Register</Link>
      </Button>
    </div>
  );
}
