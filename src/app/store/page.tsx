import { getSchools } from "@/supabase/hooks/server/schools";
import SchoolList from "./components/SchoolList";

export default async function StorePage() {
  const schools = await getSchools();
  return (
    <div className="flex flex-col items-center p-10">
      <SchoolList schools={schools} />
    </div>
  );
}
