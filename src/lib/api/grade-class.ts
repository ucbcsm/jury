import {
  CourseEnrollment,
  GradeClass,
  NewGradeClass,
  TaughtCourse,
} from "@/types";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import api from "../fetcher";

export async function createBulkGradeClasses({
  courseId,
  juryId,
  moment,
  session,
  gradesClass,
}: {
  courseId: number;
  juryId: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
  gradesClass: NewGradeClass[];
}) {
  const formatedData = gradesClass.map((item) => ({
    student: item.student?.id,
    course: courseId,
    jury: juryId,
    continuous_assessment: item.continuous_assessment ?? 0,
    exam: item.exam ?? 0,
    total:(item.continuous_assessment ?? 0) + (item.exam ?? 0),
    session: session,
    moment: moment,
    is_retaken: item.is_retaken,
    status: item.status,
  }));
  const res = await api.post(`/jury/grades-class/`, formatedData);
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

export function getSessionText(
  session: "main_session" | "retake_session"
): string {
  switch (session) {
    case "main_session":
      return "Principale";
    case "retake_session":
      return "Rattrapage";
    default:
      return "Inconnue";
  }
}

export function getMomentText(
  moment: "before_appeal" | "after_appeal"
): string {
  switch (moment) {
    case "before_appeal":
      return "Avant recours";
    case "after_appeal":
      return "Après recours";
    default:
      return "Moment inconnu";
  }
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


export function getShortGradeValidationText(
  validation: "validated" | "no_validated"
): string {
  switch (validation) {
    case "validated":
      return "V";
    case "no_validated":
      return "NV";
    default:
      return "";
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
  options: { sheetName: string; fileName: string; onAfter?: () => void } = {
    fileName: "empty-grades.xlsx",
    sheetName: "Notes",
  }
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(options.sheetName, {
    headerFooter: { oddFooter: "Page &P / &N" },
  });

  worksheet.addRow(["Fiche de notes"]); // row 1
  worksheet.getRow(1).font = { bold: true, size: 16, name: "Arial" };
  worksheet.addRow([]); // row 2
  worksheet.addRow(["Code du cours:", `${course.available_course.code}`]); // row 3
  worksheet.addRow(["Intitulé du cours:", `${course.available_course.name}`]); // row 4
  worksheet.addRow([
    "Enseignant:",
    `${course.teacher?.user.surname} ${course.teacher?.user.last_name} ${course.teacher?.user.first_name}`,
  ]); // row 5
  worksheet.addRow(["Année académique:", `${course.academic_year?.name}`]); // row 6
  worksheet.addRow(["Semestre:", `${course.period?.acronym}`]); // row 7
  worksheet.addRow([]); // row 8
  worksheet.addRow(["", "", "", "10", "10", "20"]); // row 9
  worksheet.addRow(["MATRICULE", "PROMOTION", "NOMS", "CC", "EXAMEN", "TOTAL"]); // row 10

  const courseInfomationRows = [3, 4, 5, 6, 7];
  courseInfomationRows.forEach((row) => {
    worksheet.getRow(row).font = { size: 12, name: "Arial" };
  });

  // Ajout des données
  enrollments.forEach((enrollment) => {
    worksheet.addRow([
      enrollment.student?.year_enrollment.user.matricule ?? "",
      `${enrollment.student.year_enrollment.class_year.acronym} - ${enrollment.student.year_enrollment.departement.acronym}`,
      `${enrollment.student.year_enrollment.user.surname} ${enrollment.student.year_enrollment.user.last_name} ${enrollment.student.year_enrollment.user.first_name}`,
      "", // Contrôle Continu
      "", // Examen
      "", // Total
    ]);
  });

  worksheet.getRow(9).eachCell((cell, colNumber) => {
    if (colNumber === 4 || colNumber === 5 || colNumber === 6) {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { vertical: "middle", horizontal: "right" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    }
  });

  worksheet.getRow(10).eachCell((cell, colNumber) => {
    cell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
      size: 12,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF008367" },
    };

    if (colNumber === 4 || colNumber === 5 || colNumber === 6) {
      cell.alignment = { vertical: "middle", horizontal: "right" };
    }
  });

  // Fonction pour ajuster automatiquement la largeur des colonnes
  function autoFitColumns(worksheet: ExcelJS.Worksheet) {
    worksheet.columns.forEach((column) => {
      if (!column || !column.eachCell) return; // Sécurité

      let maxWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        // Estimer la largeur en fonction du contenu
        const cellValue = cell.value ? cell.value.toString() : "";
        const cellWidth = estimateCellWidth(cellValue, cell.font);

        if (cellWidth > maxWidth) {
          maxWidth = cellWidth;
        }
      });

      // Appliquer la largeur calculée (+ un petit buffer)
      column.width = Math.min(Math.max(maxWidth + 2, 10), 50); // Limiter entre 10 et 50
    });
  }

  interface ExcelFont {
    size?: number; // Taille de police optionnelle
    bold?: boolean; // Gras optionnel
    // Autres propriétés possibles : name, italic, color, etc.
  }

  function estimateCellWidth(text: string, font: ExcelFont = {}): number {
    const DEFAULT_CHAR_WIDTH = 1.2;
    const BOLD_MULTIPLIER = 1.2;
    const FONT_SIZE_FACTOR = (font.size || 11) / 11;

    let width = 0;
    if (text) {
      width = text.length * DEFAULT_CHAR_WIDTH;
      if (font.bold) width *= BOLD_MULTIPLIER;
      width *= FONT_SIZE_FACTOR;
    }
    return width;
  }

  // Appliquer l'autofit
  autoFitColumns(worksheet);

  // 3. Déverrouiller TOUTES les cellules par défaut
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.protection = { locked: false }; // Par défaut : modifiable

      if (row.number >= 10) {
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      }
    });
  });

  //Verrouiller uniquement les colonnes A, B, C (1 = A, 2 = B, 3 = C, 6 = F)
  const protectedColumns = [1, 2, 3, 6]; // Index des colonnes à protéger
  protectedColumns.forEach((colNumber) => {
    worksheet.getColumn(colNumber).eachCell((cell) => {
      cell.protection = { locked: true }; // Blocage
    });
  });

  // - Ligne 8 (en-têtes) ENTIÈREMENT verrouillée
  worksheet.getRow(9).eachCell((cell) => {
    cell.protection = { locked: true };
  });
  worksheet.getRow(10).eachCell((cell) => {
    cell.protection = { locked: true };
  });

  // 5. Activer la protection de la feuille (sans mot de passe)
  worksheet.protect("", {
    selectLockedCells: true, // Permet la sélection en lecture seule
    selectUnlockedCells: true, // Permet l'édition des cellules déverrouillées
    formatCells: false, // Empêche la modification des styles
  });

  // Protection conditionnelle pour les notes

  // 2. Ajouter une validation des données (0 ≤ note ≤ 10)
  for (let rowNum = 11; rowNum <= worksheet.rowCount; rowNum++) {
    worksheet;
    // Validation pour la colonne D (CC)
    worksheet.getCell(`D${rowNum}`).numFmt = "0.00";
    worksheet.getCell(`D${rowNum}`).dataValidation = {
      type: "decimal",
      operator: "between",
      formulae: [0, 10],
      allowBlank: true,
      error: "La note CC doit être entre 0 et 10",
      errorTitle: "Valeur invalide",
      showInputMessage: true,
      showErrorMessage: true,
      prompt: "Decimal",
      promptTitle: "La note CC doit être entre 0 et 10",
    };
    worksheet.getCell(`D${rowNum}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF5F5F5" },
    };
    worksheet.getCell(`D${rowNum}`).alignment = {
      vertical: "middle",
      horizontal: "right",
    };

    // Validation pour la colonne E (Examen)
    worksheet.getCell(`E${rowNum}`).numFmt = "0.00"; // Format Examen
    worksheet.getCell(`E${rowNum}`).dataValidation = {
      type: "decimal",
      operator: "between",
      formulae: [0, 10],
      allowBlank: true,
      error: "La note d'examen doit être entre 0 et 10",
      errorTitle: "Valeur invalide",
      showErrorMessage: true,
      showInputMessage: true,
      prompt: "Decimal",
      promptTitle: "La note d'examen doit être entre 0 et 10",
    };
    worksheet.getCell(`E${rowNum}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF5F5F5" },
    };
    worksheet.getCell(`E${rowNum}`).alignment = {
      vertical: "middle",
      horizontal: "right",
    };

    // Format pour la colonne F (Total)
    worksheet.getCell(`F${rowNum}`).numFmt = "0.00";
    worksheet.getCell(`F${rowNum}`).dataValidation = {
      type: "decimal",
      operator: "between",
      formulae: [0, 20],
      allowBlank: true,
      error: "La note d'examen doit être entre 0 et 20",
      errorTitle: "Valeur invalide",
    };
    worksheet.getCell(`F${rowNum}`).font = { bold: true };
    // Formule pour calculer le Total (colonne F= D + E)
    worksheet.getCell(`F${rowNum}`).value = {
      formula: `IF(AND(ISBLANK(D${rowNum}), ISBLANK(E${rowNum})), "", D${rowNum} + E${rowNum})`,
      // formula: `D${rowNum} + E${rowNum}`,
    };
  }

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
  options?.onAfter?.();
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

  const HEADER_ROW_INDEX = 10;
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
      status: "validated",
    } as NewGradeClass;
  });

  return matchedGrades.filter(
    (grade) => grade.student !== null && grade.course !== null
  );
}
