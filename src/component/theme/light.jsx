'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Countdown from '../../component/countdown';
import { supabase } from '@/lib/clientConnection';
import { notFound } from 'next/navigation';
import { slugs } from '@/lib/db';

export default function Light({ slug }) {

  const [data, setData] = useState(null);

  if(!slugs.includes(slug)) {
    notFound();
  }

  async function fetchData() {
    const { data, error } = await supabase
      .from('wedding')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data);
      console.log('Data fetched successfully:', data);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const timeDate = data?.wedding_date ? new Date(data.wedding_date) : null;

  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  function playAudio() {
    if (!audioRef.current) {
      audioRef.current = new window.Audio('/music/music.mp3');
      audioRef.current.loop = true;
    }

    audioRef.current.play();
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className={`relative text-white h-screen w-full overflow-x-hidden ${isOpen ? 'overflow-y-scroll' : 'overflow-y-hidden'}`}>
      <div className='fixed z-100 w-full mx-10 bottom-0 -left-10 p-5 flex md:hidden'>
        <div className={`w-full flex justify-around items-center p-5 bg-[#FFDBFD] rounded-full ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-20'} transition-all duration-500 ease-out`}>
          <div onClick={() => scrollToSection('hero')}><img src="https://indoinvite.com/nikah/home.svg" alt="" className='w-5' /></div>
          <div onClick={() => scrollToSection('partner')}><img src="https://indoinvite.com/nikah/people.svg" alt="" className='w-5' /></div>
          <div onClick={() => scrollToSection('location')}><img src="https://indoinvite.com/nikah/map.svg" alt="" className='w-5' /></div>
          <div onClick={() => scrollToSection('gallery')}><img src="https://indoinvite.com/nikah/picture.svg" alt="" className='w-5' /></div>
        </div>
      </div>
      <div className="fixed -z-1 inset-0 bg-[url('/light/imagess.png')] bg-cover bg-no-repeat opacity-70 h-screen w-full" />

      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className={` transform-gpu relative h-screen items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'hidden opacity-0' : 'opacity-100 flex'} backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-[url('/g2.jpeg')] bg-cover bg-center brightness-50" />

        <div className="relative w-full z-10 flex-col items-center justify-center">

          <p className="tracking-[0.4em] uppercase text-sm mb-4 text-black">
            Wedding Invitation
          </p>

          <h1 className="text-6xl md:text-8xl font-serif mb-6 text-black">
            {data?.groom_name} <span className="">&</span> {data?.bride_name}
          </h1>

          <p className="text-lg text-black mb-8">
            {timeDate ? timeDate.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </p>

          <p className='text-serif text-sm  text-black text-xs md:text-lg'>Kepada Yth. Bapak/Ibu/Saudara/i</p>

          <div className='w-full flex justify-center items-center'>
            <button
              type='button'
              onClick={() => { setIsOpen(!isOpen); playAudio(); }}
              className='hover:scale-110 my-2 flex items-center p-2 rounded-lg bg-[#FFDBFD] text-black font-serif'><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-open" viewBox="0 0 16 16">
                <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z" />
              </svg></span><span className='mx-2 text-sm'>Buka Undangan</span></button>
          </div>
        </div>

      </motion.section>

      <div id='hero' className=''>
        {/* HERO */}
        <div
          className={`relative h-screen flex items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-[url('/hero.jpeg')] bg-cover bg-center brightness-50" />

          <div className="relative z-10">

            <p className="tracking-[0.4em] uppercase text-sm mb-4 text-black drop-shadow-xl">
              Wedding Invitation
            </p>

            <h1 className="text-6xl md:text-8xl font-serif mb-6 text-black drop-shadow-xl">
              {data?.groom_name} <span className="">&</span> {data?.bride_name}
            </h1>

            <p className="text-lg text-black mb-8 drop-shadow-xl">
              {timeDate ? timeDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </p>

            <p className='text-serif text-sm drop-shadow-xl text-black'>Tanpa Mengurangi Rasa Hormat,
              Kami Mengundang Bapak/Ibu/Saudara/i
              Untuk Hadir Di Acara Pernikahan Kami.</p>
          </div>
        </div>

        {/* QUOTE */}
        <div className='relative overflow-hidden bg-white'>
          <div className='w-full flex justify-between'>
            <img src="/flower.png" alt="" className='w-full -scale-x-100 animate-zoom [animation-delay:0.3s]' />
          </div>

          <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className=" transform-gpu px-6 text-center"
            id='partner'>
            <div className="max-w-3xl mx-auto">
              <p className='text-black text-2xl font-bold mb-5'>السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ</p>
              <p className="text-md md:text-xl leading-relaxed font-serif text-black">
                Atas Berkah dan Rahmat Allah Subhanallahu Wa Ta'ala. Tanpa mengurangi rasa hormat. Kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami :”
              </p>
            </div>
          </motion.section>
        </div>

        {/* COUPLE */}
        <div className='bg-white'>
          <motion.section
            id="detail"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="transform-gpu pb-26 px-6"
          >
            <div className='relative w-full flex flex-col items-center justify-center pt-10 mb-10'>
              <div className='text-center'>
                <h2 className='text-[#505050] text-xl font-serif my-3'>Pasangan</h2>
                <p className='font-great-vibes font-bold text-[#FFDBFD] text-4xl'>Pengantin</p>
              </div>
              <div className='my-5 w-full md:flex justify-center'>
                <p className='text-[#505050] font-serif text-xs text-center md:text-xl md:w-1/3'>Maha Suci Allah SWT, Yang telah menciptakan makhlukNya berpasang-pasangan.
                  Ya Allah, perkenankanlah dan Ridhoilah Pernikahan kami.</p>
              </div>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
              {/* Groom */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="transform-gpu text-center">
                <div className="relative w-46 h-46 mx-auto mb-8">
                  <img
                    src="/rian/men.png"
                    alt="Groom"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className='w-70 -left-11 z-2 top-0  absolute'>
                    <img src="/light/frameFlower.png" alt="" className='w-full h-full' />
                  </div>
                </div>

                <h2 className="text-3xl font-great-vibes font-bold text-[#FFDBFD] mb-3">{data?.groom_name || 'Groom Name'}</h2>
                <div className='w-full flex justify-center'>
                  <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                  </div>
                </div>
                <p className='text-[#505050] font-serif'>Anak Ketiga dari tiga bersaudara</p>
                <p className="text-[#505050] font-serif">
                  Bapak Racmat Fauzi (alm) & Ibu Dra. Windiarti
                </p>
              </motion.div>

              {/* Bride */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="transform-gpu text-center">
                <div className="relative w-46 h-46 mx-auto mb-8">
                  <img
                    src="/rian/girl.png"
                    alt="Bride"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className='w-70 -left-11 z-2 top-0  absolute'>
                    <img src="/light/frameFlower.png" alt="" className='w-full h-full' />
                  </div>
                </div>

                <h2 className="text-4xl font-great-vibes font-bold text-[#FFDBFD] mb-3">{data?.bride_name || 'Bride Name'}</h2>
                <div className='w-full flex justify-center'>
                  <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                  </div>
                </div>
                <p className='text-[#505050] font-serif'>Anak pertama dari dua bersaudara</p>
                <p className="text-[#505050] font-serif">
                  Bapak Riswanto & Ibu Rosmanah
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>

        <Countdown targetDate={'2026-07-06T11:00:00'} />

        {/* EVENT */}
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-28 px-6 bg-neutral-950">
          <div className="max-w-5xl mx-auto text-center">
            <div className='w-full mb-10'>
              <h2 className="font-serif text-xl my-2 text-neutral-100">Waktu & Tempat</h2>
              <p className='font-great-vibes font-bold text-[#FFDBFD] text-4xl'>Pernikahan</p>
              <p className='font-serif text-neutral-100 md:text-lg text-sm'>Pertemuan adalah permulaan, tetap bersama adalah perkembangan, bekerja sama adalah keberhasilan.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-black rounded-3xl p-10 border border-[#FFDBFD]">
                <div className='w-full flex justify-center my-3'>
                  <img src="/light/dovewhite.png" alt="" className='w-1/2' />
                </div>
                <h3 className="text-3xl mb-6 text-[#FFDBFD] font-great-vibes font-bold">
                  Akad Nikah
                </h3>

                <p className="text-neutral-200 font-serif leading-8">
                  Saturday
                  <br /> <span className='text-5xl font-bold text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: 'numeric' }) : ''}</span>
                  <br /> <span className='text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: 'long', day: 'numeric' }) : ''}</span>
                  <br />
                  {timeDate ? timeDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''} s/d selesai
                  <br />
                  {data?.marriage_covenant_address || ''}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="bg-black rounded-3xl p-10 border border-[#FFDBFD] ">
                <div className='w-full flex justify-center my-3'>
                  <img src="/light/bouquetwhite.png" alt="" className='w-1/3' />
                </div>
                <h3 className="text-3xl mb-6 text-[#FFDBFD] font-great-vibes font-bold">
                  Reception
                </h3>

                <p className="text-neutral-200 font-serif leading-8">
                  Saturday
                  <br /> <span className='text-5xl font-bold text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: 'numeric' }) : ''}</span>
                  <br /> <span className='text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: 'long', day: 'numeric' }) : ''}</span>
                  <br />
                  {timeDate ? timeDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''} s/d Selesai
                  <br />
                  {data?.reception_location || ''}
                </p>
              </motion.div>
            </div>

            <div id='location' className='w-full my-10'>
              <div className='w-full mb-10'>
                <h2 className="font-serif text-xl my-2 text-neutral-100">Lokasi</h2>
                <p className='font-serif font-bold text-[#FFDBFD] text-4xl my-3'>{data?.location || 'Jl. Balok, Lk 2,'}</p>
                <p className='font-serif text-neutral-100 text-sm'>{data?.address || ''}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className='w-full'>
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3971.9234468971013!2d105.28799807498422!3d-5.428599994550717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMjUnNDMuMCJTIDEwNcKwMTcnMjYuMSJF!5e0!3m2!1sid!2sid!4v1780201502828!5m2!1sid!2sid"
                  className='w-full h-100'
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* GALLERY */}
        <div className='relative bg-white'>
          
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="py-28 px-2"
            id='gallery'>
            <div className="max-w-6xl mx-auto">
              <div className='w-full mb-20 text-center'>
                <h2 className="font-serif text-xl my-2 text-[#505050]">Moment</h2>
                <p className='font-great-vibes font-bold text-[#FFDBFD] text-4xl'>Bahagia Kami</p>
                <p className='font-serif text-[#505050] md:text-lg text-sm mt-5'>Pertemuan adalah permulaan, tetap bersama adalah perkembangan, bekerja sama adalah keberhasilan.</p>
              </div>

              <div className="grid md:grid-cols-3 grid-cols-2 gap-1">
                {['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'].map((img) => (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    key={img}
                    className="overflow-hidden w-full rounded-lg"
                  >
                    <img
                      src={`/rian/${img}`}
                      alt="Gallery"
                      className="w-full h-full object-cover hover:scale-110 transition duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Gift */}
        <section
          className="relative py-28 px-6 bg-center bg-cover text-center">
          <div className='absolute w-full h-full bg-black/70 z-10 top-0 left-0 inset-0'></div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative z-20 max-w-5xl mx-auto">
            <div className='relative z-20 mb-10'>
              <p className='font-great-vibes font-bold text-[#FFDBFD] font-bold text-5xl'>Wedding Gift</p>
              <p className='font-serif text-neutral-100 md:text-lg text-sm mt-5'>Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila memberi adalah bentuk kasih, Anda dapat mengirimkan tanda kasih melalui amplop digital berikut.</p>
            </div>

            <div className="relative z-20">
              <div className='w-full md:flex-row flex-col'>
                <div className='relative my-5 text-[#505050] bg-white p-5 rounded-xl'>
                  <div className='w-full flex justify-center my-2'>
                    <img src="/mandiri.png" alt="" className='md:w-1/6 w-3/4' />
                  </div>
                  <p className='text-lg'>1140026390594</p>
                  <p className='text-sm'>A/N Pria</p>
                </div>

                <div className='relative my-5 text-[#505050] bg-white p-5 rounded-xl'>
                  <div className='w-full flex justify-center my-2'>
                    <img src="/bca.svg" alt="" className='md:w-1/6 w-3/4' />
                  </div>
                  <p className='text-lg'>0231309763 </p>
                  <p className='text-sm'>A/N Wanita</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>



        {/* FOOTER */}
        <footer className="py-10 text-center bg-black border-t border-neutral-900 pb-40">
          <p className="text-neutral-500">
            © 2026 Solusi Digital Kreatif
          </p>
        </footer>
      </div>
    </main>
  );
}