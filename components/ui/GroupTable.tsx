import { GroupTable as GroupTableType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

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
              <div className="flex h-full gap-3">
                <img src={team.team.logo} alt={team.team.name} className="h-auto w-5" />
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
