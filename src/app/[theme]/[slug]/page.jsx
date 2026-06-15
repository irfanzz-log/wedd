import { themes } from "@/lib/db";
import Light from "@/component/theme/light";
import Jawa from "@/component/theme/jawa";
import { notFound } from "next/navigation";
import {supabase} from "@/lib/clientConnection";

export async function generateMetadata({ params }) {
  const { slug } = await params;
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
          url: `/${slug}/2.webp`,
          width: 1200,
          height: 630,
        },
      ],
    },

  };
}

export default async function Page({ params }) {
 const { theme, slug } = await params;
 const { data, error } = await supabase
      .from('wedding')
      .select(`*`)
      .eq('slug', slug)
      .single();

  if (error) {
      console.log('Error fetching data:', error);
      return notFound();
  }
  
  if(data.theme !== theme) {
    return notFound();
  }
  
  switch (theme) {
    case 'light':
      return <Light slug={slug} theme={theme} />;
    case 'jawa':
      return <Jawa slug={slug} theme={theme} />
    default:
      notFound();
  }
}