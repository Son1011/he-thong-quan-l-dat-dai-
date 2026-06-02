import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Dossier } from "../api/types";
import { StatusChip } from "../components/StatusChip";

export default function NewDossierPage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState<Dossier | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Tạo hồ sơ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xã tạo → tự động chuyển lên tỉnh (PENDING). Tỉnh tạo → gửi thẳng Trung ương (ESCALATED).
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {err ? <Alert severity="error">{err}</Alert> : null}
          {created ? (
            <Alert severity="success">
              Đã tạo hồ sơ #{created.id} · <StatusChip status={created.status} />
            </Alert>
          ) : null}
          <TextField
            label="Tiêu đề hồ sơ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Hồ sơ xã A1 - thửa 123"
            fullWidth
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tài liệu đính kèm (tùy chọn)
            </Typography>
            <Button component="label" variant="outlined">
              Chọn file
              <input
                hidden
                type="file"
                multiple
                onChange={(e) => {
                  const list = Array.from(e.target.files ?? []);
                  setFiles(list);
                }}
              />
            </Button>
            {files.length ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Đã chọn: {files.map((f) => f.name).join(", ")}
              </Typography>
            ) : null}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={busy || !title.trim()}
              onClick={async () => {
                setBusy(true);
                setErr(null);
                try {
                  const res = await api.post<Dossier>("/dossiers", { title: title.trim() });
                  setCreated(res.data);
                  // Upload attachments right after creation (so user doesn't need to go to detail first).
                  if (files.length) {
                    for (const f of files) {
                      const fd = new FormData();
                      fd.append("file", f);
                      await api.post(`/dossiers/${res.data.id}/attachments`, fd, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                    }
                  }
                  // Go to detail page (where user can upload bổ sung later).
                  nav(`/dossiers/${res.data.id}`);
                } catch (e: any) {
                  setErr(e?.response?.data?.detail ?? e?.message ?? "Tạo hồ sơ thất bại");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Tạo
            </Button>
            <Button variant="outlined" onClick={() => nav("/dossiers")}>
              Về danh sách
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}


