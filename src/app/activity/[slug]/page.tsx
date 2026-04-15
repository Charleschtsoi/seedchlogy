import { notFound } from "next/navigation";
import { ZenShell } from "@/components/ZenShell";
import { getActivity } from "@/lib/activities";
import { ActivityPlayer } from "./ActivityPlayer";

type Props = { params: Promise<{ slug: string }> };

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity) {
    notFound();
  }

  return (
    <ZenShell>
      <ActivityPlayer activity={activity} />
    </ZenShell>
  );
}
