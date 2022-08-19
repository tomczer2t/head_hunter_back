interface HrStudentHireTemplateData {
  hr: {
    firstName: string;
    lastName: string;
    id: string;
    company: string;
  };
  student: {
    firstName: string;
    lastName: string;
    id: string;
  };
}

export const hrStudentHireTemplate = ({
  hr,
  student,
}: HrStudentHireTemplateData) => {
  return `
  <div style='text-align: center; font-family: Helvetica, Arial, sans-serif'>
    <h3>${hr.firstName} ${hr.lastName} zatrudnił kursanta!</h3>
    <p>
      HR:</br>
      imie i nazwisko: ${hr.firstName} ${hr.lastName}</br>
      firma: ${hr.company}</br>  
      id: ${hr.id}  
    </p>
    <p>
      Kursant:</br>
      imie i nazwisko: ${student.firstName} ${student.lastName}</br>  
      id: ${student.id}  
    </p>
  </div>
`;
};
