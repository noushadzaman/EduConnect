import {
  groupBy,
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { getEnrollmentsForCourse } from "./enrollment";
import { getTestimonialsForCourse } from "./testimonials";
import { Lesson } from "@/model/lesson-model";

export async function getCourseList() {
  const courses = await Course.find({ active: true })
    .select([
      "title",
      "subtitle",
      "thumbnail",
      "modules",
      "price",
      "category",
      "instructor",
    ])
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
    })
    .populate({
      path: "modules",
      model: Module,
    })
    .lean();

  return replaceMongoIdInArray(courses);
}

export async function getCourseDetails(id) {
  const course = await Course.findById(id)
    .populate({
      path: "modules",
      model: Module,
      populate: {
        path: "lessonIds",
        model: Lesson,
      },
    })
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
      populate: {
        path: "user",
        model: User,
      },
    })
    .lean();

  return replaceMongoIdInObject(course);
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
  const publishedCourses = await Course.find({
    instructor: instructorId,
    active: true,
  }).lean();

  const enrollments = await Promise.all(
    publishedCourses.map(async (course) => {
      const enrollment = await getEnrollmentsForCourse(course._id.toString());
      return enrollment;
    })
  );
  const groupedByCourses = groupBy(enrollments.flat(), ({ course }) => course);

  const totalRevenue = publishedCourses.reduce((acc, course) => {
    const quantity = groupedByCourses[course._id]
      ? groupedByCourses[course._id].length
      : 0;
    return acc + quantity * course.price;
  }, 0);

  const totalEnrollments = enrollments.reduce(function (acc, obj) {
    return acc + obj.length;
  }, 0);

  const testimonials = await Promise.all(
    publishedCourses.map(async (course) => {
      const testimonial = await getTestimonialsForCourse(course._id.toString());
      return testimonial;
    })
  );
  const totalTestimonials = testimonials.flat();

  const avgRating =
    totalTestimonials.reduce(function (acc, obj) {
      return acc + obj.rating;
    }, 0) / totalTestimonials.length;

  if (expand) {
    const allCourses = await Course.find({ instructor: instructorId }).lean();
    return {
      courses: allCourses?.flat(),
      enrollments: enrollments?.flat(),
      reviews: totalTestimonials,
    };
  }

  return {
    courses: publishedCourses.length,
    enrollments: totalEnrollments,
    reviews: totalTestimonials.length,
    ratings: avgRating.toPrecision(2),
    revenue: totalRevenue,
  };
}

export async function create(courseData) {
  try {
    const course = await Course.create(courseData);
    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    throw new Error(error);
  }
}
