// useEmployeeRolesStore.ts
import {
  CreateEmployeeRoleService,
  GetAllEmployeeRoleService,
  ToggleEmployeeRoleStatusService,
  UpdateEmployeeRoleService
} from "api/services/EmployeeRolesAPIService";
import { create } from "zustand";

interface EmployeeRole {
  id: string;
  organization_id: string;
  name: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface RoleStore {
  selectedRole: EmployeeRole | null;
  employeeRoles: EmployeeRole[];
  activeRoles: EmployeeRole[];
  inactiveRoles: EmployeeRole[];
  isLoading: boolean;
  error: string | null;

  setSelectedRole: (selectedRole: EmployeeRole | null) => void;
  createEmployeeRoles: (name: string) => Promise<void>;
  getEmployeeRoles: () => Promise<void>;
  toggleEmployeeRole: (id: string, is_active: number) => Promise<void>;
  updateEmployeeRole: (roleToBeUpdated: EmployeeRole) => Promise<void>;
  switchEmployeeRoles: () => void;
}

export const useEmployeeRolesStore = create<RoleStore>((set, get) => ({
  selectedRole: null,
  employeeRoles: [],
  activeRoles: [],
  inactiveRoles: [],
  isLoading: false,
  error: null,

  setSelectedRole: (selectedRole: EmployeeRole | null) => {
    set({ selectedRole });
  },

  createEmployeeRoles: async (name: string) => {
    try {
      const response = await CreateEmployeeRoleService({ name });
      if (response?.status) {
        const createdRole: EmployeeRole = {
          id: response?.id,
          organization_id: response?.organization_id,
          name: response?.name,
          is_active: response?.is_active,
          created_at: response?.created_at,
          updated_at: response?.updated_at
        };
        const updatedRoles = [...get().employeeRoles, createdRole];
        set({ employeeRoles: updatedRoles });
        get().switchEmployeeRoles();
      }
    } catch (error) {
      console.error("Error creating role:", error);
      set({ error: "Failed to create Employee Role" });
    }
  },

  getEmployeeRoles: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await GetAllEmployeeRoleService();
      set({ employeeRoles: response, isLoading: false });
      get().switchEmployeeRoles();
    } catch (error) {
      console.error("Error in getEmployeeRoles:", error);
      set({ error: "Failed to fetch Employee Roles", isLoading: false });
    }
  },

  toggleEmployeeRole: async (id: string, is_active: number) => {
    const newStatus = is_active === 1 ? 0 : 1;
    try {
      const response = await ToggleEmployeeRoleStatusService({ id: Number(id), is_active });
      if (response?.data) {
        const updatedRoles = get().employeeRoles.map((role) =>
          role.id === id ? { ...role, is_active: newStatus } : role
        );
        set({ employeeRoles: updatedRoles });
        get().switchEmployeeRoles();
      } else {
        console.warn("Unexpected toggle response:", response);
      }
    } catch (error) {
      console.error("Error in toggleEmployeeRole:", error);
    }
  },

  updateEmployeeRole: async (roleToBeUpdated: EmployeeRole) => {
    try {
      const response = await UpdateEmployeeRoleService(roleToBeUpdated);
      if (response?.data) {
        const updatedRoles = get().employeeRoles.map((role) =>
          role.id === roleToBeUpdated.id
            ? { ...role, name: roleToBeUpdated.name }
            : role
        );
        set({ employeeRoles: updatedRoles });
        get().switchEmployeeRoles();
      } else {
        console.warn("Unexpected update response:", response);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  },

  switchEmployeeRoles: () => {
    const allRoles = get().employeeRoles;
    const activeRoles = allRoles.filter((r) => r.is_active === 1);
    const inactiveRoles = allRoles.filter((r) => r.is_active !== 1);
    set({ activeRoles, inactiveRoles });
  }
}));