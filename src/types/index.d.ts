import { title } from "process";
import { number, string, z } from "zod";

/**
 * Represents a Year object with various properties.
 *
 * @property {number} id - The unique identifier for the year.
 * @property {Institute | null} university - The associated university or institute, which can be null.
 * @property {string} name - The name of the year.
 * @property {string} start_date - The start date of the year in string format, expected to be a valid date.
 * @property {string} end_date - The end date of the year in string format, expected to be a valid date.
 * @property {"pending" | "progress" | "finished" | "suspended"} status - The current status of the year, which can be one of the following:
 * - "pending": The year is pending and has not started yet.
 * - "progress": The year is currently in progress.
 * - "finished": The year has been completed.
 * - "suspended": The year has been suspended.
 */
export const Year = z.object({
  id: z.number(),
  university: Institute.nullable(),
  name: z.string(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  status: z.enum(["pending", "progress", "finished", "suspended"]),
});

export type Year = z.infer<typeof Year>;

/**
 * Represents an Institute with various properties describing its details.
 *
 * @property {number} id - A unique identifier for the institute.
 * @property {string} name - The full name of the institute.
 * @property {string} acronym - The acronym or short form of the institute's name.
 * @property {"university" | "institut"} category - The category of the institute, either "university" or "institut".
 * @property {string} address - The physical address of the institute.
 * @property {string} web_site - The official website URL of the institute.
 * @property {string} phone_number_1 - The primary contact phone number of the institute.
 * @property {string | null} phone_number_2 - An optional secondary contact phone number of the institute.
 * @property {string} email_address - The official email address of the institute.
 * @property {string | null} logo - An optional URL to the logo of the institute.
 * @property {string | null} parent_organization - An optional name of the parent organization, if applicable.
 * @property {"private" | "public"} status - The status of the institute, either "private" or "public".
 * @property {string | null} motto - An optional motto of the institute.
 * @property {string} slogan - The slogan of the institute.
 * @property {string} vision - The vision statement of the institute.
 * @property {string} mission - The mission statement of the institute.
 * @property {string} country - The country where the institute is located.
 * @property {string} city - The city where the institute is located.
 * @property {string} province - The province or state where the institute is located.
 */
export const Institute = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  category: z.enum(["university", "institut"]),
  address: z.string(),
  web_site: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  email_address: z.string(),
  logo: z.string().nullable(),
  parent_organization: z.string().nullable(),
  status: z.enum(["private", "public"]),
  motto: z.string().nullable(),
  slogan: z.string(),
  vision: z.string(),
  mission: z.string(),
  country: z.string(),
  city: z.string(),
  province: z.string(),
});

export type Institute = z.infer<typeof Institute>;

/**
 * Represents an academic cycle with its associated properties.
 *
 * @property {number} id - Unique identifier of the academic cycle.
 * @property {string} name - Name of the academic cycle (e.g., Licence, Master, Doctorat).
 * @property {string} symbol - Single-character symbol representing the cycle.
 * @property {number | null} planned_credits - Total planned credits for the academic cycle (nullable).
 * @property {number | null} planned_years - Total planned years for the academic cycle (nullable).
 * @property {number | null} planned_semester - Total planned semesters for the academic cycle (nullable).
 * @property {string | null} purpose - Description or purpose of the academic cycle (nullable).
 */
export const Cycle = z.object({
  id: z.number(),
  name: z.enum(["Licence", "Master", "Doctorat"]),
  symbol: z.string().max(1),
  planned_credits: z.number().nullable(),
  planned_years: z.number().nullable(),
  planned_semester: z.number().nullable(),
  purpose: z.string().nullable(),
  order_number: z.number(),
});

export type Cycle = z.infer<typeof Cycle>;

/**
 * Represents a Field with its associated properties.
 *
 * @property {number} id - Unique identifier of the field.
 * @property {Cycle | null} cycle - The academic cycle associated with the field (nullable).
 * @property {string} name - Name of the field.
 * @property {string} acronym - Acronym representing the field.
 */
export const Field = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  name: z.string(),
  acronym: z.string(),
});

export type Field = z.infer<typeof Field>;

/**
 * Represents a faculty entity within the system.
 *
 * @remarks
 * The `Faculty` object contains information about a faculty, including its coordinator,
 * secretary, other members, associated field, name, and acronym.
 *
 * @property {number} id - Unique identifier for the faculty.
 * @property {Teacher | null} coordinator - The teacher who coordinates the faculty. Can be null.
 * @property {Teacher | null} secretary - The teacher who acts as secretary for the faculty. Can be null.
 * @property {Teacher[]} other_members - An array of teachers who are other members of the faculty.
 * @property {Field} field - The field or area of expertise associated with the faculty.
 * @property {string} name - The full name of the faculty.
 * @property {string} acronym - The acronym representing the faculty.
 */
export const Faculty = z.object({
  id: z.number(),
  coordinator: Teacher.nullable(),
  secretary: Teacher.nullable(),
  other_members: z.array(Teacher),
  field: Field,
  name: z.string(),
  acronym: z.string(),
});

export type Faculty = z.infer<typeof Faculty>;

/**
 * Represents a department within an educational institution.
 *
 * @remarks
 * This type defines the structure for a department, including its unique identifier,
 * associated class years, faculty, director, other members, name, and acronym.
 *
 * @property {number} id - Unique identifier for the department.
 * @property {Class} start_class_year - The starting class year associated with the department.
 * @property {Class} end_class_year - The ending class year associated with the department.
 * @property {Faculty} faculty - The faculty to which the department belongs.
 * @property {Teacher | null} director - The director of the department, which may be null.
 * @property {Teacher[]} other_members - An array of other teachers who are members of the department.
 * @property {string} name - The full name of the department.
 * @property {string} acronym - The acronym representing the department.
 */
