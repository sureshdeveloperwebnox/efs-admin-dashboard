export const employee_role = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "HR Manager",
  "Marketing Executive",
  "UX Designer",
  "DevOps Engineer",
  "Finance Analyst",
  "Sales Manager",
  "Software Architect"
]

export const getEmployeeRoleById = (id) => {
    return employee_role[Number(id)];
}