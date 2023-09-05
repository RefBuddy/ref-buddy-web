import { useState, useEffect } from 'react';
import { firestore } from '../../../../firebaseOptions';
import {
  doc,
  collection,
  query,
  onSnapshot,
  OrderByDirection,
  orderBy,
} from 'firebase/firestore';

export const useGameMessagesHook = (
  league: string,
  season: string,
  date: string,
  gameNumber: string,
) => {
  const [messages, setMessages] = useState<Message[]>([]);

  console.log('firestore', firestore);

  useEffect(() => {
    const leaguesCollection = collection(firestore, 'leagues');
    const leagueDoc = doc(leaguesCollection, league);
    const gamesCollection = collection(leagueDoc, 'games');
    const seasonDoc = doc(gamesCollection, season);
    const dateDoc = doc(seasonDoc, date);
    const gameNumberDoc = doc(dateDoc, gameNumber);

    const messagesRef = collection(gameNumberDoc, 'messages');

    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc' as OrderByDirection),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
      setMessages(newMessages);
    });

    // Clean up the listener when the component is unmounted
    return () => unsub();
  }, [league, season, date, gameNumber]);

  return messages;
};
