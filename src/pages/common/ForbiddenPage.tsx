import { LockOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { Button } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import MessagePage from "@/components/common/MessagePage";

/**
 * Where `ProtectedRoute` sends somebody who is signed in but not allowed. A
 * plain "no" beats a redirect loop back to a page they cannot open.
 */
export default function ForbiddenPage() {
  return (
    <>
      <PageMeta title="Not allowed" description="You do not have access to this page" />
      <MessagePage
        icon={<LockOutlined />}
        tone="danger"
        title="You do not have access to this page"
        description="Your role does not include the permission this screen needs. Ask an administrator if you think that is wrong."
        action={
          <Link to="/">
            <Button size="lg">Back to dashboard</Button>
          </Link>
        }
      />
    </>
  );
}