export const Department = z.object({
  id: z.number(),
  start_class_year: Class,
  end_class_year: Class,
  faculty: Faculty,
  director: Teacher.nullable(),
  other_members: z.array(Teacher),
  name: z.string(),
  acronym: z.string(),
});

export type Department = z.infer<typeof Department>;

/**
 * Represents a school class entity.
 *
 * @remarks
 * This schema defines the structure for a class, including its unique identifier,
 * associated cycle, name, acronym, order number, and an optional description.
 *
 * @property {number} id - Unique identifier for the class.
 * @property {Cycle | null} cycle - The cycle to which the class belongs. Can be null.
 * @property {string} name - The name of the class.
 * @property {string} acronym - The acronym representing the class.
 * @property {number} order_number - The order number of the class.
 * @property {string} description - Optional description of the class. Can be null.
 */
export const Class = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  name: z.string(),
  acronym: z.string(),
  order_number: z.number(),
  description: z.string().nullable(),
});

export type Class = z.infer<typeof Class>;

/**
 * Represents a class president.
 *
 * @property {number} id - Unique identifier for the class president.
 * @property {Department} departement - The department to which the class president belongs.
 * @property {Class} class_year - The class year of the president.
 * @property {Enrollment} student - Enrollment information of the student president.
 */
export const ClassPresident = z.object({
  id: z.number(),
  departement: Department,
  class_year: Class,
  student: Enrollment,
});

export type ClassPresident = z.infer<typeof ClassPresident>;

/**
 * Represents an academic period with its properties and status.
 *
 * @decorator z.object
 * @property {number} id - Unique identifier for the period.
 * @property {Cycle | null} cycle - The academic cycle associated with the period, or null if not applicable.
 * @property {Year} academic_year - The academic year for the period.
 * @property {string} name - The full name of the period.
 * @property {string} acronym - The acronym or short name of the period.
 * @property {"semester" | "block_semester" | "quarter" | "term"} type_of_period - The type of academic period.
 * @property {number} order_number - The order of the period within the academic year.
 * @property {string} start_date - The start date of the period (ISO string).
 * @property {string} end_date - The end date of the period (ISO string).
 * @property {number} max_value - The maximum value associated with the period (e.g., credits, points).
 * @property {"pending" | "progress" | "finished" | "suspended"} status - The current status of the period.
 */
export const Period = z.object({
  id: z.number(),
  cycle: Cycle.nullable(),
  academic_year: Year,
  name: z.string(),
  acronym: z.string(),
  type_of_period: z.enum(["semester, block_semester, quarter, term"]),
  order_number: z.number(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  max_value: z.number(),
  status: z.enum(["pending", "progress", "finished", "suspended"]),
});

export type Period = z.infer<typeof Period>;

/**
 * Represents a currency used in the application.
 *
 * @decorator @model
 * @decorator @currency
 * @property {number} id - Unique identifier for the currency.
 * @property {string} name - Name of the currency.
 * @property {('')} iso_code - ISO code of the currency (currently no values defined).
 * @property {string} symbol - Symbol of the currency (e.g., €, $, £).
 * @property {boolean} enabled - Indicates whether the currency is enabled.
 */
export const Currency = z.object({
  id: z.number(),
  name: z.string(),
  iso_code: z.enum([]),
  symbol: z.string(),
  enabled: z.boolean(),
});

export type Currency = z.infer<typeof Currency>;

/**
 * @typedef PaymentMethod
 * Represents a payment method available in the system.
 *
 * @property {number} id - Unique identifier for the payment method.
 * @property {string} name - Display name of the payment method.
 * @property {string} description - Detailed description of the payment method.
 * @property {boolean} enabled - Indicates whether the payment method is currently enabled.
 */
export const PaymentMethod = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
});

export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * Represents a permission object.
 *
 * @decorator Permission
 * @property {number} id - Unique identifier for the permission.
 * @property {string} name - Human-readable name of the permission.
 * @property {number} content_type_id - Identifier for the related content type.
 * @property {string} codename - Code name used for permission checks.
 * @property {number} content_type - Content type associated with the permission.
 */
export const Permission = z.object({
  id: z.number(),
  name: z.string(),
  content_type_id: z.number(),
  codename: z.string(),
  content_type: z.number(),
});

export type Permission = z.infer<typeof Permission>;

/**
 * Represents a group entity with a unique identifier, name, and associated permissions.
 *
 * @decorator Group
 * @property {number} id - The unique identifier for the group.
 * @property {string} name - The name of the group.
 * @property {Permission[]} permissions - An array of permissions assigned to the group.
 */
export const Group = z.object({
  id: z.number(),
  name: z.string(),
  permissions: z.array(Permission),
});

export type Group = z.infer<typeof Group>;

/**
 * @decorator
 * Represents a user role within the system.
 *
 * @property id - Unique identifier for the role.
 * @property name - Human-readable name of the role.
 */
export const Role = z.object({
  id: z.number(),
  name: z.string(),
});

export type Role = z.infer<typeof Role>;

export type RolesType =
  | "is_apparitor"
  | "is_apparitorat_personal"
  | "is_faculty_coordinator"
  | "is_faculty_secretary"
  | "is_faculty_personal"
  | "is_finance_budget_administrator"
  | "is_finance_accountant"
  | "is_finance_personal"
  | "is_jury_president"
  | "is_jury_secretary"
  | "is_jury_member"
  | "is_jury_personal"
  | "is_rector"
  | "is_rectorship_cabin_manager"
  | "is_rectorship_secretary"
  | "is_rectorship_personal"
  | "is_academic_general_secretary"
  | "is_sgad_cabin_manager"
  | "is_sgad_secretary"
  | "is_sgad_personal"
  | "is_administrative_secretary_general"
  | "is_sga_personal_manager"
  | "is_sga_secretary"
  | "is_sga_personal"
  | "is_reseach_general_secretary"
  | "is_sgr_cabin_manager"
  | "is_sgr_secretary"
  | "is_sgr_personal";

