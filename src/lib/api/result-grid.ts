import { ResultGrid, RetakeCourse } from "@/types";
import api from "../fetcher";
import ExcelJS from "exceljs";
import { getShortGradeValidationText } from "./grade-class";

export async function getResultGrid(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId: number;
  classId: number;
  periodId?: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
}) {
  const {
    yearId,
    facultyId,
    departmentId,
    classId,
    periodId,
    moment,
    session,
    mode
  } = searchParams;
  const queryParams = new URLSearchParams();

  queryParams.append("academic_year__id", yearId.toString());

  queryParams.append("faculty__id", facultyId.toString());
  queryParams.append("departement__id", departmentId.toString());
  queryParams.append("class_year__id", classId.toString());
  if (periodId !== undefined) {
    queryParams.append("period__id", periodId.toString());
  }
  queryParams.append("session", session.toString());
  queryParams.append("moment", moment.toString());
  queryParams.append("mode", mode.toString());

  const res = await api.get(
    `/jury/student-results-grid?${queryParams.toString()}`
  );

  return res.data as ResultGrid;
}

export async function postCompensation(data: {
  grade_to_withdraw: number;
  student_id: number; // yearEnrollmentId
  courseId_to_withdraw_in: number; //TaughtCourseId
  courseId_to_add_in: number; //TaughtCourseId
  moment: string;
  session: string;
}) {
  const res = await api.post(`/jury/compensation/`, {
    grade_to_withdraw: data.grade_to_withdraw,
    student_id: data.student_id,
    courseId_to_withdraw_in: data.courseId_to_withdraw_in,
    courseId_to_add_in: data.courseId_to_add_in,
    moment: data.moment,
    session: data.session,
  });
  return res.data;
}

export function getDecisionText(decision: "passed" | "postponed") {
  if (decision === "passed") {
    return "Admis (e)";
  } else if (decision === "postponed") {
    return "Ajourné (e)";
  }
  return "";
}

export async function deleteGradeFromGrid(periodEnrollmentId: number) {
  const res = await api.delete(`/jury/period-grades/${periodEnrollmentId}/`);
  return res.data;
}

export async function getPostponeReasons(queryParams: {
  yearGradeId?: number;
  periodGradeId?: number;
  userId: number;
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
}) {
  const { yearGradeId, periodGradeId, userId, mode } = queryParams;
  const query = new URLSearchParams();
  if (yearGradeId !== undefined) {
    query.append("year_grade__id", yearGradeId.toString());
  }
  if (periodGradeId !== undefined) {
    query.append("period_grade__id", periodGradeId.toString());
  }
  query.append("user__id", userId.toString());
  query.append("mode", mode);
  const res = await api.get(`/jury/postpone-reason/?${query.toString()}`);

  return res.data as {
    retake_course_obj?: RetakeCourse;
    reason: string;
    missing_course_list?: { id: number; name: string }[];
  }[];
}

/**
 * Exporte les données ResultGrid dans un fichier Excel (.xlsx)
 * @param data Les données du tableau de type ResultGrid
 * @param filename Le nom du fichier à télécharger (optionnel)
 */
// export async function exportGridToExcel(
//   data: ResultGrid,
//   options: { sheetName: string; fileName: string } = {
//     fileName: "resultats.xlsx",
//     sheetName: "Résultats",
//   }
// ) {
//   const workbook = new ExcelJS.Workbook();
//   const ws = workbook.addWorksheet(options.sheetName);

//   // Colonnes dynamiques
//   const courses = data.HeaderData.no_retaken.course_list;
//   const credits = data.HeaderData.no_retaken.credits;
//   const nbCourses = courses.length;
//   const colOffset = 4; // Index, Nom, Matricule, Genre
//   const colAfterCourses = colOffset + nbCourses;

//   // Colonnes fixes après les cours
//   const afterCoursesTitles = [
//     { title: "Total Crédits", key: "total_credits" },
//     { title: "Pourcentage", key: "pourcentage" },
//     { title: "Grade", key: "grade" },
//     { title: "Total des EC et Crédits Validés et Non Validés", key: "VNV" }, // Fusionné au-dessus de V/NV
//     { title: "Décision", key: "decision" },
//   ];

