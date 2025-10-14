"use client";

import { getRetakeCourses } from "@/lib/api/retake-course";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["retake-courses"],
    queryFn: () => getRetakeCourses(),
  });
  console.log("retake courses", data);    
  return <div>Courses to retake</div>;
}
