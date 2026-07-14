import { NextResponse } from 'next/server';

import { syncTournamentDataUseCase } from '@/composition/server';
import { APP_CONFIG } from '@/lib/appConfig';

export async function GET(request: Request) {
  try {
    // --- SECURITY ---
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.NEXT_CRON_SECRET;
    const { searchParams } = new URL(request.url);
    const queryKey = searchParams.get('key');

    const isAuthorized = authHeader === `Bearer ${cronSecret}` || queryKey === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { updatesCount } = await syncTournamentDataUseCase.execute();

    return NextResponse.json({
      success: true,
      message: `Updated ${updatesCount} documents in ${APP_CONFIG.tournament.competitionId}`,
    });
  } catch (error) {
    console.error('CRON ERROR:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
