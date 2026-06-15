import { themes } from "@/lib/db";
import Light from "@/component/theme/light";
import { notFound } from "next/navigation";
import {supabase} from "@/lib/clientConnection";

export async function generateMetadata({ params }) {
  const { theme, slug } = await params;
  const { data, error } = await supabase
      .from('wedding')
      .select(`*`)
      .eq('slug', slug)
      .single();

  if (error) {
      console.error('Error fetching data:', error);
      return {
        title: "Undangan Pernikahan",
        description: "Undangan pernikahan digital yang elegan dan mudah digunakan.",
      };
  }
  

  return {
    title: `${slug} | Wedding Invitation`,

    description: data?.description,

    openGraph: {
      title: `${slug} | Wedding Invitation`,
      description: data?.story,
      images: [
        {
          url: `/${theme}/${slug}/2.webp`,
          width: 1200,
          height: 630,
        },
      ],
    },

  };
}

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