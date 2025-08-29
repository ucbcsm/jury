import { ResultGrid } from "@/types";
import api from "../fetcher";
import ExcelJS from "exceljs";


export async function getResultGrid(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId: number;
  classId: number;
  periodId: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
}) {
  const {
    yearId,
    facultyId,
    departmentId,
    classId,
    periodId,
    moment,
    session,
  } = searchParams;
  const queryParams = new URLSearchParams();

  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("faculty__id", facultyId.toString());
  queryParams.append("departement__id", departmentId.toString());
  queryParams.append("class_year__id", classId.toString());
  queryParams.append("period__ids", periodId.toString());
  queryParams.append("session", session.toString());
  queryParams.append("moment", moment.toString());

  const res = await api.get(
    `/jury/student-results-grid?${queryParams.toString()}`
  );

  return res.data as ResultGrid;
}


export function getDecisionText(decision: "passed" | "postponed") {
  if (decision === "passed") {
    return "Admis (e)";
  } else if (decision === "postponed") {
    return "Ajourné (e)";
  }
  return "";
}





/**
 * Exporte les données ResultGrid dans un fichier Excel (.xlsx)
 * @param data Les données du tableau de type ResultGrid
 * @param filename Le nom du fichier à télécharger (optionnel)
 */
export async function exportGridToExcel(
  data: ResultGrid,
  options: { sheetName: string; fileName: string } = {
    fileName: "resultats.xlsx",
    sheetName: "Résultats",
  }
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(options.sheetName);

  // Styles (corrigé avec as const)
  const headerStyle = {
    font: { bold: true, size: 12 },
    alignment: { vertical: "middle" as const, horizontal: "center" as const },
    border: {
      top: { style: "thin" as const },
      left: { style: "thin" as const },
      bottom: { style: "thin" as const },
      right: { style: "thin" as const },
    },
  };

  const cellStyle = {
    alignment: { vertical: "middle" as const, horizontal: "center" as const },
    border: {
      top: { style: "thin" as const },
      left: { style: "thin" as const },
      bottom: { style: "thin" as const },
      right: { style: "thin" as const },
    },
  };

  // On suppose une seule période (sinon adapter la logique)
  const noRetaken = data.HeaderData?.no_retaken;
  if (!noRetaken) throw new Error("HeaderData.no_retaken absent");

  let colOffset = 4; // N°, Nom, Matricule, Genre
  let currentRow = 1;

  for (const period of noRetaken.period_list) {
    // Ligne 1 : Nom de la période
    const totalCols = colOffset + period.course_counter + 7;
    sheet.mergeCells(currentRow, 1, currentRow, totalCols);
    sheet.getCell(currentRow, 1).value = period.period.name;
    sheet.getCell(currentRow, 1).style = headerStyle;
    currentRow++;

    // Ligne 2 : Unités d'Enseignement + colonnes fixes après EC
    for (let i = 0; i < 4; i++) {
      sheet.mergeCells(currentRow, i + 1, currentRow + 1, i + 1);
      sheet.getCell(currentRow, i + 1).value = [
        "N°",
        "Nom & Prénom",
        "Matricule",
        "Genre",
      ][i];
      sheet.getCell(currentRow, i + 1).style = headerStyle;
    }
    let col = 5;
    for (const TU of noRetaken.teaching_unit_list.slice(
      0,
      period.teaching_unit_counter
    )) {
      sheet.mergeCells(
        currentRow,
        col,
        currentRow,
        col + TU.course_counter - 1
      );
      sheet.getCell(currentRow, col).value = TU.teaching_unit.code;
      sheet.getCell(currentRow, col).style = headerStyle;
      col += TU.course_counter;
    }
    const afterCourseCols = [
      "Total Crédits",
      "Pourcentage",
      "Grade",
      "EC Validés",
      "EC Non Validés",
      "Crédits Validés",
      "Crédits Non Validés",
      "Décision",
    ];
    for (let i = 0; i < afterCourseCols.length; i++) {
      sheet.mergeCells(currentRow, col + i, currentRow + 1, col + i);
      sheet.getCell(currentRow, col + i).value = afterCourseCols[i];
      sheet.getCell(currentRow, col + i).style = headerStyle;
    }
    currentRow++;

    // Ligne 3 : Nom complet des EC
    col = 5;
    for (const TU of noRetaken.teaching_unit_list.slice(
      0,
      period.teaching_unit_counter
    )) {
      for (let j = 0; j < TU.course_counter; j++) {
        sheet.getCell(currentRow, col).value = TU.teaching_unit.name;
        sheet.getCell(currentRow, col).style = headerStyle;
        col++;
      }
    }
    // Colonnes fixes déjà traitées plus haut
    currentRow++;
  }

  // Ligne suivante : noms des EC (cours)
  let courseStartCol = 5;
  const courseList = noRetaken.course_list;
  for (let i = 0; i < courseList.length; i++) {
    sheet.getCell(currentRow, courseStartCol + i).value =
      courseList[i].available_course.name;
    sheet.getCell(currentRow, courseStartCol + i).style = headerStyle;
  }
  currentRow++;

  // Ligne suivante : crédits EC
  for (let i = 0; i < 4; i++) {
    sheet.getCell(currentRow, i + 1).value = "";
  }
  for (let i = 0; i < noRetaken.credits.length; i++) {
    sheet.getCell(currentRow, courseStartCol + i).value = noRetaken.credits[i];
    sheet.getCell(currentRow, courseStartCol + i).style = cellStyle;
  }
  currentRow++;

  // Ligne suivante : TOTAL (notes sur 20)
  for (let i = 0; i < 4; i++) {
    sheet.getCell(currentRow, i + 1).value = "";
  }
  for (let i = 0; i < courseList.length; i++) {
    sheet.getCell(currentRow, courseStartCol + i).value = 20;
    sheet.getCell(currentRow, courseStartCol + i).style = cellStyle;
  }
  currentRow++;

  // Lignes des étudiants (body)
  data.BodyDataList.forEach((record, idx) => {
    let row = [
      idx + 1,
      `${record.first_name} ${record.last_name} ${record.surname}`,
      record.matricule,
      record.gender,
      ...record.no_retaken.totals,
      record.weighted_average,
      record.percentage,
      record.grade_letter,
      record.no_retaken.course_decisions.filter((x) => x === "validated")
        .length,
      record.no_retaken.course_decisions.filter((x) => x === "no_validated")
        .length,
      record.validated_credit_sum,
      record.unvalidated_credit_sum,
      record.decision === "passed" ? "Admis" : "Ajourné",
    ];
    sheet.addRow(row);
  });

  // Appliquer les styles
  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.style = { ...cell.style, ...cellStyle };
    });
    if (rowNumber <= currentRow) {
      row.eachCell((cell) => {
        cell.style = { ...cell.style, ...headerStyle };
      });
    }
  });

 // Auto-fit des colonnes
sheet.columns.forEach((col) => {
  if (col && typeof col.eachCell === "function") {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value && cell.value.toString().length > maxLength) {
        maxLength = cell.value.toString().length;
      }
    });
    col.width = maxLength + 2;
  }
});

  // Générer le fichier et déclencher le téléchargement
  const buffer = await workbook.xlsx.writeBuffer();
  // saveAs(new Blob([buffer]), filename);

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