import { getGuildMembers } from "@/actions/guild/get-guild-members";

export default async function Home() {
  const members = await getGuildMembers();

  const itemLevels = members?.members
    .filter((m) => m.level > 80 && m.equipped_item_level > 220)
    .map(function (m) {
      return {
        item_level: m.equipped_item_level,
        name: m.name,
      };
    })
    .sort((a, b) => b.item_level - a.item_level);


  return (
    <div>
     {itemLevels?.map(i => <div key={`${i.name}:${i.item_level}`}>{i.name}: {i.item_level}</div>)}


    </div>
  );
}
