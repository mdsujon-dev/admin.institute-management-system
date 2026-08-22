import { PageHeader } from "@/components/ui";
import PageMeta from "@/components/common/PageMeta";
import StudentList from "@/pages/students/StudentList";

export default function StudentsPage() {
  return (
    <>
      <PageMeta title="Students" description="Admitted students and their guardians" />
      <PageHeader
        title="Students"
        description="Everyone admitted, with the login they use to sign in."
      />
      <StudentList />
    </>
  );
}
