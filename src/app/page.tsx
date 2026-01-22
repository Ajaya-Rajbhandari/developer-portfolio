import BentoGrid from "@/components/home/bento-grid";
import Footer from "@/components/footer/footer";

/* We can keep other sections below if needed, or make BentoGrid the sole 'Home' view 
   and have specific pages. For a "Portfolio", a single page Bento is very strong.
   Let's render BentoGrid as the main view. */

export default function Home() {
  return (
    <>
      <BentoGrid />
      {/* Optional: We can add the detailed sections below the bento grid for detailed reading */}
      {/* 
      <div className="max-w-[1200px] mx-auto px-6 py-20">
         <AboutSection />
         <ExperienceSection />
      </div> 
      */}
    </>
  );
}
