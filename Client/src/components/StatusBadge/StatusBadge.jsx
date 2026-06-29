import "./StatusBadge.css";

const STATUS_MAP = {
  PENDING: { label: "Pendiente", cls: "badge-pending" },
  pending: { label: "Pendiente", cls: "badge-pending" },
  APPROVED: { label: "✓ Aprobado", cls: "badge-approved" },
  approved: { label: "✓ Aprobado", cls: "badge-approved" },
  active: { label: "● Aprobado", cls: "badge-approved" },
  REJECTED: { label: "✗ Rechazado", cls: "badge-rejected" },
  rejected: { label: "✗ Rechazado", cls: "badge-rejected" },
  suspended: { label: "● Rechazado", cls: "badge-suspended" },
};

export default function StatusBadge({ status, label }) {
  const config = STATUS_MAP[status] ?? { label: status, cls: "badge-pending" };
  return (
    <span className={`admin-badge ${config.cls}`}>{label ?? config.label}</span>
  );
}
