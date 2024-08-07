import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  BookOpenCheck,
  Eye,
  LayoutDashboard,
  Video,
} from "lucide-react";
import Link from "next/link";
import { ModuleTitleForm } from "./_components/module-title-form";
import { LessonForm } from "./_components/lesson-form";
import { getModule } from "@/queries/modules";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { ModuleActions } from "./_components/module-action";

const Module = async ({ params: { courseId, moduleId } }) => {
  const singleModule = await getModule(moduleId);
  const lessons = replaceMongoIdInArray(singleModule?.lessonIds).sort((a, b) => a.order - b.order);

  return (
    <>
      {
        !singleModule?.active && <AlertBanner
          label="This module is unpublished. It will not be visible in the course."
          variant="warning"
        />
      }
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-end">
              <ModuleActions singleModule={singleModule} courseId={courseId} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize Your module</h2>
              </div>
              <ModuleTitleForm initialData={{ title: singleModule.title }} courseId={courseId} chapterId={moduleId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpenCheck} />
                <h2 className="text-xl">Module Lessons</h2>
              </div>
              <LessonForm
                initialData={lessons}
                courseId={courseId}
                moduleId={moduleId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Module;
