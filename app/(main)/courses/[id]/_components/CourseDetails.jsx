import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { formatMyDate } from "@/lib/date";
import CourseOverview from "./CourseOverview";
import CourseCurriculum from "./CourseCurriculum";
import CourseInstructor from "./CourseInstructor";

const CourseDetails = ({ course }) => {
  const lastModifiedOn = formatMyDate(course?.modifiedOn);

  return (
    <section className="py-8 md:py-12 lg:py-24">
      <div className="container">
        <span className="bg-success px-4 py-0.5 rounded-[5px] text-xs font-medium inline-block bg-[#f68d89]">
          {course?.category?.title}
        </span>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold 2xl:text-5xl mt-3">
          {course?.title}
        </h3>
        <p className="mt-3 text-gray-600 text-sm">
          {course?.subtitle}
        </p>
        {/*  */}
        <div className="flex sm:items-center gap-5 flex-col sm:flex-row sm:gap-6 md:gap-20 mt-6">
          <div className="flex items-center gap-2">
            <Image
              height={20}
              width={20}
              className="w-[40px] h-[40px] rounded-full"
              src={course?.instructor?.profilePicture}
              alt={course?.instructor?.firstName}
            />
            <p className="font-bold">
              {course?.instructor?.firstName} {" "}
              {course?.instructor?.lastName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-success font-semibold">Last Updated: {lastModifiedOn}</span>
            <span>{ }</span>
          </div>
        </div>

        {/* Tab */}
        <div className="my-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 my-6 max-w-[768px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Carriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview">
              <CourseOverview course={course} />
            </TabsContent>
            <TabsContent value="curriculum">
              <CourseCurriculum course={course} />
            </TabsContent>
            <TabsContent value="instructor">
              <CourseInstructor course={course} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;