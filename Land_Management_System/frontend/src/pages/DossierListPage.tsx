import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import type { Dossier, DossierStatus } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { StatusChip, statusLabel } from "../components/StatusChip";

export default function DossierListPage() {
  const { me } = useAuth();
  const [rows, setRows] = useState<Dossier[]>([]);
  const [status, setStatus] = useState<DossierStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    if (status === "ALL") return rows;
    return rows.filter((r) => r.status === status);
  }, [rows, status]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res =
        me?.role === "CENTRAL_OFFICER"
          ? await api.get<Dossier[]>("/dossiers/central/decisions")
          : await api.get<Dossier[]>("/dossiers");
      setRows(res.data);
      setLoading(false);
    };
    void run();
  }, [me?.role]);

  const statusTabs: Array<{ key: DossierStatus | "ALL"; label: string }> =
    me?.role === "CENTRAL_OFFICER"
      ? [
          { key: "ALL", label: "Tất cả (quyết định bởi TW)" },
          { key: "APPROVED", label: statusLabel("APPROVED") },
          { key: "RETURNED", label: statusLabel("RETURNED") },
        ]
      : [
          { key: "ALL", label: "Tất cả" },
          { key: "PENDING", label: statusLabel("PENDING") },
          { key: "ESCALATED", label: statusLabel("ESCALATED") },
          { key: "APPROVED", label: statusLabel("APPROVED") },
          { key: "RETURNED", label: statusLabel("RETURNED") },
        ];

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          {me?.role === "CENTRAL_OFFICER" ? "Danh sách hồ sơ (Trung ương đã duyệt / trả lại)" : "Danh sách hồ sơ"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {me?.role === "CENTRAL_OFFICER"
            ? "Chỉ hiển thị các hồ sơ có thao tác cuối cùng là Duyệt/Trả lại bởi Trung ương. Inbox mới là nơi cần xử lý."
            : "Dữ liệu được load theo vai trò + đơn vị hành chính (backend quyết định)."}
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {statusTabs.map((t) => (
            <Button
              key={t.key}
              variant={status === t.key ? "contained" : "outlined"}
              size="small"
              onClick={() => setStatus(t.key)}
            >
              {t.label}
            </Button>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Button size="small" variant="outlined" onClick={() => window.location.reload()}>
            Tải lại
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : filtered.length === 0 ? (
          <Typography>Không có hồ sơ.</Typography>
        ) : (
          <Stack spacing={1}>
            {filtered.map((d) => (
              <Paper key={d.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700}>{d.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID #{d.id} · origin unit #{d.origin_unit_id} · assigned unit #{d.assigned_to_unit_id}
                    </Typography>
                  </Box>
                  <StatusChip status={d.status} />
                  <Button component={RouterLink} to={`/dossiers/${d.id}`} variant="contained">
                    Chi tiết
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}