/**
 * @typedef User
 * Represents a user entity in the system.
 *
 * @property {number} id - Unique identifier for the user.
 * @property {Permission[]} user_permissions - List of permissions assigned to the user.
 * @property {Group[]} groups - Groups to which the user belongs.
 * @property {string} last_login - ISO string representing the user's last login datetime.
 * @property {boolean} is_superuser - Indicates if the user has superuser privileges.
 * @property {string | null} first_name - User's first name, nullable.
 * @property {string | null} last_name - User's last name, nullable.
 * @property {boolean} is_staff - Indicates if the user is a staff member.
 * @property {boolean} is_student - Indicates if the user is a student.
 * @property {boolean} is_active - Indicates if the user account is active.
 * @property {boolean} is_permanent_teacher - Indicates if the user is a permanent teacher.
 * @property {string} date_joined - ISO string representing the date the user joined.
 * @property {string | null} surname - User's surname, nullable.
 * @property {string} username - User's username.
 * @property {string} email - User's email address.
 * @property {string} matricule - User's matricule (registration number).
 * @property {string | null} avatar - URL or path to the user's avatar image, nullable.
 * @property {string | null} pending_avatar - URL or path to the user's pending avatar image, nullable.
 * @property {Role[]} roles - List of roles assigned to the user.
 *
 * @decorator
 * @see Permission
 * @see Group
 * @see Role
 */
export const User = z.object({
  id: z.number(),
  user_permissions: z.array(Permission),
  groups: z.array(Group),
  last_login: z.string().datetime(),
  is_superuser: z.boolean(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  is_staff: z.boolean(),
  is_student: z.boolean(),
  is_active: z.boolean(),
  is_permanent_teacher: z.boolean(),
  date_joined: z.string().datetime(),
  surname: z.string().nullable(),
  username: z.string(),
  email: z.string().email(),
  matricule: z.string(),
  avatar: z.string().nullable(),
  pending_avatar: z.string().nullable(),
  roles: z.array(Role),
});

export type User = z.infer<typeof User>;

/**
 * @class Classroom
 * Represents a classroom entity with its properties and status.
 *
 * @property {number} id - Unique identifier for the classroom.
 * @property {string} name - Name of the classroom.
 * @property {"amphitheater" | "classroom" | "laboratory" | "computer-room" | "meeting-room" | "chapel" | "office" | null} room_type
 *   - Type of the room. Can be null if not specified.
 * @property {number | null} capacity - Maximum number of people the classroom can accommodate. Can be null.
 * @property {string} code - Internal code or reference for the classroom.
 * @property {"occupied" | "unoccupied" | null} status - Current occupancy status of the classroom. Can be null.
 *
 * @decorator z.object
 */
export const Classroom = z.object({
  id: z.number(),
  name: z.string(),
  room_type: z
    .enum([
      "amphitheater", // Amphithéâtre
      "classroom", // Salle de cours
      "laboratory", // Laboratoire
      "computer-room", // Salle informatique
      "meeting-room", // Salle de réunion
      "chapel", // Chapelle
      "office", // Bureau
    ])
    .nullable(),
  capacity: z.number().nullable(),
  code: z.string(),
  status: z.enum(["occupied", "unoccupied"]).nullable(),
});

export type Classroom = z.infer<typeof Classroom>;

/**
 * @module Course
 * @description
 * Represents a course entity with its unique identifier, associated faculties, name, code, and type.
 *
 * @property {number} id - Unique identifier for the course.
 * @property {Faculty[]} faculties - Array of faculties associated with the course.
 * @property {string} name - Name of the course.
 * @property {string} code - Code representing the course.
 * @property {"theoretical" | "practical" | "theoretical_and_practical"} course_type - Type of the course, indicating whether it is theoretical, practical, or both.
 */
export const Course = z.object({
  id: z.number(),
  faculties: z.array(Faculty),
  name: z.string(),
  code: z.string(),
  course_type: z.enum([
    "theoretical",
    "practical",
    "theoretical_and_practical",
  ]),
});

export type Course = z.infer<typeof Course>;

/**
 * Represents a teaching unit within the academic system.
 *
 * @remarks
 * This type defines the structure for a teaching unit, including its identification,
 * categorization, and academic associations.
 *
 * @property {number} id - Unique identifier for the teaching unit.
 * @property {string} name - Name of the teaching unit.
 * @property {string} code - Code representing the teaching unit.
 * @property {"required" | "optional" | "free" | "transversal"} category - Category of the teaching unit.
 * @property {Faculty | null} faculty - Associated faculty. Can be null if not assigned.
 * @property {Cycle | null} cycle - Academic cycle. Can be null if not assigned.
 * @property {number | null} credit_count - Number of credits for the teaching unit. Can be null if not applicable.
 */
export const TeachingUnit = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  category: z.enum(["required", "optional", "free", "transversal"]),
  faculty: Faculty.nullable(),
  cycle: Cycle.nullable(),
  credit_count: z.number().nullable(),
});

export type TeachingUnit = z.infer<typeof TeachingUnit>;

