import { getEnrollmentsForUser } from "@/queries/enrollment";
import EnrolledCourseCard from "../../component/enrolled-coursecard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/queries/users";

async function EnrolledCourses() {
	const session = await auth();
	if (!session?.user) {
		redirect("/login");
	}

	const loggedInUser = await getUserByEmail(session?.user?.email);
	const enrollments = await getEnrollmentsForUser(loggedInUser?.id);

	return (
		<div className="grid sm:grid-cols-2 gap-6">
			{
				enrollments && enrollments.length > 0 ?
					enrollments.map(enrollment => <EnrolledCourseCard
						key={enrollment.id}
						enrollment={enrollment} />)
					: <p>No Enrollments found</p>
			}
		</div>
	);
}

export default EnrolledCourses;
