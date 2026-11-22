import { buildBrand } from "@/brands";
import { Site } from "@/components/Site";

export const dynamic = "force-static";

export default function Page() {
  return <Site slug={buildBrand().slug} />;
}