//   // --- Construction du header ---
//   // Ligne 1: Période (fusionné uniquement sur les cours)
//   ws.mergeCells(1, 1, 1, colOffset); // 4 premières colonnes vides
//   ws.getCell(1, 1).value = "";
//   ws.mergeCells(1, colOffset + 1, 1, colOffset + nbCourses);
//   ws.getCell(1, colOffset + 1).value = data.HeaderData.no_retaken.period_list[0]?.period.name || "";
//   ws.getCell(1, colOffset + 1).alignment = { horizontal: "center", vertical: "middle" };

//   // Après les cours: chaque colonne a son propre titre sauf "VNV" fusionné sur 2 colonnes
//   let afterCol = colAfterCourses + 1;
//   ws.getCell(1, afterCol).value = afterCoursesTitles[0].title; // Total Crédits
//   ws.mergeCells(1, afterCol + 1, 3, afterCol + 1); // Pourcentage (vertical sur 3 lignes)
//   ws.getCell(1, afterCol + 1).value = afterCoursesTitles[1].title;
//   ws.getCell(1, afterCol + 1).alignment = { textRotation: 90, vertical: "middle", horizontal: "center" };
//   ws.mergeCells(1, afterCol + 2, 3, afterCol + 2); // Grade (vertical sur 3 lignes)
//   ws.getCell(1, afterCol + 2).value = afterCoursesTitles[2].title;
//   ws.getCell(1, afterCol + 2).alignment = { textRotation: 90, vertical: "middle", horizontal: "center" };
//   ws.mergeCells(1, afterCol + 3, 1, afterCol + 4); // V+NV
//   ws.getCell(1, afterCol + 3).value = afterCoursesTitles[3].title;
//   ws.getCell(1, afterCol + 3).alignment = { horizontal: "center", vertical: "middle" };
//   ws.mergeCells(1, afterCol + 5, 3, afterCol + 5); // Décision (vertical sur 3 lignes)
//   ws.getCell(1, afterCol + 5).value = afterCoursesTitles[4].title;
//   ws.getCell(1, afterCol + 5).alignment = { textRotation: 90, vertical: "middle", horizontal: "center" };

//   // Ligne 2: Unités d'enseignement (UE)
//   ws.mergeCells(2, 1, 2, colOffset);
//   ws.getCell(2, 1).value = "Unités d'Enseignement";
//   let tuCol = colOffset + 1;
//   data.HeaderData.no_retaken.teaching_unit_list.forEach((TU) => {
//     ws.mergeCells(2, tuCol, 2, tuCol + TU.course_counter - 1);
//     ws.getCell(2, tuCol).value = TU.teaching_unit.code;
//     ws.getCell(2, tuCol).alignment = { horizontal: "center", vertical: "middle" };
//     tuCol += TU.course_counter;
//   });
//   // Après les cours: Total Crédits + V + NV
//   ws.mergeCells(2, afterCol, 4, afterCol); // Total Crédits (vertical fusion sur 3 lignes)
//   ws.getCell(2, afterCol).value = ""; // déjà rempli
//   ws.getCell(2, afterCol).alignment = { textRotation: 90 };
//   ws.getCell(2, afterCol + 1).value = ""; // déja rempli (Pourcentage)
//   ws.getCell(2, afterCol + 2).value = ""; // déjà rempli (Grade)
//   ws.getCell(2, afterCol + 3).value = "V";
//   ws.getCell(2, afterCol + 4).value = "NV";
//   ws.getCell(2, afterCol + 3).alignment = { horizontal: "center" };
//   ws.getCell(2, afterCol + 4).alignment = { horizontal: "center" };
//   ws.getCell(2, afterCol + 5).value = ""; // déjà rempli (Décision)

