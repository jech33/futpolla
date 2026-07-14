/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fixture, GroupTable, Team } from '@/domain/entities';
import { APP_CONFIG } from '@/lib/appConfig';
import { SportsDataProvider } from '@/ports/outbound/SportsDataProvider';

export function makeFootballDataSportsDataProvider(): SportsDataProvider {
  const apiUrl = `https://api.football-data.org/v4/competitions/${APP_CONFIG.tournament.apiCompetitionId}`;
  const headers = { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || '' };

  return {
    async getMatches(): Promise<Partial<Fixture>[]> {
      const res = await fetch(`${apiUrl}/matches`, {
        headers,
        next: { revalidate: 0 }, // No cachear nunca
      });

      if (!res.ok) {
        console.error('Error fetching matches:', res.status);
        return [];
      }

      const data = await res.json();

      return data.matches.map((apiMatch: any) => {
        const matchData: Partial<Fixture> = {
          id: String(apiMatch.id),
          competition: {
            id: APP_CONFIG.tournament.competitionId,
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

        return matchData;
      });
    },

    async getStandings(): Promise<GroupTable[]> {
      const res = await fetch(`${apiUrl}/standings`, {
        headers,
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        console.error('Error fetching standings:', res.status);
        return [];
      }

      const data = await res.json();

      console.log('Standings data:', data);

      if (!data.standings) return [];

      return data.standings
        .filter((groupData: any) => groupData.type === 'TOTAL') // JUST GENERAL STANDINGS
        .map((groupData: any) => {
          const standingData: GroupTable = {
            group: groupData.group,
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

          return standingData;
        });
    },
  };
}
