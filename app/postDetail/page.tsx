'use client';
// import ImageApp from "./imageApp";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "./style.css"
import dynamic from "next/dynamic";

const ImageApp = dynamic(() => 
  import ("./imageApp"), {ssr: false}
)


export default function Index() {
  const supabase = createClientComponentClient();
  supabase.auth.getUser()
  return (
    <>
      <h1 className="NewPost">New Post</h1>
      {typeof window !== 'undefined' && (
      <div className="date">
        <ImageApp />
      </div>
      )}
    </>
  );
}
