import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BranchPicker from "@/components/BranchPicker";
import MobileCartBar from "@/components/MobileCartBar";
import { StoreProvider } from "@/components/store";
import { publicDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await publicDB();
  return (
    <StoreProvider branches={data.branches}>
      <Header />
      <main className="flex-1 w-full max-w-full min-w-0">{children}</main>
      <Footer data={data} />
      <BranchPicker />
      <MobileCartBar />
    </StoreProvider>
  );
}
