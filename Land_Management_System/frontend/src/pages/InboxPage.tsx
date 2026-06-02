import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import type { Dossier } from "../api/types";
import { StatusChip } from "../components/StatusChip";

export default function InboxPage() {
  const [rows, setRows] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await api.get<Dossier[]>("/dossiers/inbox");
      setRows(res.data);
      setLoading(false);
    };
    void run();
  }, []);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Hồ sơ cần xử lý
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Danh sách hồ sơ đang chờ đơn vị của bạn xử lý.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : rows.length === 0 ? (
          <Typography>Không có hồ sơ cần xử lý.</Typography>
        ) : (
          <Stack spacing={1}>
            {rows.map((d) => (
              <Paper key={d.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700}>{d.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID #{d.id} · origin unit #{d.origin_unit_id}
                    </Typography>
                  </Box>
                  <StatusChip status={d.status} />
                  <Button component={RouterLink} to={`/dossiers/${d.id}`} variant="contained">
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


