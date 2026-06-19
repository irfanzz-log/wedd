'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useCountdown from '../../hook/useCountdown';
import useGetDataWedding from '../../hook/useGetDataWedding';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/clientConnection';
import { slugs } from '@/lib/db';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function Light({ slug }) {

  const data = useGetDataWedding(slug);
  const photo = data?.photo
  const photoRow = Array.from({ length: photo}, (_, i) => i + 1);
  const timeLeft = useCountdown({ targetDate: data?.wedding_date });
  const [isCopy, setIsCopy] = useState(false);
  const [id, setId] = useState('');
  const searchParams = useSearchParams();
  const tamu = searchParams.get('tamu');

  if(!slugs.includes(slug)) {
    notFound();
  }

  const timeDate = data?.wedding_date ? new Date(data.wedding_date) : null;

  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  function playAudio() {
    if (!audioRef.current) {
      audioRef.current = new window.Audio('/light/music/song.mp3');
      audioRef.current.loop = true;
    }

    audioRef.current.play();
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  const handleCopyButton = async(text) => {
    await navigator.clipboard.writeText(text);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }

  const [ucapan, setUcapan] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [form, setForm] = useState({
    name: "",
    message: "",
    status: "",
    wedding_id: data?.id,
  });

  function formUpdate(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const [isWarning, setIsWarning] = useState();

  async function handleFormButton(e) {
    e.preventDefault();

    setIsWarning(false);

    if (!form.name || !form.message || !form.status) {
      return setIsWarning(true);
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([form])
      .select();

    if (!error) {

      setUcapan((prev) => [...prev, data[0]]);

      setForm({
        name: "",
        message: "",
        status: "",
        wedding_id: data?.id,
      });
    }
  }

    useEffect(()=> {
    if(data?.id) {
        setForm((prev) => ({
            ...prev,
            wedding_id : data.id
        }));
        setId(data.id)
    }
  },[data])

  useEffect(() => {
    async function getComments() {

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('wedding_id', id);

      if (!error) {
        setUcapan(data);
      }
    }

    getComments();

  }, [id]);

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
      <div className="fixed -z-1 inset-0 bg-[url('/light/imagess.webp')] bg-cover bg-no-repeat opacity-70 h-screen w-full" />

      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className={` transform-gpu relative h-screen items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'hidden opacity-0' : 'opacity-100 flex'} backdrop-blur-sm`}>
        

        <div className="relative w-full z-10 flex-col items-center justify-center">

          <p className="tracking-[0.4em] uppercase text-sm mb-4 text-black">
            Wedding Invitation
          </p>

          <h1 className="text-6xl md:text-8xl font-serif mb-6 text-black">
            {data?.couples[0].groom_alias || 'Groom Name'} <span className="">&</span> {data?.couples[0].bride_alias || 'Bride Name'}
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
          <p className='text-black md:text-3xl text-2xl my-3 font-bold'>{tamu || 'Tamu Undangan'}</p>
          <div className='w-full flex justify-center items-center'>
            <button
              type='button'
              onClick={() => { setIsOpen(!isOpen); playAudio(); }}
              className='hover:scale-110 my-2 flex items-center p-2 rounded-lg bg-white text-black font-serif'><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-open" viewBox="0 0 16 16">
                <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z" />
              </svg></span><span className='mx-2 text-sm'>Buka Undangan</span></button>
          </div>
        </div>

      </motion.section>

      <div id='hero' className=''>
        {/* HERO */}
        <div
          className={`relative h-screen flex items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`absolute inset-0 bg-cover bg-center brightness-40`} style={{backgroundImage: `url('/${slug}/2.webp')`}} />

          <div className="relative z-10">

            <p className="tracking-[0.4em] uppercase text-sm mb-4 text-[#FFDBFD] drop-shadow-xl">
              Wedding Invitation
            </p>

            <h1 className="text-6xl md:text-8xl font-serif mb-6 text-[#FFDBFD] drop-shadow-xl">
              {data?.couples[0].groom_alias || 'Groom Name'} <span className="">&</span> {data?.couples[0].bride_alias || 'Bride Name'}
            </h1>

            <p className="text-lg text-[#FFDBFD] mb-8 drop-shadow-xl">
              {timeDate ? timeDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </p>
            <p className='text-serif text-sm drop-shadow-xl text-[#FFDBFD]'>Tanpa Mengurangi Rasa Hormat,
              Kami Mengundang Bapak/Ibu/Saudara/i
              Untuk Hadir Di Acara Pernikahan Kami.</p>
          </div>
        </div>

        {/* QUOTE */}
        <div className='relative overflow-hidden bg-white'>
          <div className='w-full flex justify-between'>
            <img src="/light/flower.png" alt="" className='w-full -scale-x-100 animate-zoom [animation-delay:0.3s]' />
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
                <p className='text-[#505050] font-serif text-xs text-center md:text-xl md:w-1/3'>Maha Suci Allah SWT, Yang telah menciptakan makhluknya berpasang-pasangan.
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
                    src={`/${slug}/men.webp`}
                    alt="Groom"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className='w-70 -left-11 z-2 top-0  absolute'>
                    <img src="/light/frameFlower.png" alt="" className='w-full h-full' />
                  </div>
                </div>

                <h2 className="text-3xl font-great-vibes font-bold text-[#FFDBFD] mb-3">{data?.couples[0].groom_name || 'Groom Name'}</h2>
                <div className='w-full flex justify-center'>
                  <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                  </div>
                </div>
                <p className='text-[#505050] font-serif'>{data?.couples[0].groom_info || ''}</p>
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
                    src={`/${slug}/girl.webp`}
                    alt="Bride"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className='w-70 -left-11 z-2 top-0  absolute'>
                    <img src="/light/frameFlower.png" alt="" className='w-full h-full' />
                  </div>
                </div>

                <h2 className="text-4xl font-great-vibes font-bold text-[#FFDBFD] mb-3">{data?.couples[0].bride_name || ''}</h2>
                <div className='w-full flex justify-center'>
                  <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                  </div>
                </div>
                <p className='text-[#505050] font-serif'>{data?.couples[0].bride_info || ''}</p>
              </motion.div>
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={`transform-gpu relative py-28 px-6 bg-center bg-cover text-center}`}
          style={{ backgroundImage: `url('/${slug}/1.webp')` }}
          >
         
          <div className='absolute w-full h-full bg-black/40 z-10 top-0 left-0 inset-0'></div>
          <div className='relative z-20 mb-10 text-center'>
            <h2 className=" font-serif mb-5 text-neutral-100 text-xl">Hitung Mundur</h2>
            <p className='font-great-vibes font-bold text-[#FFDBFD] font-bold text-5xl'>Menuju Hari Bahagia</p>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto z-20">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                key={item.label}
                className="transform-gpu rounded-3xl text-center p-10 border border-neutral-100 backdrop-blur-[2px]"
              >
                <h3 className="text-5xl font-bold text-[#FFDBFD] mb-2">
                  {item.value}
                </h3>

                <p className="text-neutral-100 uppercase tracking-widest text-sm">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
                  {timeDate ? timeDate.toLocaleDateString('id-ID', {weekday: 'long'}) : ''}
                  <br /> <span className='text-5xl font-bold text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: 'numeric' }) : ''}</span>
                  <br /> <span className='text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric'}) : ''}</span>
                  <br />
                  {timeDate ? timeDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : ''} s/d selesai
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
                  {timeDate ? timeDate.toLocaleDateString('id-ID', {weekday: 'long'}) : ''}
                  <br /> <span className='text-5xl font-bold text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: 'numeric' }) : ''}</span>
                  <br /> <span className='text-[#FFDBFD]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''}</span>
                  <br />
                  {data?.reception_date ? new Date(data.reception_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : ''} s/d {data?.reception_date_end ? new Date(data.reception_date_end).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Selesai'}
                  <br />
                  {data?.reception_address || ''}
                </p>
              </motion.div>
            </div>

            <div id='location' className='w-full my-10'>
              <div className='w-full mb-10'>
                <h2 className="font-serif text-xl my-2 text-neutral-100">Lokasi</h2>
                <p className='font-serif font-bold text-[#FFDBFD] text-4xl my-3'>{data?.venue || ''}</p>
                <p className='font-serif text-neutral-100 text-sm'>{data?.reception_address || ''}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className='w-full'>
                <iframe src={`${data?.maps_link || null}`}
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
                {photoRow.map((img) => (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    key={img}
                    className="overflow-hidden w-full rounded-lg"
                  >
                    <Image
                      width={500}
                      height={500}
                      src={`/${slug}/${img}.webp`}
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
                {data?.bank_account?.map((account, index) => (
                  <div key={index} className='relative my-5 text-[#505050] bg-white p-5 rounded-xl'>
                    <div className='w-full flex justify-center my-2'>
                      <img src={`/${account.bank}.svg`} alt={account.bank} className='md:w-1/6 w-3/4' />
                    </div>
                    <p className='text-lg font-bold'>{account.bank_number} <span onClick={() => handleCopyButton(account.bank_number)} className='hover:underline cursor-pointer text-sm font-normal bg-blue-100 px-2 py-1 rounded'>Copy</span></p>
                    <p className='text-sm'>A/N {account.account_name}</p>
                  </div>
                ))}
                  <div className={`fixed w-full top-5 left-0 flex justify-center items-center z-50 ${isCopy ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'} transition-all duration-300 ease-in-out`}>
                    <p className="bg-green-500 text-white p-2 text-xs rounded-lg shadow-lg">Text copied to clipboard!</p>
                  </div>
                
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-28 px-6 bg-neutral-950">
          <div className="max-w-3xl mx-auto text-center">
            <div className='relative z-20 mb-10'>
              <h2 className="font-serif text-xl my-2 text-neutral-100">Doa & Ucapan</h2>
              <p className='font-great-vibes font-bold text-[#FFDBFD] text-4xl'>Untuk Kami Berdua</p>
              <p className='font-serif text-neutral-100 md:text-lg text-sm'>Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.</p>
            </div>

            <div className="relative flex justify-center">
              <form onSubmit={handleFormButton} className='flex w-full flex-col font-serif text-[#505050]'>
                <input name='name' type="text" placeholder='Nama' className='w-full bg-white p-2 rounded-md my-1' value={form?.name} onChange={formUpdate} />
                <textarea name="message" id="" placeholder='Beri ucapan' className='text- w-full bg-white p-2 rounded-md my-1 resize-none' value={form?.message} onChange={formUpdate}></textarea>
                <div className='relative w-full my-1'>
                  <div name="status" className='p-2 bg-white rounded-md p-2 hover:bg-gray-100 cursor-pointer' value={form?.status} onClick={(() => setIsActive(!isActive))}>{form.status || 'Status Kehadiran'}</div>
                  <div className={`z-2 shadow-md absolute flex-col bg-white w-full -bottom-22 rounded-md left-0 ${isActive ? 'flex' : 'hidden'}`}>
                    <button type='button' className='w-full p-2 hover:bg-gray-100 cursor-pointer' onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        status: 'Hadir',
                      }));

                      setIsActive(false);
                    }}>Hadir</button>
                    <button type='button' className='w-full p-2 hover:bg-gray-100 cursor-pointer' onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        status: 'Tidak Hadir',
                      }));

                      setIsActive(false);
                    }}>Tidak Hadir</button>
                  </div>
                </div>
                {isWarning && <p className='text-red-700'>Harap Lengkapi form!</p>}
                <button className='hover:scale-110 transition-all duration-400 ease-out w-1/2 bg-[#FFDBFD] text-black p-2 rounded-md my-1'>Kirim Ucapan</button>
              </form>
            </div>

            <div className='relative w-full my-1'>
              <div className='w-full flex flex-col bg-white rounded-md overflow-hidden'>
                <div className='text-left font-serif p-2 px-4 w-full bg-[#FFDBFD]'>
                  <p className='flex items-center text-black'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                  </svg><span className='mx-2'>Coments</span></p>
                </div>
                {ucapan.map((data, idx) => {
                  const name = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
                  return (
                    <div key={idx} className='w-full flex text-left text-black p-2 my-2'>
                      <div className='w-1/5 md:w-1/8'>
                        <div className='w-15 h-15 flex items-center justify-center border-[0.5px] border-[#FFDBFD] rounded-full overflow-hidden'>
                          <p>{name}</p>
                        </div>
                      </div>
                      <div className='w-full p-2'>
                        <div className='w-full flex items-center'>
                          <p className='font-bold'>{data.name}</p>
                          <p className='mx-3 p-1 px-2 text-xs text-black bg-[#FFDBFD] rounded-lg'>{data.status}</p>
                        </div>
                        <div>
                          <p className='text-sm'>{data.message}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.section>

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