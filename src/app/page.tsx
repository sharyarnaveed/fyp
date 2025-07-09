import Image from "next/image";

export default function Home() {
  return (
<main className=" h-[90vh] flex ">
<div className="w-[53%] flex flex-col justify-center items-start pl-16 text-[var(--baige)] font-[var(--font-literata)]">
  <div className="relative">
    <h1 className="absolute left-1/2 -translate-x-1/2 text-[5rem]  mb-0">
      Crack
    </h1>
    <h1 className="pt-[3rem] text-[10rem] font-bold leading-none drop-shadow-[4px_6px_0_rgba(0,0,0,0.4)]">
      Exams
    </h1>
  </div>


  <p className="text-[3rem] drop-shadow-sm mb-2 mt-1">not your brain</p>
  <p className="text-lg drop-shadow-sm mb-8">
    AI-powered&nbsp; platform for&nbsp; exam prep.
  </p>


  <button className=" cursor-pointer bg-[var(--baige)] text-[var(--main-green)] text-xl px-10 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors drop-shadow-md">
    Get Free Trial
  </button>
</div>


<div className=" w-[47%]">
 <img src="mainimage.png" alt="main image" className="w-full h-full"  />
</div>
</main>
  );
}
