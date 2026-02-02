import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Fixture, GroupTable, Team } from '@/types';

const COMPETITION_ID_FOOTBALL_DATA_API = 'WC'; // 'WC' FOR WORLD CUP 'CL' FOR CHAMPIONS LEAGUE
const FIRESTORE_COMPETITION_ID = 'wc-2026';

export async function GET(request: Request) {
  const apiUrl = `https://api.football-data.org/v4/competitions/${COMPETITION_ID_FOOTBALL_DATA_API}`;

  try {
    // --- 1. SECURITY ---
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.NEXT_CRON_SECRET;
    const { searchParams } = new URL(request.url);
    const queryKey = searchParams.get('key');

    const isAuthorized = authHeader === `Bearer ${cronSecret}` || queryKey === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- 2. PARALLEL FETCH (SAVE TIME) ---
    const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
    const HEADERS = { 'X-Auth-Token': API_KEY || '' };

    const [matchesRes, standingsRes] = await Promise.all([
      fetch(`${apiUrl}/matches`, {
        headers: HEADERS,
        next: { revalidate: 0 }, // No cachear nunca
      }),
      fetch(`${apiUrl}/standings`, {
        headers: HEADERS,
        next: { revalidate: 0 },
      }),
    ]);

    const batch = adminDb.batch();
    let updatesCount = 0;

    // --- 3. PROCESS MATCHES ---
    if (matchesRes.ok) {
      const data = await matchesRes.json();

      const matchesCollectionRef = adminDb
        .collection('competitions')
        .doc(FIRESTORE_COMPETITION_ID)
        .collection('matches');

      data.matches.forEach((apiMatch: any) => {
        const docRef = matchesCollectionRef.doc(String(apiMatch.id));

        const matchData: Partial<Fixture> = {
          id: String(apiMatch.id),
          competition: {
            id: FIRESTORE_COMPETITION_ID,
            name: data.competition.name,
            code: data.competition.code,
            logo: data.competition.emblem,
          },
          date: apiMatch.utcDate,
          status: apiMatch.status, // SCHEDULED, IN_PLAY, PAUSED, FINISHED
          stage: apiMatch.stage, // GROUP_STAGE, LAST_16...
          group: apiMatch.group, // GROUP_A

          homeTeam: {
            id: String(apiMatch.homeTeam.id),
            name: apiMatch.homeTeam.name,
            code: apiMatch.homeTeam.tla,
            logo: apiMatch.homeTeam.crest,
          },
          awayTeam: {
            id: String(apiMatch.awayTeam.id),
            name: apiMatch.awayTeam.name,
            code: apiMatch.awayTeam.tla,
            logo: apiMatch.awayTeam.crest,
          },

          score: {
            winner: apiMatch.score?.winner ?? null,
            duration: apiMatch.score?.duration ?? null,
            fullTime: {
              home: apiMatch.score?.fullTime?.home ?? null,
              away: apiMatch.score?.fullTime?.away ?? null,
            },
            halfTime: {
              home: apiMatch.score?.halfTime?.home ?? null,
              away: apiMatch.score?.halfTime?.away ?? null,
            },
            regularTime: {
              home: apiMatch.score?.regularTime?.home ?? null,
              away: apiMatch.score?.regularTime?.away ?? null,
            },
            penalties: apiMatch.score?.penalties
              ? {
                  home: apiMatch.score.penalties.home ?? null,
                  away: apiMatch.score.penalties.away ?? null,
                }
              : null,
          },
        };

        batch.set(docRef, matchData, { merge: true });
        updatesCount++;
      });
    } else {
      console.error('Error fetching matches:', matchesRes.status);
    }

    // --- 4. PROCESS STANDINGS ---
    if (standingsRes.ok) {
      const data = await standingsRes.json();

      console.log('Standings data:', data);

      // Referencia a la subcolección de standings
      const standingsCollectionRef = adminDb
        .collection('competitions')
        .doc(FIRESTORE_COMPETITION_ID)
        .collection('standings');

      if (data.standings) {
        data.standings.forEach((groupData: any) => {
          if (groupData.type === 'TOTAL') {
            // JUST GENERAL STANDINGS
            const groupId = groupData.group;
            const docRef = standingsCollectionRef.doc(groupId);

            const standingData: GroupTable = {
              group: groupId,
              table: groupData.table.map((row: any) => ({
                position: row.position,
                team: {
                  id: row.team.id,
                  name: row.team.name,
                  code: row.team.tla,
                  logo: row.team.crest,
                } as Team,
                playedGames: row.playedGames,
                form: row.form,
                won: row.won,
                draw: row.draw,
                lost: row.lost,
                points: row.points,
                goalsFor: row.goalsFor,
                goalsAgainst: row.goalsAgainst,
                goalDifference: row.goalDifference,
              })),
            };

            batch.set(docRef, standingData); // UPDATE TABLE
            updatesCount++;
          }
        });
      }
    } else {
      console.error('Error fetching standings:', standingsRes.status);
    }

    // --- 5. SAVE CHANGES ---
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Updated ${updatesCount} documents in ${FIRESTORE_COMPETITION_ID}`,
    });
  } catch (error: any) {
    console.error('CRON ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
