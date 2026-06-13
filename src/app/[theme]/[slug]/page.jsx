import { themes } from "@/lib/db";
import Light from "@/component/theme/light";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
 const { theme, slug } = await params;
  if (!themes.includes(theme)) {
    notFound();
  }
  switch (theme) {
    case 'light':
      return <Light slug={ slug } />;
    default:
      notFound();
  }
}