//   // Ligne 3: EC (cours)
//   ws.mergeCells(3, 1, 3, colOffset);
//   ws.getCell(3, 1).value = "Éléments Constitutifs";
//   for (let i = 0; i < nbCourses; i++) {
//     ws.getCell(3, colOffset + 1 + i).value = courses[i].available_course.name;
//     ws.getCell(3, colOffset + 1 + i).alignment = { textRotation: 90, horizontal: "center", vertical: "middle" };
//   }
//   // Après les cours: numéros
//   ws.getCell(3, afterCol).value = ""; // déjà fusionné
//   ws.getCell(3, afterCol + 1).value = ""; // déjà fusionné
//   ws.getCell(3, afterCol + 2).value = ""; // déjà fusionné
//   ws.getCell(3, afterCol + 3).value = ""; // V
//   ws.getCell(3, afterCol + 4).value = ""; // NV
//   ws.getCell(3, afterCol + 5).value = ""; // déjà fusionné

//   // Ligne 4: Numérotation EC
//   ws.mergeCells(4, 1, 4, colOffset);
//   ws.getCell(4, 1).value = "";
//   for (let i = 0; i < nbCourses; i++) {
//     ws.getCell(4, colOffset + 1 + i).value = (i + 1).toString();
//     ws.getCell(4, colOffset + 1 + i).alignment = { horizontal: "center" };
//   }
//   ws.getCell(4, afterCol).value = ""; // déjà fusionné

//   // Ligne 5: Crédits
//   ws.mergeCells(5, 1, 5, colOffset);
//   ws.getCell(5, 1).value = "Crédits";
//   for (let i = 0; i < credits.length; i++) {
//     ws.getCell(5, colOffset + 1 + i).value = credits[i];
//     ws.getCell(5, colOffset + 1 + i).alignment = { horizontal: "center" };
//   }
//   ws.getCell(5, afterCol).value = credits.reduce((a, b) => a + b, 0);

//   // Ligne 6: CC
//   ws.mergeCells(6, 1, 6, colOffset);
//   ws.getCell(6, 1).value = "CC";
//   for (let i = 0; i < nbCourses; i++) {
//     ws.getCell(6, colOffset + 1 + i).value = 10;
//     ws.getCell(6, colOffset + 1 + i).alignment = { horizontal: "center" };
//   }

//   // Ligne 7: Examen
//   ws.mergeCells(7, 1, 7, colOffset);
//   ws.getCell(7, 1).value = "Examen";
//   for (let i = 0; i < nbCourses; i++) {
//     ws.getCell(7, colOffset + 1 + i).value = 10;
//     ws.getCell(7, colOffset + 1 + i).alignment = { horizontal: "center" };
//   }

//   // Ligne 8: TOTAL
//   ws.mergeCells(8, 1, 8, colOffset);
//   ws.getCell(8, 1).value = "TOTAL";
//   for (let i = 0; i < nbCourses; i++) {
//     ws.getCell(8, colOffset + 1 + i).value = 20;
//     ws.getCell(8, colOffset + 1 + i).alignment = { horizontal: "center" };
//   }
//   ws.getCell(8, afterCol).value = 20;
//   ws.getCell(8, afterCol + 3).value = "V";
//   ws.getCell(8, afterCol + 4).value = "NV";

//   // --- Remplissage du corps ---
//   let startRow = 9;
//   data.BodyDataList.forEach((record, idx) => {
//     // CC
//     let ccRow = ws.getRow(startRow);
//     ccRow.getCell(1).value = "";
//     ccRow.getCell(2).value = "";
//     ccRow.getCell(3).value = "";
//     ccRow.getCell(4).value = "";
//     for (let i = 0; i < nbCourses; i++) {
//       ccRow.getCell(colOffset + 1 + i).value = record.no_retaken.continuous_assessments[i] ?? "";
//     }

//     // Examen
//     let examRow = ws.getRow(startRow + 1);
//     examRow.getCell(1).value = "";
//     examRow.getCell(2).value = "";
//     examRow.getCell(3).value = "";
//     examRow.getCell(4).value = "";
//     for (let i = 0; i < nbCourses; i++) {
//       examRow.getCell(colOffset + 1 + i).value = record.no_retaken.exams[i] ?? "";
//     }