/**
 * Represents a course taught during an academic period.
 *
 * @property {number} id - Unique identifier for the taught course.
 * @property {Teacher | null} teacher - The main teacher assigned to the course, or null if not assigned.
 * @property {Teacher[] | null} assistants - Array of assistant teachers, or null if none.
 * @property {Classroom | null} class_room - The classroom where the course is held, or null if not assigned.
 * @property {Year | null} academic_year - The academic year of the course, or null if not specified.
 * @property {TeachingUnit | null} teaching_unit - The teaching unit associated with the course, or null if not specified.
 * @property {Period | null} period - The period during which the course is taught, or null if not specified.
 * @property {Course} available_course - The available course reference.
 * @property {Faculty} faculty - The faculty to which the course belongs.
 * @property {Department[]} departements - Array of departments associated with the course.
 * @property {number | null} credit_count - Number of credits for the course, or null if not specified.
 * @property {number | null} theoretical_hours - Number of theoretical hours, or null if not specified.
 * @property {number | null} practical_hours - Number of practical hours, or null if not specified.
 * @property {number | null} max_value - Maximum value (e.g., capacity or score), or null if not specified.
 * @property {Date | null} start_date - Start date of the course, or null if not specified.
 * @property {Date | null} end_date - End date of the course, or null if not specified.
 * @property {"pending" | "progress" | "finished" | "suspended" | null} status - Current status of the course, or null if not specified.
 */
export const TaughtCourse = z.object({
  id: z.number(),
  teacher: Teacher.nullable(),
  assistants: z.array(Teacher).nullable(),
  class_room: Classroom.nullable(),
  academic_year: Year.nullable(),
  teaching_unit: TeachingUnit.nullable(),
  period: Period.nullable(),
  available_course: Course,
  faculty: Faculty,
  departements: z.array(Department),
  credit_count: z.number().nullable(),
  theoretical_hours: z.number().nullable(),
  practical_hours: z.number().nullable(),
  max_value: z.number().nullable(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  status: z.enum(["pending", "progress", "finished", "suspended"]).nullable(),
});

export type TaughtCourse = z.infer<typeof TaughtCourse>;

/**
 * Represents a record of teaching hours tracked for a specific course and activity type.
 * Used for validation and reporting of teaching activities.
 * @typedef {object} HourTracking
 * @property {number} id - Unique identifier for the hour tracking entry.
 * @property {TaughtCourse} course - The course associated with the tracked hours.
 * @property {Date} date - The date when the hours were tracked.
 * @property {string} start_time - The start time of the tracked session (HH:mm format).
 * @property {string} end_time - The end time of the tracked session (HH:mm format).
 * @property {number} hours_completed - The total number of hours completed in this session.
 * @property {"lecture" | "tutorial" | "practical" | "practical_tutorial"} activity_type - The type of activity performed (CM, TD, TP, or TPD).
 * @property {string | null} lesson - The lesson associated with the tracked hours, or null if not applicable.
 * @property {boolean} cp_validation - Indicates whether the pedagogical coordinator has validated the entry.
 * @property {boolean} teacher_validation - Indicates whether the teacher has validated the entry.
 */
export const HourTracking = z.object({
  id: z.number(),
  course: TaughtCourse,
  date: z.date(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  hours_completed: z.number(),
  activity_type: z.enum([
    "lecture", //Cours Magistral (CM)
    "tutorial", //Travaux Dirigés (TD)
    "practical", //Travaux Pratiques (TP)
    "practical_tutorial", //Travaux Pratiques et Dirigés (TPD)
  ]),
  lesson: z.string().nullable(),
  cp_validation: z.boolean(),
  teacher_validation: z.boolean(),
});

export type HourTracking = z.infer<typeof HourTracking>;

/**
 * Represents an attendance list for a specific course session.
 *
 * @decorator
 * @typedef AttendanceList
 *
 * @property {number} id - Unique identifier for the attendance list.
 * @property {TaughtCourse} course - The course associated with this attendance list.
 * @property {User} verified_by - The user who verified the attendance.
 * @property {AttendanceListItem[]} student_attendance_status - Array of attendance status items for each student.
 * @property {Date} date - The date of the attendance session.
 * @property {string} time - The time of the attendance session in string format.
 */
export const AttendanceList = z.object({
  id: z.number(),
  course: TaughtCourse,
  verified_by: User,
  student_attendance_status: z.array(AttendanceListItem),
  date: z.date(),
  time: z.string().time(),
});

export type AttendanceList = z.infer<typeof AttendanceList>;

/**
 * Represents an item in the attendance list for a student.
 *
 * @remarks
 * This type is used to track the attendance status of a student for a specific period.
 *
 * @property {number} id - Unique identifier for the attendance record.
 * @property {PeriodEnrollment} student - The enrolled student for the period.
 * @property {"present" | "absent" | "justified"} status - The attendance status, which can be "present", "absent", or "justified".
 * @property {string | null} note - An optional note associated with the attendance record; can be null.
 * @decorator z.object
 */
export const AttendanceListItem = z.object({
  id: z.number(),
  student: PeriodEnrollment,
  status: z.enum(["present", "absent", "justified"]),
  note: z.string().nullable(),
});

export type AttendanceListItem = z.infer<typeof AttendanceListItem>;

/**
 * Represents the enrollment of a student in a specific course during a given period.
 *
 * @decorator z.object
 * @property {number} id - Unique identifier for the course enrollment.
 * @property {PeriodEnrollment} student - The student's enrollment information for the period.
 * @property {Date} date - The date when the enrollment was created.
 * @property {TaughtCourse} course - The course in which the student is enrolled.
 * @property {"pending" | "validated" | "rejected" | null} status - The current status of the enrollment; can be pending, validated, rejected, or null.
 */
export const CourseEnrollment = z.object({
  id: z.number(),
  student: PeriodEnrollment,
  date: z.date(),
  course: TaughtCourse,
  status: z.enum(["pending", "validated", "rejected"]).nullable(),
});

export type CourseEnrollment = z.infer<typeof CourseEnrollment>;

export const DepartmentProgram = z.object({
  id: z.number(),
  departement: Department,
  courses_of_program: z.array(CourseProgram),
  name: z.string(),
  credit_count: z.number().nullable(),
  duration: z.number().nullable(),
  description: z.string().nullable(),
});

export type DepartmentProgram = z.infer<typeof DepartmentProgram>;

export const CourseProgram = z.object({
  id: z.number(),
  theoretical_hours: z.number().nullable(),
  practical_hours: z.number().nullable(),
  credit_count: z.number().nullable(),
  max_value: z.number().nullable(),
  available_course: Course.nullable(),
});

export type CourseProgram = z.infer<typeof CourseProgram>;

export const Enrollment = z.object({
  id: z.number(),
  user: User,
  academic_year: Year,
  cycle: Cycle,
  faculty: Faculty,
  field: Field,
  departement: Department,
  class_year: Class,
  common_enrollment_infos: StudentInfo,
  type_of_enrollment: z.enum(["new_application", "reapplication"]).nullable(),
  enrollment_fees: z.enum(["paid", "unpaid"]).nullable(),
  status: z.enum(["enabled", "disabled"]).nullable(),
  date_of_enrollment: z.date(),
});

export type Enrollment = z.infer<typeof Enrollment>;

export const PeriodEnrollment = z.object({
  id: z.number(),
  year_enrollment: Enrollment,
  period: Period,
  date_of_enrollment: z.string().date(),
  status: z.enum(["validated", "pending", "rejected"]),
});

export type PeriodEnrollment = z.infer<typeof PeriodEnrollment>;

export const House = z.object({
  id: z.number(),
  name: z.string(),
});

export type House = z.infer<typeof House>;

export const StudentPreviousStudy = z.object({
  id: z.number(),
  academic_year: z.string(),
  institution: z.string(),
  study_year_and_faculty: z.string(),
  result: z.number(),
});

export type StudentPreviousStudy = z.infer<typeof StudentPreviousStudy>;

export const EnrollmentQA = z.object({
  id: z.number(),
  registered_enrollment_question: EnrollmentQuestion.nullable(),
  response: z.string(),
});

export type EnrollmentQA = z.infer<typeof EnrollmentQA>;

export const EnrollmentQuestion = z.object({
  id: z.number(),
  question: z.string(),
  enabled: z.boolean(),
});

export type EnrollmentQuestion = z.infer<typeof EnrollmentQuestion>;

export const TestCourse = z.object({
  id: z.number(),
  faculty: Faculty,
  name: z.string(),
  max_value: z.number(),
  description: z.string(),
  enabled: z.boolean(),
});

export type TestCourse = z.infer<typeof TestCourse>;

export const TestResult = z.object({
  id: z.number(),
  course_test: TestCourse,
  result: z.number().nullable(),
});

export type TestResult = z.infer<typeof TestResult>;

export const StudentInfo = z.object({
  id: z.number(),
  previous_university_studies: z.array(StudentPreviousStudy),
  enrollment_question_response: z.array(EnrollmentQA),
  admission_test_result: z.array(TestResult),
  name: z.string(),
  gender: z.enum(["M", "F"]),
  place_of_birth: z.string(),
  date_of_birth: z.string().date(),
  nationality: z.string(),
  marital_status: z
    .enum(["single", "married", "divorced", "widowed"])
    .nullable(),
  religious_affiliation: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  name_of_secondary_school: z.string(),
  country_of_secondary_school: z.string(),
  province_of_secondary_school: z.string(),
  territory_or_municipality_of_school: z.string(),
  section_followed: z.string(),
  father_name: z.string(),
  father_phone_number: z.string().nullable(),
  mother_name: z.string(),
  mother_phone_number: z.string().nullable(),
  current_city: z.string(),
  current_municipality: z.string(),
  current_neighborhood: z.string(),
  country_of_origin: z.string(),
  province_of_origin: z.string(),
  territory_or_municipality_of_origin: z.string(),
  physical_ability: z.enum(["normal" | "disabled"]).nullable(),
  professional_activity: z.string(),
  spoken_language: z.string(),
  year_of_diploma_obtained: z.string(),
  diploma_number: z.string(),
  diploma_percentage: z.number(),
  is_foreign_registration: z.boolean().nullable(),
  former_matricule: z.string().nullable(),
  house: House.nullable(),
  application_documents: z.array(ApplicationDocument),
});

export type StudentInfo = z.infer<typeof StudentInfo>;

export const PrematureEnd = {
  id: number(),
  student: Enrollment,
  reason: z.string(),
};

export type PrematureEnd = z.infer<typeof PrematureEnd>;

export const Application = Enrollment.merge(StudentInfo).extend({
  surname: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "validated", "reoriented", "rejected"]).nullable(),
  avatar: z.string().nullable(),
  is_former_student: z.boolean(),
  date_of_submission: z.string().date(),
});

