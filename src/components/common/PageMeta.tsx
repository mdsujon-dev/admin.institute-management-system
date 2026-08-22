import { Helmet } from "react-helmet-async";
import { env } from "@/config/env";

interface PageMetaProps {
  title: string;
  description: string;
}

/** Sets the tab title and the description for one screen. */
export default function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Helmet>
      <title>{`${title} | ${env.appName}`}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
