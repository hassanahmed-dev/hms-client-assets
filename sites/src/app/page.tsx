import { headers } from "next/headers";
import { brandFromHost } from "@/brands";
import { Site } from "@/components/Site";

export default async function Page() {
  const h = await headers();
  const b = brandFromHost(h.get("x-forwarded-host") || h.get("host"));
  return <Site slug={b.slug} />;
}
