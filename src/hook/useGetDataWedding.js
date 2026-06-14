'use client';

import { supabase } from '@/lib/clientConnection';
import { useState, useEffect } from 'react';

export default function useGetDataWedding(slug) {
    const [data, setData] = useState(null);

    useEffect(() => {
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
            }
        }

        fetchData();
    }, []);

    return data;
}