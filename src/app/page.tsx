import BentoGridWrapper from "@/components/home/bento-grid-wrapper";
import Footer from "@/components/footer/footer";

// Revalidate Sanity content periodically so production picks up new entries
export const revalidate = 60;

export default async function Home() {
  return (
    <>
      <BentoGridWrapper />
      <Footer />
    </>
  );
}
