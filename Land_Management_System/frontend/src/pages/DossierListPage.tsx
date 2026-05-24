import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    let data = rows;

    // lọc theo status
    if (status !== "ALL") {
      data = data.filter((r) => r.status === status);
    }

    // search theo id + title (không phân biệt hoa thường)
    if (search.trim()) {
      const s = search.toLowerCase().trim();

      data = data.filter((d) => {
        return (
          d.title?.toLowerCase().includes(s) ||
          String(d.id).includes(s)
        );
      });
    }

    return data;
  }, [rows, status, search]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const res =
        me?.role === "CENTRAL_OFFICER"
          ? await api.get("/dossiers/central/decisions")
          : await api.get("/dossiers");

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data
          ? res.data.data
          : res.data?.content
          ? res.data.content
          : [];

      setRows(data);
      setLoading(false);
    };

    void run();
  }, [me?.role]);

  const statusTabs: Array<{ key: DossierStatus | "ALL"; label: string }> =
    me?.role === "CENTRAL_OFFICER"
      ? [
          { key: "ALL", label: "Tất cả" },
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
      {/* HEADER */}
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Danh sách hồ sơ
        </Typography>
      </Box>

      {/* SEARCH + FILTER */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <TextField
            size="small"
            placeholder="Tìm theo ID hoặc tên hồ sơ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}   // 👈 làm nhỏ thanh tìm kiếm
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => setSearch("")}
          >
            Xóa tìm kiếm
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            size="small"
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </Button>
        </Stack>
      </Paper>

      {/* STATUS FILTER */}
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
        </Stack>
      </Paper>

      {/* LIST */}
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : filtered.length === 0 ? (
          <Typography>Không có hồ sơ.</Typography>
        ) : (
          <Stack spacing={1}>
            {filtered.map((d) => (
              <Paper key={d.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ sm: "center" }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700}>
                      {d.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID #{d.id} · origin unit #{d.origin_unit_id}
                    </Typography>
                  </Box>

                  <StatusChip status={d.status} />

                  <Button
                    component={RouterLink}
                    to={`/dossiers/${d.id}`}
                    variant="contained"
                  >
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