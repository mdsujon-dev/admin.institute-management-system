import { CompassOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Button } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import MessagePage from "@/components/common/MessagePage";

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" description="This page does not exist" />
      <MessagePage
        icon={<CompassOutlined />}
        title="We cannot find that page"
        description="The link may be out of date, or the page may have been moved."
        action={
          <Link to="/">
            <Button size="lg">Back to dashboard</Button>
          </Link>
        }
      />
    </>
  );
}