//     // Résultats principaux
//     let mainRow = ws.getRow(startRow + 2);
//     mainRow.getCell(1).value = idx + 1;
//     mainRow.getCell(2).value = `${record.first_name} ${record.last_name} ${record.surname}`;
//     mainRow.getCell(3).value = record.matricule;
//     mainRow.getCell(4).value = record.gender;
//     for (let i = 0; i < nbCourses; i++) {
//       mainRow.getCell(colOffset + 1 + i).value = record.no_retaken.totals[i] ?? "";
//     }
//     let cur = colAfterCourses + 1;
//     mainRow.getCell(cur).value = record.weighted_average;
//     mainRow.getCell(cur + 1).value = record.percentage;
//     mainRow.getCell(cur + 2).value = record.grade_letter;

//     // Grade
//     ws.mergeCells(startRow + 3, 1, startRow + 3, 4);
//     let gradeRow = ws.getRow(startRow + 3);
//     gradeRow.getCell(1).value = "Grade";
//     for (let i = 0; i < nbCourses; i++) {
//       gradeRow.getCell(colOffset + 1 + i).value = record.no_retaken.grade_letters[i] ?? "";
//     }

//     // Validation EC
//     ws.mergeCells(startRow + 4, 1, startRow + 4, 4);
//     let valECRow = ws.getRow(startRow + 4);
//     valECRow.getCell(1).value = "Validation EC";
//     for (let i = 0; i < nbCourses; i++) {
//       valECRow.getCell(colOffset + 1 + i).value = getShortGradeValidationText(record.no_retaken.course_decisions[i] ?? "");
//     }
//     valECRow.getCell(cur + 3).value = record.validated_courses_count;
//     valECRow.getCell(cur + 4).value = record.unvalidated_courses_count;

//     // Crédits validés
//     ws.mergeCells(startRow + 5, 1, startRow + 5, 4);
//     let credRow = ws.getRow(startRow + 5);
//     credRow.getCell(1).value = "Crédits validés";
//     for (let i = 0; i < nbCourses; i++) {
//       credRow.getCell(colOffset + 1 + i).value = record.no_retaken.earned_credits[i] ?? "";
//     }
//     credRow.getCell(cur + 3).value = record.validated_credit_sum;
//     credRow.getCell(cur + 4).value = record.unvalidated_credit_sum;

//     // Validation UE
//     ws.mergeCells(startRow + 6, 1, startRow + 6, 4);
//     let ueRow = ws.getRow(startRow + 6);
//     ueRow.getCell(1).value = "Validation UE";
//     let col = colOffset + 1;
//     record.no_retaken.teaching_unit_decisions.forEach((TU) => {
//       ws.mergeCells(startRow + 6, col, startRow + 6, col + TU.cols_counter - 1);
//       ueRow.getCell(col).value = getShortGradeValidationText(TU.value);
//       col += TU.cols_counter;
//     });
//     ueRow.getCell(cur + 3).value = record.validated_TU_count;
//     ueRow.getCell(cur + 4).value = record.unvalidated_TU_count;
//     ueRow.getCell(cur + 5).value = getDecisionText(record.decision);

//     startRow += 7;
//   });

//   // Largeur des colonnes
//   ws.columns = [
//     { width: 6 },
//     { width: 28 },
//     { width: 14 },
//     { width: 8 },
//     ...Array(nbCourses).fill({ width: 12 }),
//     { width: 12 }, // Total Crédits
//     { width: 12 }, // Pourcentage
//     { width: 10 }, // Grade
//     { width: 8 },  // V
//     { width: 8 },  // NV
//     { width: 12 }, // Décision
//   ];


//   // Enregistre le fichier
//   const buffer = await workbook.xlsx.writeBuffer();
//   // Téléchargement dans le navigateur
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = options.fileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
