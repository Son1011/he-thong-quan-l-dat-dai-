import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import type { Dossier } from "../api/types";
import { StatusChip } from "../components/StatusChip";

export default function InboxPage() {
  const [rows, setRows] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ESCALATED" | "APPROVED">("ALL");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await api.get("/dossiers/inbox");

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? res.data?.content ?? [];

      setRows(data);
      setLoading(false);
    };

    void run();
  }, []);


  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows.filter((d) => {
      const title = (d.title ?? "").toLowerCase();
      const id = String(d.id);

      const matchSearch =
        keyword === "" ||
        title.includes(keyword) ||
        id.includes(keyword);

      const matchFilter =
        filter === "ALL" ? true : d.status === filter;

      return matchSearch && matchFilter;
    });
  }, [rows, search, filter]);

  return (
    <Stack spacing={2}>
      {/* HEADER */}
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Hồ sơ cần xử lý
        </Typography>
      </Box>

      {/* SEARCH + FILTER */}
      <Paper sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">

          {/* SEARCH - FIX WIDTH */}
          <TextField
            size="small"
            label="Tìm kiếm (tên hoặc ID)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}   // 👈 nhỏ lại rõ ràng
          />

          {/* FILTER - FIX HIỂN THỊ */}
          <TextField
            select
            size="small"
            label="Lọc trạng thái"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            sx={{ width: 180 }}  
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="ESCALATED">Gửi cấp trên</MenuItem>
            <MenuItem value="APPROVED">Đã duyệt</MenuItem>
          </TextField>

          <Box sx={{ flexGrow: 1 }} />

          {/* RESET */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setSearch("");
              setFilter("ALL");
            }}
          >
            tải lại
          </Button>
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
              <Paper key={d.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600}>
                      {d.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      ID #{d.id} · origin unit #{d.origin_unit_id}
                    </Typography>
                  </Box>

                  <StatusChip status={d.status} />

                  <Button
                    size="small"
                    variant="contained"
                    component={RouterLink}
                    to={`/dossiers/${d.id}`}
                  >
                    Mở
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