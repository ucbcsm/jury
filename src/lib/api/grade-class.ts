import {
  CourseEnrollment,
  GradeClass,
  NewGradeClass,
  TaughtCourse,
} from "@/types";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import api from "../fetcher";

export async function createBulkGradeClasses(data: NewGradeClass[]) {
  const res = await api.post(`/jury/grades-class/`, data);
  return res.data;
}

export async function getGradeByTaughtCourse(
  id: number,
  session: "main_session" | "retake_session",
  moment: "before_appeal" | "after_appeal"
) {
  const res = await api.get(
    `/jury/grades-class?course__id=${id}&session=${session}&moment=${moment}`
  );
  return res.data.results as GradeClass[];
}

export async function updateGradeClass({
  id,
  data,
}: {
  id: number;
  data: GradeClass;
}) {
  const res = await api.put(`/jury/grades-class/${id}/`, {
    ...data,
    student: data.student.id,
    course: data.course.id,
    jury: data.jury.id,
  });
  return res.data;
}

export async function multiUpdateGradeClasses(data: GradeClass[]) {
  const formatedData = data.map((item) => ({
    ...item,
    student: item.student.id,
    course: item.course.id,
    jury: item.jury.id,
  }));
  const res = await api.post(`/jury/grades-class/multi-update/`, formatedData);
  return res.data;
}

export async function deleteGradeClass(id: number) {
  const res = await api.delete(`/jury/grades-class/${id}/`);
  return res.data;
}

export async function deleteMultiGradeClasses(data: GradeClass[]) {
  const gradesToDelete = data.map((item) => ({
    id: item.id,
    student: item.student.id,
    course: item.course.id,
  }));
  const res = await api.post(
    `/jury/grades-class/multi-delete/`,
    gradesToDelete
  );
  return res.data;
}

export function getGradeValidationColor(
  validation: "validated" | "no_validated"
): string {
  switch (validation) {
    case "validated":
      return "success";
    case "no_validated":
      return "error";
    default:
      return "default";
  }
}

export function getGradeValidationText(
  validation: "validated" | "no_validated"
): string {
  switch (validation) {
    case "validated":
      return "Validé";
    case "no_validated":
      return "Non validé";
    default:
      return "Inconnu";
  }
}

export function exportEmptyGradesToCSV(
  enrollments: CourseEnrollment[],
  fileName: string = "empty-grades.csv"
) {
  const fields = [
    { label: "Matricule", value: "matricule" },
    { label: "Noms", value: "student" },
    { label: "C. Continu (/10)", value: "continuous_assessment" },
    { label: "Examen (/10)", value: "exam" },
  ];

  const data: Record<string, string>[] = enrollments.map((enrollment) => ({
    matricule: enrollment.student.year_enrollment.user.matricule,
    student: `${enrollment.student.year_enrollment.user.first_name} ${enrollment.student.year_enrollment.user.first_name} ${enrollment.student.year_enrollment.user.surname}`,
    continuous_assessment: "",
    exam: "",
  }));

  const csv = Papa.unparse(
    {
      fields: fields.map((f) => f.label),
      data: data.map((row) => fields.map((f) => row[f.value])),
    },
    {
      delimiter: ";",
    }
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportEmptyGradesToExcel(
  enrollments: CourseEnrollment[],
  course: TaughtCourse,
  options: { sheetName: string; fileName: string } = {
    fileName: "empty-grades.xlsx",
    sheetName: "Notes",
  }
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(options.sheetName);

  // Ajout des entêtes (headers)
  worksheet.addRow(["Code du cours:", `${course.available_course.code}`]);
  worksheet.addRow(["Intitulé du cours:", `${course.available_course.name}`])
    .collapsed;
  worksheet.addRow([
    "Enseignant:",
    `${course.teacher?.user.first_name} ${course.teacher?.user.last_name} ${course.teacher?.user.surname}`,
  ]).collapsed;
  worksheet.addRow(["Année académique:", `${course.academic_year?.name}`]);
  worksheet.addRow(["Semestre", `${course.period?.acronym}`]).collapsed;

  worksheet.addRow(["Matricule", "Promotion", "Noms", "CC", "Examen"])
    .collapsed;

  // Ajout des données
  enrollments.forEach((enrollment) => {
    worksheet.addRow([
      enrollment.student?.year_enrollment.user.matricule ?? "",
      `${enrollment.student.year_enrollment.class_year.acronym} - ${enrollment.student.year_enrollment.departement.acronym}`,
      `${enrollment.student.year_enrollment.user.first_name} ${enrollment.student.year_enrollment.user.first_name} ${enrollment.student.year_enrollment.user.surname}`,
      "", // Contrôle Continu
      "", // Examen
    ]);
  });

  // Optionnel : mise en forme des entêtes
  worksheet.getRow(6).font = { bold: true };

  // Génération du fichier en mémoire
  const buffer = await workbook.xlsx.writeBuffer();

  // Téléchargement dans le navigateur
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = options.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function importGradesFromExcel(file: File): Promise<
  {
    matricule: string;
    promotion: string;
    noms: string;
    continuous_assessment: number | null;
    exam: number | null;
  }[]
> {
  const workbook = new ExcelJS.Workbook();
  const fileContent = await file.arrayBuffer();
  await workbook.xlsx.load(fileContent);

  const gradesWorksheet = workbook.worksheets[0];

  const HEADER_ROW_INDEX = 6;
  const parsedGrades: {
    matricule: string;
    promotion: string;
    noms: string;
    continuous_assessment: number | null;
    exam: number | null;
  }[] = [];

  gradesWorksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= HEADER_ROW_INDEX) return; // Ignorer les lignes d'en-tête
    const rowValues = Array.isArray(row.values)
      ? row.values.slice(1) // Supprimer la première valeur vide
      : [];

    const [matricule, promotion, noms, continuous_assessment, exam] = rowValues;

    if (matricule && noms) {
      parsedGrades.push({
        matricule: matricule?.toString() ?? "",
        promotion: promotion?.toString() ?? "",
        noms: noms?.toString() ?? "",
        continuous_assessment: Number(continuous_assessment) ?? null,
        exam: Number(exam) ?? null,
      });
    }
  });

  return parsedGrades;
}

export function matchImportedGradesWithEnrollments(
  importedGrades: {
    matricule: string;
    promotion: string;
    noms: string;
    continuous_assessment: number | null;
    exam: number | null;
  }[],
  enrollments: CourseEnrollment[]
) {
  const matchedGrades = importedGrades.map((importedGrade) => {
    const correspondingEnrollment = enrollments.find(
      (enrollment) =>
        enrollment.student.year_enrollment.user.matricule ===
        importedGrade.matricule
    );

    return {
      student: correspondingEnrollment?.student ?? null,
      continuous_assessment: importedGrade.continuous_assessment ?? null,
      exam: importedGrade.exam ?? null,
      total:
        (importedGrade.continuous_assessment ?? 0) + (importedGrade.exam ?? 0),
      course: correspondingEnrollment?.course ?? null,
      is_retaken: false,
      status: "pending",
    } as NewGradeClass;
  });

  return matchedGrades.filter(
    (grade) => grade.student !== null && grade.course !== null
  );
}
