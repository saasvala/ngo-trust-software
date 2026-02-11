import { useRules } from "@/contexts/RuleContext";
import { AppRole } from "@/lib/types/rules";
import { getRoleLabel } from "@/lib/data/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles: AppRole[] = [
  'super_admin',
  'system_owner',
  'country_admin',
  'state_admin',
  'ngo_admin',
  'accountant',
  'operator',
  'project_manager',
  'field_executor',
  'auditor',
  'government_officer',
  'donor',
  'view_only',
];

export const RoleSwitcher = () => {
  const { currentRole, setRole } = useRules();

  return (
    <Select value={currentRole} onValueChange={(value) => setRole(value as AppRole)}>
      <SelectTrigger className="w-[180px] bg-secondary border-border">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {getRoleLabel(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
