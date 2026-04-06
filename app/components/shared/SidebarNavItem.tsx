import { UnstyledButton } from "@mantine/core";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  accentColor: string;
  accentLight: string;
  badge?: number;
  collapsed?: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  active,
  onClick,
  accentColor,
  accentLight,
  badge,
  collapsed = false,
}: SidebarNavItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: collapsed ? "9px 0" : "9px 14px",
        borderRadius: 8,
        background: active ? accentLight : "transparent",
        borderLeft: collapsed ? "none" : `2px solid ${active ? accentColor : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        marginBottom: 2,
      }}
      className="hover:bg-white/5"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            minWidth: 0,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Icon
            size={16}
            strokeWidth={active ? 2.25 : 1.75}
            color={active ? accentColor : "#64748b"}
          />
          {!collapsed && label && (
            <span
              style={{
                color: active ? accentColor : "#64748b",
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          )}
        </div>
        {!collapsed && badge !== undefined && badge > 0 && (
          <span
            style={{
              background: accentColor,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 10,
              padding: "1px 7px",
              lineHeight: 1.6,
              flexShrink: 0,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </UnstyledButton>
  );
}