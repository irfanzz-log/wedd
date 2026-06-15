'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useCountdown from '@/hook/useCountdown';
import useGetDataWedding from '@/hook/useGetDataWedding';
import { supabase } from '@/lib/clientConnection';
import { slugs } from '@/lib/db';
import { notFound } from 'next/navigation';

export default function Jawa({ slug }) {
    const data = useGetDataWedding(slug);
    const timeLeft = useCountdown({ targetDate: data?.wedding_date });
    const timeDate = new Date(data?.wedding_date);
    const audioRef = useRef(null);
    const [isCopy, setIsCopy] = useState();
    const [id, setId] = useState();

    if(!slugs.includes(slug)) {
    notFound();
  }

    function playAudio() {
        if (!audioRef.current) {
            audioRef.current = new window.Audio(`/jawa/music/music.mp3`);
            audioRef.current.loop = true;
        }

        audioRef.current.play();
    }

    function scrollToSection(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
    }

    const handleCopyButton = async (text) => {
        await navigator.clipboard.writeText(text);
        setIsCopy(true);
        setTimeout(() => {
            setIsCopy(false);
        }, 2000);
    }

    const [ucapan, setUcapan] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [form, setForm] = useState({
        name: "",
        message: "",
        status: "",
        wedding_id: ""
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
                wedding_id: data.id
            });
        }
    }

    useEffect(() => {
        if (data?.id) {
            setForm((prev) => ({
                ...prev,
                wedding_id: data.id
            }));
            setId(data.id)
        }
    }, [data])

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
            <div className={`fixed w-full mx-10 bottom-0 -left-10 p-5 flex md:hidden ${isOpen ? 'z-100' : 'z-0'}`}>
                <div className={`w-full flex justify-around items-center p-5 bg-[#B18B41] rounded-full ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-20'} transition-all duration-500 ease-out`}>
                    <div onClick={() => scrollToSection('hero')}><img src="https://indoinvite.com/nikah/home.svg" alt="" className='w-5' /></div>
                    <div onClick={() => scrollToSection('partner')}><img src="https://indoinvite.com/nikah/people.svg" alt="" className='w-5' /></div>
                    <div onClick={() => scrollToSection('location')}><img src="https://indoinvite.com/nikah/map.svg" alt="" className='w-5' /></div>
                    <div onClick={() => scrollToSection('gallery')}><img src="https://indoinvite.com/nikah/picture.svg" alt="" className='w-5' /></div>
                </div>
            </div>
            <div className="fixed -z-1 inset-0 bg-[url(/jawa/bg.png)] bg-cover bg-no-repeat opacity-10 h-screen w-full" />

            <motion.section
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className={`relative h-screen items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'hidden opacity-0' : 'opacity-100 flex'}`}>
                <div className="absolute inset-0 bg-cover bg-center brightness-50"
                    style={{ backgroundImage: `url('/slug/${slug}/2.jpeg')` }} />

                <div className="relative w-full z-10 flex-col items-center justify-center">
                    <div className='w-full flex justify-center my-2'>
                        <img src="/gunungan-wayang.png" alt="" className='md:w-1/6 w-1/4' />
                    </div>
                    <p className="tracking-[0.4em] uppercase text-sm mb-4 text-neutral-300">
                        Wedding Invitation
                    </p>

                    <h1 className="text-6xl md:text-8xl font-serif mb-6 text-[#B18B41]">
                        {data?.groom_name || 'Groom Name'} <span className="">&</span> {data?.bride_name || 'Bride Name'}
                    </h1>

                    <p className="text-lg text-neutral-200 mb-8">
                        {timeDate ? timeDate.toLocaleDateString('id-ID', { weekday: "long" }) : ""}, {timeDate ? timeDate.toLocaleDateString('id-ID', {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        }) : ""}
                    </p>

                    <p className='text-serif text-sm  text-neutral-200 text-xs md:text-lg'>Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <p className='font-jawa text-[#B18B41] md:text-5xl text-4xl my-3'>M Irfansyah</p>
                    <div className='w-full flex justify-center items-center'>
                        <button
                            type='button'
                            onClick={() => { setIsOpen(!isOpen); playAudio(); }}
                            className='hover:scale-110 my-2 flex items-center p-2 rounded-lg bg-[#B18B41] text-white font-serif'><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-open" viewBox="0 0 16 16">
                                <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765z" />
                            </svg></span><span className='mx-2'>Buka Undangan</span></button>
                    </div>
                </div>

            </motion.section>

            <div className=''>
                {/* HERO */}
                <div id='hero'
                    className={`relative h-screen flex items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-cover bg-center brightness-50"
                        style={{ backgroundImage: `url('/slug/${slug}/7.jpeg')` }} />

                    <div className="relative z-10">

                        <motion.div
                            initial={{ opacity: 0, x: -200 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}>

                            <div className='w-full flex justify-center my-2'>
                                <img src="/jawa/gunungan-wayang.png" alt="" className='w-1/4' />
                            </div>

                            <p className="tracking-[0.4em] uppercase text-sm mb-4 text-neutral-300">
                                Wedding Invitation
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}>
                            <h1 className="text-6xl md:text-8xl font-serif mb-6 text-[#B18B41]">
                                {data?.groom_name || 'Groom Name'} <span className="">&</span> {data?.bride_name || 'Bride Name'}
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 200 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}>
                            <p className="text-lg text-neutral-200 mb-8">
                                {timeDate ? timeDate.toLocaleDateString('id-ID', { weekday: "long" }) : ""}, {timeDate ? timeDate.toLocaleDateString('id-ID', {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric"
                                }) : ""}
                            </p>

                            <p className='text-serif text-sm  text-neutral-200'>Tanpa Mengurangi Rasa Hormat,
                                Kami Mengundang Bapak/Ibu/Saudara/i
                                Untuk Hadir Di Acara Pernikahan Kami.
                            </p>
                        </motion.div>

                    </div>
                </div>

                {/* QUOTE */}
                <motion.section
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="py-28 px-6 bg-neutral-950/20 text-center">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-3xl md:text-5xl leading-relaxed font-serif text-[#B18B41]">
                            “Two souls with but a single thought, two hearts that beat as one.”
                        </p>
                    </div>
                </motion.section>

                {/* COUPLE */}
                <motion.section
                    id="partner"
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="py-28 px-6 "
                >
                    <motion.div className='relative w-full flex flex-col items-center justify-center my-10 mb-20'
                        initial={{ opacity: 0, x: -200 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}>
                        <div className='absolute -z-1 w-full flex justify-center my-2 opacity-40'>
                            <img src="/jawa/gunungan-wayang.png" alt="" className='md:w-1/6 w-1/2' />
                        </div>
                        <div className='text-center'>
                            <h2 className='text-[#505050] text-xl font-serif my-3'>Pasangan</h2>
                            <p className='font-jawa text-[#B18B41] text-4xl'>Pengantin</p>
                        </div>
                        <div className='my-5 w-full md:flex justify-center'>
                            <p className='text-[#505050] font-serif text-xs text-center md:text-xl md:w-1/3'>Maha Suci Allah SWT, Yang telah menciptakan makhlukNya berpasang-pasangan.
                                Ya Allah, perkenankanlah dan Ridhoilah Pernikahan kami.</p>
                        </div>
                    </motion.div>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                        {/* Groom */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="text-center">
                            <div className="w-56 h-56 mx-auto rounded-full overflow-hidden mb-8 border-4 border-[#B18B41]">
                                <img
                                    src={`/slug/${slug}/men.png`}
                                    alt="Groom"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h2 className="text-4xl font-jawa text-[#B18B41] mb-3">{data?.groom_name || 'Groom Name'}</h2>
                            <div className='w-full flex justify-center'>
                                <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                                </div>
                            </div>
                            <p className='text-[#505050] font-serif'>{data?.groom_info || 'Groom Info'}</p>
                        </motion.div>

                        {/* Bride */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="text-center">
                            <div className="w-56 h-56 mx-auto rounded-full overflow-hidden mb-8 border-4 border-[#B18B41]">
                                <img
                                    src={`/slug/${slug}/girl.png`}
                                    alt="Bride"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h2 className="text-4xl font-jawa text-[#B18B41] mb-3">{data?.bride_name || 'Bride Name'}</h2>
                            <div className='w-full flex justify-center'>
                                <div className='w-3/4 p-[0.2px] rounded-xl my-2 bg-black'>
                                </div>
                            </div>
                            <p className='text-[#505050] font-serif'>{data?.bride_info || 'Bride Info'}</p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* COUNTDOWN */}
                <motion.section
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative py-28 px-6 bg-center bg-cover text-center"
                    style={{ backgroundImage: `url(/slug/${slug}/6.jpeg)` }}>
                    <div className='absolute w-full h-full bg-black/40 z-10 top-0 left-0 inset-0'></div>
                    <motion.div className='relative z-20 mb-10'
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}>
                        <h2 className=" font-serif mb-5 text-neutral-100 text-xl">Hitung Mundur</h2>
                        <p className='font-jawa text-[#B18B41] font-bold text-5xl'>Menuju Hari Bahagia</p>
                    </motion.div>

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
                                className="rounded-3xl p-10 border border-neutral-100 backdrop-blur-[1px]"
                            >
                                <h3 className="text-5xl font-bold text-[#B18B41] mb-2">
                                    {item.value || '00'}
                                </h3>

                                <p className="text-neutral-100 uppercase tracking-widest text-sm">
                                    {item.label || '00'}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* EVENT */}
                <motion.section id='location'
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="py-28 px-6 bg-neutral-950">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className='w-full mb-10'>
                            <h2 className="font-serif text-xl my-2 text-neutral-100">Waktu & Tempat</h2>
                            <p className='font-jawa text-[#B18B41] text-4xl'>Pernikahan</p>
                            <p className='font-serif text-neutral-100 md:text-lg text-sm'>Pertemuan adalah permulaan, tetap bersama adalah perkembangan, bekerja sama adalah keberhasilan.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-10 border border-[#B18B41]">
                                <div className='w-full flex justify-center my-3'>
                                    <img src="/jawa/dovewhite.png" alt="" className='w-1/2' />
                                </div>
                                <h3 className="text-3xl mb-6 text-[#B18B41] font-jawa">
                                    Akad Nikah
                                </h3>

                                <p className="text-neutral-200 font-serif leading-8">
                                    {timeDate ? timeDate.toLocaleDateString('id-ID', { weekday: "long" }) : ""}
                                    <br /> <span className='text-5xl font-bold text-[#B18B41]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: "2-digit" }) : ""}</span>
                                    <br /> <span className='text-[#B18B41]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: "long", year: "numeric" }) : ""}</span>
                                    <br />
                                    {timeDate ? timeDate.toLocaleTimeString('id-ID', {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : ""} s/d Selesai
                                    <br />
                                    {data?.marriage_covenant_address}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="bg-black rounded-3xl p-10 border border-[#B18B41] ">
                                <div className='w-full flex justify-center my-3'>
                                    <img src="/jawa/bouquetwhite.png" alt="" className='w-1/3' />
                                </div>
                                <h3 className="text-3xl mb-6 text-[#B18B41] font-jawa">
                                    Reception
                                </h3>

                                <p className="text-neutral-200 font-serif leading-8">
                                    {timeDate ? timeDate.toLocaleDateString('id-ID', { weekday: "long" }) : ""}
                                    <br /> <span className='text-5xl font-bold text-[#B18B41]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { day: "2-digit" }) : ""}</span>
                                    <br /> <span className='text-[#B18B41]'>{timeDate ? timeDate.toLocaleDateString('id-ID', { month: "long", year: "numeric" }) : ""}</span>
                                    <br />
                                    {timeDate ? timeDate.toLocaleTimeString('id-ID', {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : ""} s/d Selesai
                                    <br />
                                    {data?.reception_address}
                                </p>
                            </motion.div>
                        </div>

                        <div className='w-full my-10'>
                            <motion.div className='w-full mb-10'
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}>
                                <h2 className="font-serif text-xl my-2 text-neutral-100">Lokasi</h2>
                                <p className='font-jawa text-[#B18B41] text-4xl'>{data?.venue}</p>
                                <p className='font-serif text-neutral-100 text-sm'>{data?.reception_address}</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className='w-full'>
                                <iframe
                                    src={`${data?.maps_link || null}`}
                                    className='w-full h-100'
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* Story */}
                <motion.section className="relative py-28 px-6 bg-center bg-cover text-center">
                    <div className='absolute w-full h-full bg-black/70 z-10 top-0 left-0 inset-0'></div>
                    <motion.div className='relative z-20 mb-10'
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}>
                        <h2 className=" font-serif mb-5 text-neutral-100 text-xl">Sebuah Kisah</h2>
                        <p className='font-jawa text-[#B18B41] font-bold text-5xl'>Perjalanan Kami</p>
                        <p className='font-serif text-neutral-100 md:text-lg text-sm mt-5'>Perjalanan yang tak terlupakan, dan perjalanan yang mengubah tujuan hidup kami</p>
                    </motion.div>

                    <div className="relative z-20">
                        <div className='w-full md:flex-row flex-col'>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className='my-5 w-full md:flex justify-center'>
                                <div className='md:w-1/4'>
                                    <h2 className='font-jawa text-[#B18B41] font-bold text-3xl'>Kisah</h2>
                                    <p>{data?.story}</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* GALLERY */}
                <motion.section id='gallery'
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="py-28 px-2">
                    <div className="max-w-6xl mx-auto">
                        <div className='w-full mb-20 text-center'>
                            <h2 className="font-serif text-xl my-2 text-[#505050]">Moment</h2>
                            <p className='font-jawa text-[#B18B41] text-4xl'>Bahagia Kami</p>
                            <p className='font-serif text-[#505050] md:text-lg text-sm mt-5'>Pertemuan adalah permulaan, tetap bersama adalah perkembangan, bekerja sama adalah keberhasilan.</p>
                        </div>

                        <div className="grid md:grid-cols-3 grid-cols-2 gap-1">
                            {['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg'].map((img, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 100 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 }}
                                    viewport={{ once: true }}
                                    key={idx}
                                    className="overflow-hidden w-full rounded-lg"
                                >
                                    <img
                                        src={`/slug/${slug}/${img}`}
                                        alt="Gallery"
                                        className="w-full h-full object-cover hover:scale-110 transition duration-700"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Gift */}
                <motion.section
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative py-28 px-6 bg-center bg-cover text-center">
                    <div className='absolute w-full h-full bg-black/70 z-10 top-0 left-0 inset-0'></div>
                    <motion.div className='relative z-20 mb-10'
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}>
                        <p className='font-jawa text-[#B18B41] font-bold text-5xl'>Amplop Digital</p>
                        <p className='font-serif text-neutral-100 md:text-lg text-sm mt-5'>Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila memberi adalah bentuk kasih, Anda dapat mengirimkan tanda kasih melalui amplop digital berikut.</p>
                    </motion.div>

                    <div className="relative z-20">
                        <div className='w-full md:flex-row flex-col'>
                            {data?.bank_account?.map((account, index) => (
                                <div key={index} className='relative my-5 text-[#505050] bg-white p-5 rounded-xl'>
                                    <div className='w-full flex justify-center my-2'>
                                        <img src={`/${account.bank_name}.svg`} alt={`${account?.bank_name}`} className='md:w-1/6 w-3/4' />
                                    </div>
                                    <p className='text-lg font-bold'>{account?.no_bank_account} <span onClick={() => handleCopyButton(account.no_bank_account)} className='hover:underline cursor-pointer text-sm font-normal bg-blue-100 px-2 py-1 rounded'>Copy</span> </p>
                                    <p className='text-sm'>A/N {account?.account_bank_name}</p>
                                </div>
                            ))}
                            <div className={`fixed w-full top-5 left-0 flex justify-center items-center z-50 ${isCopy ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'} transition-all duration-300 ease-in-out`}>
                                <p className="bg-green-500 text-white p-2 text-xs rounded-lg shadow-lg">Text copied to clipboard!</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* RSVP */}
                <motion.section
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="py-28 px-6 bg-neutral-950">
                    <motion.div className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, scale: 0, }}
                        whileInView={{ opacity: 1, scale: 1, }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}>
                        <div className='relative z-20 mb-10'>
                            <h2 className="font-serif text-xl my-2 text-neutral-100">Doa & Ucapan</h2>
                            <p className='font-jawa text-[#B18B41] text-4xl'>Untuk Kami Berdua</p>
                            <p className='font-serif text-neutral-100 md:text-lg text-sm'>Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/ Ibu/ Saudara/ i berkenan hadir, untuk memberikan do'a restu kepada kami.</p>
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
                                <button className='hover:scale-110 transition-all duration-400 ease-out w-1/2 bg-[#B18B41] text-white p-2 rounded-md my-1'>Kirim Ucapan</button>
                            </form>
                        </div>

                        <div className='relative w-full my-1'>
                            <div className='w-full flex flex-col bg-white rounded-md overflow-hidden'>
                                <div className='text-left font-serif p-2 px-4 w-full bg-[#B18B41]'>
                                    <p className='flex items-center text-white'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                    </svg><span className='mx-2'>Coments</span></p>
                                </div>
                                {ucapan.map((data, idx) => {
                                    const name = data.name.split(" ").map(n => n[0]).join('').toUpperCase();
                                    return (
                                        <div key={idx} className='w-full flex text-left text-black p-2 my-2'>
                                            <div className='w-1/5 md:w-1/8'>
                                                <div className='w-15 h-15 flex items-center justify-center border-[1px] border-[#FFDBFD] rounded-full overflow-hidden'>
                                                    <p>{name}</p>
                                                </div>
                                            </div>
                                            <div className='w-full p-2'>
                                                <div className='w-full flex items-center'>
                                                    <p className='font-bold'>{data.name}</p>
                                                    <p className='mx-3 p-1 px-2 text-xs text-white bg-[#B18B41] rounded-lg'>{data.status}</p>
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
                    </motion.div>
                </motion.section>

                {/* FOOTER */}
                <footer className="py-10 pb-40 text-center bg-black border-t border-neutral-900">
                    <p className="text-neutral-500">
                        © 2026 Solusi Digital Kreatif
                    </p>
                </footer>
            </div>
        </main>
    );
}