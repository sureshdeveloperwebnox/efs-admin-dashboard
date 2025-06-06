import { 
  CreateEmployeeService, 
  GetAllEmployeeService, 
  GetEmployeeService, 
  ToggleEmployeeStatusService, 
  UpdateEmployeeService 
} from "api/services/EmployeeAPIService"; 

import { create } from "zustand"; 

// Employee interface matching your Prisma model 
export interface Employee { 
  id: string; 
  user_id: string; 
  organization_id: string; 
  first_name: string; 
  last_name: string; 
  email: string; 
  phone: string; 
  job_title: string; 
  gender: string; 
  address: string; 
  city: string; 
  state: string; 
  country: string; 
  pincode: string; 
  skill: string[]; 
  experience_years: string; 
  employee_role_id: string; 
  is_active: number; 
} 

interface EmployeeStore { 
  selectedEmployee: Employee | null; 
  employees: Employee[]; 
  activeEmployees: Employee[]; 
  inactiveEmployees: Employee[]; 
  isLoading: boolean; 
  error: string | null; 

  setSelectedEmployee: (id: string) => void; 
  createEmployee: (employee: Partial<Employee>) => Promise<void>; 
  getAllEmployees: () => Promise<void>; 
  getEmployeeById: (id: string) => Promise<void>; 
  updateEmployee: (employee: Partial<Employee>) => Promise<void>; 
  toggleEmployeeStatus: (id: string, is_active: number) => Promise<void>; 
  switchEmployees: () => void; 
} 

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({ 
  selectedEmployee: null, 
  employees: [], 
  activeEmployees: [], 
  inactiveEmployees: [], 
  isLoading: false, 
  error: null, 

  setSelectedEmployee: (id: string) => { 
    const employee = get().employees.find((emp) => emp.id === id) || null; 
    set({ selectedEmployee: employee }); 
  }, 

  createEmployee: async (employee) => { 
    try { 
      set({ isLoading: true, error: null }); 
      const response = await CreateEmployeeService(employee); 
      const newEmployee: Employee = response.data; 

      const updatedEmployees = [...(get().employees ?? []), newEmployee]; 
      set({ employees: updatedEmployees }); 
      get().switchEmployees(); 
    } catch (error: any) { 
      console.error("Error creating employee:", error); 
      set({ error: error?.message || "Failed to create employee" }); 
    } finally { 
      set({ isLoading: false }); 
    } 
  }, 

  getAllEmployees: async () => { 
    try { 
      const response: any = await GetAllEmployeeService(); 
      console.log("GetAll Employees>>>>", response); 
      set({ employees: response }); 
      get().switchEmployees(); 
    } catch (error: any) { 
      console.error("Error fetching all employees:", error); 
      set({ error: error?.message || "Failed to fetch employees" }); 
    } 
  }, 

  getEmployeeById: async (id) => { 
    try { 
      const response: any = await GetEmployeeService(Number(id)); 
      const employee: Employee = response.data; 
      set({ selectedEmployee: employee }); 
    } catch (error: any) { 
      console.error("Error fetching employee by ID:", error); 
      set({ error: error?.message || "Failed to fetch employee" }); 
    } 
  }, 

  updateEmployee: async (employee) => { 
    try { 
      set({ isLoading: true, error: null }); 
      const response = await UpdateEmployeeService(employee); 
      const updated: Employee = response.data; 

      const updatedEmployees = (get().employees ?? []).map((emp) => 
        emp.id === updated.id ? updated : emp 
      ); 

      set({ employees: updatedEmployees, selectedEmployee: updated }); 
      get().switchEmployees(); 
    } catch (error: any) { 
      console.error("Error updating employee:", error); 
      set({ error: error?.message || "Failed to update employee" }); 
    } finally { 
      set({ isLoading: false }); 
    } 
  }, 

  toggleEmployeeStatus: async (id, is_active) => { 
    try { 
      await ToggleEmployeeStatusService({ id: Number(id), is_active }); 

      const updatedEmployees = (get().employees ?? []).map((emp) => 
        emp.id === id ? { ...emp, is_active } : emp 
      ); 

      set({ employees: updatedEmployees }); 
      get().switchEmployees(); 
    } catch (error: any) { 
      console.error("Error toggling employee status:", error); 
      set({ error: error?.message || "Failed to toggle employee status" }); 
    } 
  }, 

  switchEmployees: () => { 
    const employees = get().employees ?? []; 
    const activeEmployees = employees.filter((e) => e.is_active === 1); 
    const inactiveEmployees = employees.filter((e) => e.is_active !== 1); 
    set({ activeEmployees, inactiveEmployees }); 
  } 
}));