export type Application = z.infer<typeof Application>;

export type ApplicationFormDataType = Omit<
  Application,
  | "id"
  | "academic_year"
  | "cycle"
  | "faculty"
  | "field"
  | "departement"
  | "class_year"
  | "previous_university_studies"
  | "enrollment_question_response"
  | "admission_test_result"
  | "name"
  | "house"
  | "user"
  | "common_enrollment_infos"
  | "date_of_submission"
  | "spoken_language"
  | "application_documents"
  | "date_of_enrollment"
> & {
  year_id: number;
  cycle_id: number;
  faculty_id: number;
  field_id: number;
  department_id: number;
  class_id: number;
  spoken_languages: { language: string }[];
  student_previous_studies: Omit<StudentPreviousStudy, "id">[];
  enrollment_q_a: Omit<EnrollmentQA, "id" | "registered_enrollment_question">[];
  test_result: Omit<TestResult, "id">[];
  application_documents: Omit<
    ApplicationDocument,
    "id" | "required_document"
  >[];
};

const Step1ApplicationFormDataType = z.object({
  first_name: z.string(),
  last_name: z.string(),
  surname: z.string(),
  gender: z.enum(["M", "F"]),
  place_of_birth: z.string(),
  date_of_birth: z.string(),
  nationality: z.string(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  religious_affiliation: z.string(),
  physical_ability: z.enum(["normal", "disabled"]),
  spoken_languages: z.array(z.object({ language: z.string() })),
  email: z.string().email(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
});

export type Step1ApplicationFormDataType = z.infer<
  typeof Step1ApplicationFormDataType
>;

const Step2ApplicationFormDataType = z.object({
  father_name: z.string(),
  mother_name: z.string(),
  father_phone_number: z.string().optional(),
  mother_phone_number: z.string().optional(),
});

export type Step2ApplicationFormDataType = z.infer<
  typeof Step2ApplicationFormDataType
>;

const Step3ApplicationFormDataType = z.object({
  country_of_origin: z.string(),
  province_of_origin: z.string(),
  territory_or_municipality_of_origin: z.string(),
  is_foreign_registration: z.boolean(),
});

export type Step3ApplicationFormDataType = z.infer<
  typeof Step3ApplicationFormDataType
>;

const Step4ApplicationFormDataType = z.object({
  current_city: z.string(),
  current_municipality: z.string(),
  current_neighborhood: z.string(),
});

export type Step4ApplicationFormDataType = z.infer<
  typeof Step4ApplicationFormDataType
>;

const Step5ApplicationFormDataType = z.object({
  name_of_secondary_school: z.string().nonempty(),
  country_of_secondary_school: z.string().nonempty(),
  province_of_secondary_school: z.string().nonempty(),
  territory_or_municipality_of_school: z.string(),
  section_followed: z.string(),
  year_of_diploma_obtained: z.string(),
  diploma_number: z.string(),
  diploma_percentage: z.number().min(0).max(100),
});

export type Step5ApplicationFormDataType = z.infer<
  typeof Step5ApplicationFormDataType
>;

const Step6ApplicationFormDataType = z.object({
  professional_activity: z.string(),
  previous_university_studies: z.array(StudentPreviousStudy.omit({ id: true })),
});

export type Step6ApplicationFormDataType = z.infer<
  typeof Step6ApplicationFormDataType
>;

const Step7ApplicationFormDataType = z.object({
  year_id: z.number(),
  cycle_id: z.number(),
  field_id: z.number(),
  faculty_id: z.number(),
  department_id: z.number(),
  class_id: z.number(),
});

export type Step7ApplicationFormDataType = z.infer<
  typeof Step7ApplicationFormDataType
>;

const Step8ApplicationFormDataType = z.object({
  enrollment_q_a: z.array(
    EnrollmentQA.omit({
      id: true,
      registered_enrollment_question: true,
    }).merge(z.object({ registered_enrollment_question: z.number() }))
  ),
});

export type Step8ApplicationFormDataType = z.infer<
  typeof Step8ApplicationFormDataType
>;

const Step9ApplicationFormDataType = z.object({
  application_documents: z.array(
    ApplicationDocument.omit({ id: true, required_document: true }).merge(
      z.object({ required_document: z.number() })
    )
  ),
});

export type Step9ApplicationFormDataType = z.infer<
  typeof Step9ApplicationFormDataType
>;

export type ApplicationEditFormDataType = Omit<
  Application,
  | "id"
  | "academic_year"
  | "cycle"
  | "faculty"
  | "field"
  | "departement"
  | "class_year"
  | "spoken_language"
  | "application_documents"
  | "enrollment_question_response"
> & {
  year_id: number;
  cycle_id: number;
  faculty_id: number;
  field_id: number;
  department_id: number;
  class_id: number;
  spoken_languages: { language: string }[];
  application_documents: Array<
    Omit<ApplicationDocument, "required_document"> & {
      required_document: number | null;
    }
  >;
  enrollment_question_response: Array<
    Omit<EnrollmentQA, "registered_enrollment_question"> & {
      registered_enrollment_question: number | null;
    }
  >;
};

export const ApplicationDocument = z.object({
  id: z.number(),
  exist: z.boolean(),
  status: z.enum(["pending", "rejected", "validated"]),
  file_url: z.string().nullable(),
  required_document: RequiredDocument.nullable(),
});

export type ApplicationDocument = z.infer<typeof ApplicationDocument>;

export const RequiredDocument = z.object({
  id: z.number(),
  title: z.string(),
  enabled: z.boolean(),
  required: z.boolean(),
});

export type RequiredDocument = z.infer<typeof RequiredDocument>;

export const Teacher = z.object({
  id: z.number(),
  user: User,
  gender: z.enum(["M", "F"]),
  institution_of_origin: z.string(),
  academic_title: z.string(),
  academic_grade: z.string(),
  other_responsabilities: z.string().nullable(),
  nationality: z.string(),
  place_of_birth: z.string().nullable(),
  date_of_birth: z.string().date().nullable(),
  address: z.string(),
  city_or_territory: z.string(),
  physical_ability: z.enum(["normal" | "disabled"]).nullable(),
  religious_affiliation: z.string().nullable(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  field_of_study: z.string(),
  education_level: z.string(),
  is_foreign_country_teacher: z.boolean().nullable(),
});

export type Teacher = z.infer<typeof Teacher>;

export const Step1TeacherFormDataType = z.object({
  first_name: z.string(),
  last_name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  gender: z.enum(["M", "F"]),
  city_or_territory: z.string(),
  place_of_birth: z.string(),
  date_of_birth: z.string().date(),
  address: z.string(),
  is_foreign_country_teacher: z.boolean().nullable(),
  religious_affiliation: z.string(),
  nationality: z.string(),
  phone_number_1: z.string(),
  phone_number_2: z.string().nullable(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"]),
  physical_ability: z.enum(["normal", "disabled"]),
});

export type Step1TeacherFormDataType = z.infer<typeof Step1TeacherFormDataType>;

export const Step2TeacherFormDataType = z.object({
  field_of_study: z.string(),
  academic_title: z.string(),
  academic_grade: z.string(),
  education_level: z.string(),
  other_responsabilities: z.string(),
});

export type Step2TeacherFormDataType = z.infer<typeof Step2TeacherFormDataType>;

export const Jury = z.object({
  id: z.number(),
  academic_year: Year,
  faculties: z.array(Faculty),
  chairperson: Teacher,
  secretary: Teacher,
  members: z.array(Teacher),
  name: z.string(),
});

export type Jury = z.infer<typeof Jury>;

export const LetterGrading = z.object({
  id: z.number(),
  grade_letter: z.string(),
  lower_bound: z.number(),
  upper_bound: z.number(),
  appreciation: z.string(),
  description: z.string(),
});

export type LetterGrading = z.infer<typeof LetterGrading>;

export const GradeClass = z.object({
  id: z.number(),
  student: PeriodEnrollment,
  jury: Jury,
  course: TaughtCourse,
  continuous_assessment: z.number().nullable(),
  exam: z.number().nullable(),
  total: z.number(),
  grade_letter: LetterGrading,
  earned_credits: z.number(),
  validation: z.enum(["validated", "no_validated"]),
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  status: z.enum(["validated", "pending"]),
  is_retaken: z.boolean(),
});

export type GradeClass = z.infer<typeof GradeClass>;

export type NewGradeClass = Omit<
  GradeClass,
  | "id"
  | "status"
  | "is_retaken"
  | "moment"
  | "session"
  | "validation"
  | "earned_credits"
  | "grade_letter"
  | "total"
  | "course"
  | "jury"
  | "continuous_assessment"
  | "exam"
  | "student"
> & {
  id?: number;
  status?: "validated" | "pending";
  is_retaken?: boolean;
  moment?: "before_appeal" | "after_appeal";
  session?: "main_session" | "retake_session";
  validation?: "validated" | "no_validated";
  earned_credits?: number;
  grade_letter?: LetterGrading;
  total?: number;
  course?: TaughtCourse;
  jury?: Jury;
  continuous_assessment?: number | null;
  exam?: number | null;
  student?: PeriodEnrollment;
};

export const TeachingUnitGrades = z.object({
  id: z.number(),
  jury: Jury,
  student: PeriodEnrollment,
  teaching_unit: TeachingUnit,
  course_grades_list: z.array(GradeClass),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_courses_sum: z.number(),
  unvalidated_courses_sum: z.number(),
  validation_status: z.enum(["validated", "no_validated"]),
});

export type TeachingUnitGrades = z.infer<typeof TeachingUnitGrades>;

export const PeriodGrades = z.object({
  id: z.number(),
  jury: Jury,
  student: PeriodEnrollment,
  period: Period,
  teaching_unit_grades_list: z.array(TeachingUnitGrades),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_TU_sum: z.number(),
  unvalidated_TU_sum: z.number(),
  period_decision: z.enum(["passed", "postponed"]),
});

export type PeriodGrades = z.infer<typeof PeriodGrades>;

export const YearGrades = z.object({
  id: z.number(),
  student: Enrollment,
  jury: Jury,
  period_grade_list: z.array(PeriodGrades),
  credit_sum: z.number(),
  validated_credit_sum: z.number(),
  unvalidated_credit_sum: z.number(),
  weighted_average: z.number(),
  percentage: z.number(),
  grade_letter: LetterGrading,
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  validated_TU_sum: z.number(),
  unvalidated_TU_sum: z.number(),
  final_decision: z.enum(["passed", "postponed"]),
});

export type YearGrades = z.infer<typeof YearGrades>;

export const Announcement = z.object({
  id: z.number(),
  academic_year: Year,
  period: Period,
  faculty: Faculty,
  departement: Department,
  class_year: Class,
  total_students: z.number(),
  graduated_students: z.number(),
  non_graduated_students: z.number(),
  moment: z.enum(["before_appeal", "after_appeal"]),
  session: z.enum(["main_session", "retake_session"]),
  date_created: z.string(),
  date_updated: z.string(),
  status: z.enum(["locked", "unlocked"]),
  mode:z.enum(["ALL-STUDENTS", "SOME-STUDENTS"])
});

export type Announcement = z.infer<typeof Announcement>;


export const RetakeCourseReason = z.object({
  id: z.number(),
  reason: z.enum(["low_attendance", "missing_course", "failed_course"]),
  academic_year: Year,
  available_course: Course,
  class_year: Class,
});

export type RetakeCourseReason = z.infer<typeof RetakeCourseReason>;

export const RetakeCourse = z.object({
  id: z.number(),
  user: User,
  retake_course_list: z.array(RetakeCourseReason),
  retake_course_done_list: z.array(RetakeCourseReason),
  faculty: Faculty,
  departement: Department,
});

export type RetakeCourse = z.infer<typeof RetakeCourse>;

export const ResultGrid = z.object({
  HeaderData: z.object({
    no_retaken: z.object({
      course_list: z.array(z.array(TaughtCourse)),
      credits: z.array(z.array(z.number())),
      period_list: z.array(
        z.object({
          course_counter: z.number(),
          period: Period,
          teaching_unit_counter: z.number(),
        })
      ),
      teaching_unit_list: z.array(
        z.array(
          z.object({
            course_counter: z.number(),
            course_id_list: z.array(z.number()),
            teaching_unit: TeachingUnit,
          })
        )
      ),
    }),
    retaken: z.object({
      course_list: z.array(TaughtCourse),
      credits: z.array(number),
      header: z.array(
        z.object({
          course_counter: z.number(),
          retake_title: z.string(),
          teaching_unit_counter: z.number(),
        })
      ),
      teaching_unit_list: z.array(
        z.object({
          course_counter: z.number(),
          course_id_list: z.array(number),
          teaching_unit: TeachingUnit,
        })
      ),
    }),
  }),
  BodyDataList: z.array(
    z.object({
      credit_sum: z.number(),
      decision: z.enum(["passed", "postponed"]),
      first_name: z.string(),
      gender: z.enum(["M", "F"]),
      grade_letter: z.string(),
      id: z.number(),
      last_name: z.string(),
      matricule: z.string(),
      year_enrollment_id: z.number(),
      user_id: z.number(),
      percentage: z.number(),
      surname: z.string(),
      unvalidated_TU_count: z.number(),
      unvalidated_credit_sum: z.number(),
      validated_TU_count: z.number(),
      validated_courses_count: z.number(),
      unvalidated_courses_count: z.number(),
      validated_credit_sum: z.number(),
      weighted_average: z.number(),
      no_retaken: z.object({
        continuous_assessments: z.array(z.array(z.number())),
        course_decisions: z.array(
          z.array(z.enum(["validated", "no_validated"]))
        ),
        earned_credits: z.array(z.array(z.number())),
        exams: z.array(z.array(z.number())),
        grade_letters: z.array(z.array(z.string())),
        teaching_unit_decisions: z.array(
          z.array(
            z.object({
              cols_counter: z.number(),
              name: z.string(),
              value: z.enum(["validated", "no_validated"]),
            })
          )
        ),
        teaching_units: z.array(z.array(z.number())),
        totals: z.array(z.array(z.number())),
      }),
      retaken: z.object({
        continuous_assessments: z.array(z.number()),
        course_decisions: z.array(z.enum(["validated", "no_validated"])),
        earned_credits: z.array(z.number()),
        exams: z.array(z.number()),
        grade_letters: z.array(string),
        teaching_unit_decisions: z.array(
          z.object({
            cols_counter: z.number(),
            name: z.string(),
            value: z.enum(["validated", "no_validated"]),
          })
        ),
        teaching_units: z.array(z.number()),
        totals: z.array(z.number()),
      }),
    })
  ),
});

export type ResultGrid = z.infer<typeof ResultGrid>;


export const Appeal = z.object({
  id: z.number(),
  student: Enrollment,
  jury: Jury,
  subject: z.string(),
  description: z.string(),
  submission_date: z.string(),
  courses: z.array(TaughtCourse),
  status: z.enum([
    "submitted",
    "in_progress",
    "processed",
    "rejected",
    "archived",
  ]),
  response: z.string().nullable(),
  file: z.string().nullable(),
  session: z.enum(["main_session", "retake_session"]),
});

export type Appeal = z.infer<typeof Appeal>;


export type PeriodResultPresentionItem={
    decision: "passed" | "postponed";
    expected_total_credit: number;
    first_name: string;
    gender: "M" | "F";
    grade: string;
    id: number;
    id_user_obj: number;
    last_name: string;
    matricule: string;
    percentage: number;
    surname: string;
    unvalidated_credit_sum: number;
    validated_credit_sum: number;
    weighted_average: number;
  }

export type YearResultPresentationItem = {
  decision: "passed" | "postponed";
  expected_total_credit: number;
  first_name: string;
  gender: "M" | "F";
  grade: string;
  id: number;
  id_user_obj: number;
  last_name: string;
  matricule: string;
  percentage: number;
  period_0_acronym: string;
  period_0_total_credit: number;
  period_0_validated_credit_sum: number;
  period_0_weighted_average: number;
  period_1_acronym: string;
  period_1_total_credit: number;
  period_1_validated_credit_sum: number;
  period_1_weighted_average: number;
  period_2_acronym: string;
  period_2_total_credit: number;
  period_2_validated_credit_sum: number;
  period_2_weighted_average: number;
  surname: string;
  validated_credit_total: number;
  weighted_average: number;
};

const DeliberationMinutesDataBodyItem = z.object({
  title: z.string(),
  student_list: z.array(
    z.object({
      decision: z.enum(["passed", "postponed"]),
      first_name: z.string(),
      gender: z.enum(["M", "F"]),
      grade: z.string(),
      id: z.number(),
      last_name: z.string(),
      matricule: z.string(),
      percentage: z.number(),
      surname: z.string(),
      weighted_average: z.number(),
    })
  ),
});

export const DeliberationMinutesData = z.object({
  body: z.object({
    A: DeliberationMinutesDataBodyItem,
    B: DeliberationMinutesDataBodyItem,
    C: DeliberationMinutesDataBodyItem,
    D: DeliberationMinutesDataBodyItem,
    E: DeliberationMinutesDataBodyItem,
    F: DeliberationMinutesDataBodyItem,
    G: DeliberationMinutesDataBodyItem,
  }),
  general_statistics: z.object({
    female_count: z.number(),
    male_count: z.number(),
    passed_count: z.number(),
    postponed_count: z.number(),
    total_class_announced: z.number(),
    total_class_enrolled: z.number(),
  }),
  grade_statistics: z.object({
    A: z.object({ count: z.number(), percentage: z.number() }),
    B: z.object({ count: z.number(), percentage: z.number() }),
    C: z.object({ count: z.number(), percentage: z.number() }),
    D: z.object({ count: z.number(), percentage: z.number() }),
    E: z.object({ count: z.number(), percentage: z.number() }),
    F: z.object({ count: z.number(), percentage: z.number() }),
    G: z.object({ count: z.number(), percentage: z.number() }),
  }),
});
export type DeliberationMinutesData = z.infer<typeof DeliberationMinutesData>;
