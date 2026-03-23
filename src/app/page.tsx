import { getGuildMembers } from "@/actions/guild/get-guild-members";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Home() {
  const members = await getGuildMembers();

  const itemLevels = members?.members
    .filter((m) => m.level > 80 && m.equipped_item_level >= 237)
    .map(function (m) {
      return {
        item_level: m.equipped_item_level,
        name: m.name,
      };
    })
    .sort((a, b) => b.item_level - a.item_level);

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Item Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemLevels?.map((i) => (
            <TableRow key={`${i.name}-${i.item_level}`}>
              <TableCell className="font-medium">{i.name}</TableCell>
              <TableCell>{i.item_level}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
