//  ENDPOINTS LINKS 


// https://ciucbc.pythonanywhere.com/api/v01/account/roles/
// https://ciucbc.pythonanywhere.com/api/v01/account/permission/
// https://ciucbc.pythonanywhere.com/api/v01/account/group/

// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/available-course/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/course-student-assignation/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/taught-course/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/hour-record/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/physical-attendance-check/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/student-attendance-status/'
// 'https://ciucbc.pythonanywhere.com/api/v01/faculty/teaching-unit/'


// http://localhost:8000/api/v01/apparitorat/application/
// http://localhost:8000/api/v01/apparitorat/application-pending/
// http://localhost:8000/api/v01/apparitorat/application-validated/
// http://localhost:8000/api/v01/apparitorat/application-rejected/
// http://localhost:8000/api/v01/apparitorat/previous-university-studies/
// http://localhost:8000/api/v01/apparitorat/enrollment-question-response/
// http://localhost:8000/api/v01/apparitorat/admission-test-course/
// http://localhost:8000/api/v01/apparitorat/admission-test-result/
// http://localhost:8000/api/v01/apparitorat/enrollment/
// http://localhost:8000/api/v01/apparitorat/common-enrollment-infos/
// http://localhost:8000/api/v01/apparitorat/premature-end/

// get token after login: https://ciucbc.pythonanywhere.com/https://ciucbc.pythonanywhere.com/auth/jwt/create/
// create user or register user: https://ciucbc.pythonanywhere.com/auth/users/
// get the current connected user info: https://ciucbc.pythonanywhere.com/auth/users/me/

//  https://ciucbc.pythonanywhere.com/api/v01/main_config/academic-year/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/class-year/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/cycle/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/currency/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/departement/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/faculty/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/field/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/house/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/institution/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/payement-method/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/period/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/service/
//  https://ciucbc.pythonanywhere.com/api/v01/main_config/timetable/

//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-pending/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-validated/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/application-rejected/

//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/previous-university-studies/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/enrollment-question-response/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/admission-test-course/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/admission-test-result/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/enrollment/,
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/common-enrollment-infos/
//  https://ciucbc.pythonanywhere.com/api/v01/apparitorat/premature-end/

// https://ciucbc.pythonanywhere.com/api/v01/faculty/available-course "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/teaching-unit "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/taught-course "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/departement-program/ "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/course-program/ "OK"

// https://ciucbc.pythonanywhere.com/api/v01/faculty/teachers "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/hour-record "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/course-student-assignation "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/physical-attendance-check "OK"
// https://ciucbc.pythonanywhere.com/api/v01/faculty/student-attendance-status "OK"


// ################# Period enrollment #####################

// POST:
// {
//   year_enrollments:[1,3,5],
//   period:1,
//   status:"Pending"

// {

// PUT - SIGLE:
 
// {
//   pk:1,
//   year_enrollments:1,
//   period:2,    
//   status:"Validated"
// }  

// PUT - MULTIPLE:
 
// {
//   pk_list:[1,2],      
//   status:"Validated"
// }
     
 


// ################# Course enrollment from fac #####################



// POST :
// {
//   payload:[
//     { student:1,courses:[1],status:"Pending"},
//     { student:1,courses:[1,9] ,status:"Pending"},
//   ]
// }

// PUT - SIGLE:
 
// {
//   pk:1,
//   student:1,
//   course:2,    
//   status:"Validated",
//   mode:"SINGLE-UPDATE"
// }  

// PUT - MULTIPLE:
 
// {
//   pk_list:[1,2],      
//   status:"Validated",
//   mode:"MULTIPLE-UPDATE"
// }

//   https://ciucbc.pythonanywhere.com/api/v01/account/users/
// https://ciucbc.pythonanywhere.com/api/v01/account/roles/
// https://ciucbc.pythonanywhere.com/api/v01/account/permission/
// https://ciucbc.pythonanywhere.com/api/v01/account/group

// https://ciucbc.pythonanywhere.com/api/v01/faculty/faculty-dashbord/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/faculty/departement-dashboard/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/faculty/class-year-dashbord/

// https://ciucbc.pythonanywhere.com/api/v01/teacher/teacher-dashbord/ (OK)
// https://ciucbc.pythonanywhere.com/api/v01/student/student-dashbord/ ...



//  https://ciucbc.pythonanywhere.com/api/v01/jury/letter-grading (OK)
//  https://ciucbc.pythonanywhere.com/api/v01/jury/jury (OK)
//  https://ciucbc.pythonanywhere.com/api/v01/jury/sheet-field-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/sheet-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/grades-class
//  https://ciucbc.pythonanywhere.com/api/v01/jury/teaching-unit-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/period-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/year-grades
//  https://ciucbc.pythonanywhere.com/api/v01/jury/announcement
//  https://ciucbc.pythonanywhere.com/api/v01/jury/retake-course
