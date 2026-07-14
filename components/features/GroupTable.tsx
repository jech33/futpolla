import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

import { GroupTable as GroupTableType } from '@/domain/entities';

export function GroupTable(props: GroupTableType) {
  const { group, table } = props;
  return (
    <Table className="min-w-72">
      <TableHeader>
        <TableRow className="h-12">
          <TableHead className="w-full" colSpan={2}>
            {group}
          </TableHead>
          <TableHead>PJ</TableHead>
          <TableHead>G</TableHead>
          <TableHead>E</TableHead>
          <TableHead>P</TableHead>
          <TableHead>DG</TableHead>
          <TableHead>Pts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.map((team, idx) => (
          <TableRow key={team.team.id || `${group}-team-${idx}`} className="h-12">
            <TableCell>{team.position}</TableCell>
            <TableCell className="w-full pl-0">
              <div className="flex h-full items-center gap-3">
                {!team?.team?.logo ? (
                  <div className="flex h-4 w-5 items-center justify-center bg-gray-200 text-xs text-gray-500">
                    ?
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={team.team.logo}
                    alt={team?.team?.name || 'Team'}
                    className="h-auto w-5"
                  />
                )}
                <span>{team.team.code || 'TBD'}</span>
              </div>
            </TableCell>
            <TableCell>{team.playedGames}</TableCell>
            <TableCell>{team.won}</TableCell>
            <TableCell>{team.draw}</TableCell>
            <TableCell>{team.lost}</TableCell>
            <TableCell>{team.goalDifference}</TableCell>
            <TableCell>{team.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
