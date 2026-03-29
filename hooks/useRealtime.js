'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Subscribe to real-time changes on a table
export function useRealtime(table, filter = null, callback = null) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let channel;

    const setupSubscription = () => {
      let channelConfig = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            ...(filter && { filter }),
          },
          (payload) => {
            if (callback) {
              callback(payload);
            }

            setData((prev) => {
              if (payload.eventType === 'INSERT') {
                return [payload.new, ...prev];
              }
              if (payload.eventType === 'UPDATE') {
                return prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                );
              }
              if (payload.eventType === 'DELETE') {
                return prev.filter((item) => item.id !== payload.old.id);
              }
              return prev;
            });
          }
        );

      channel = channelConfig.subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter]);

  return { data, setData };
}

export default useRealtime;
