import { GetEmployeeRoleService } from "api/services/EmployeeRolesAPIService";
import { create } from "zustand";

interface EmployeeRole {
	id: number;
	name: string;
	is_active: number;
}

interface RoleStore {
	employeeRoles: EmployeeRole[];
	activeRoles: EmployeeRole[];
	inactiveRoles: EmployeeRole[];
	isLoading: boolean;
	error: string | null;
	getEmployeeRoles: () => Promise<void>;
	switchEmployeeRoles: () => void;
}

export const useEmployeeRolesStore = create<RoleStore>((set, get) => ({
	employeeRoles: [],
	activeRoles: [],
	inactiveRoles: [],
	isLoading: false,
	error: null,

	getEmployeeRoles: async () => {
		try {
			const response: any = await GetEmployeeRoleService();
			set({ employeeRoles: response.data });
		} catch (error) {
			console.error("Error in getEmployeeRoles");
			alert("Failed to fetch Employee Roles");
		}
	},

	switchEmployeeRoles: () => {
		const { employeeRoles } = get();
		const activeRoles = employeeRoles.filter((r) => r.is_active === 1);
		const inactiveRoles = employeeRoles.filter((r) => r.is_active !== 1);
		set({ activeRoles, inactiveRoles });
	}
}));
