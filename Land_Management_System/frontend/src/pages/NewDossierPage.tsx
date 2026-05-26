import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Dossier } from "../api/types";
import { StatusChip } from "../components/StatusChip";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NewDossierPage() {
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState<Dossier | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dossierTypeId, setDossierTypeId] = useState("1");
  const [originUnitId, setOriginUnitId] = useState("3");

  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [citizenIdentityNumber, setCitizenIdentityNumber] = useState("");
  const [citizenAddress, setCitizenAddress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setBusy(true);
    setErr(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        origin_unit_id: Number(originUnitId),
        dossier_type_id: Number(dossierTypeId),
        citizen_name: citizenName.trim(),
        citizen_identity_number: citizenIdentityNumber.trim(),
        citizen_phone: citizenPhone.trim(),
        citizen_address: citizenAddress.trim(),
      };

      const res = await api.post<Dossier>("/dossiers", payload);
      const newDossier = res.data;
      setCreated(newDossier);

      if (files.length > 0) {
        for (const file of files) {
          const fd = new FormData();
          fd.append("file", file);
          await api.post(`/dossiers/${newDossier.id}/attachments`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      nav(`/dossiers/${newDossier.id}`);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Tạo hồ sơ thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Tạo hồ sơ mới
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Stack spacing={2}>
          {err && <Alert severity="error" sx={{ py: 0.8 }}>{err}</Alert>}
          {created && (
            <Alert severity="success" sx={{ py: 0.8 }}>
              Đã tạo #{created.id} · <StatusChip status={created.status} />
            </Alert>
          )}

          <Grid container spacing={1.5}>
            {/* Thông tin hồ sơ */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} color="primary">
                Thông tin hồ sơ
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField label="Tiêu đề" fullWidth size="small" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField select label="Loại" fullWidth size="small" value={dossierTypeId} onChange={(e) => setDossierTypeId(e.target.value)}>
                <MenuItem value="1">Cấp đất</MenuItem>
                <MenuItem value="2">Chuyển nhượng</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Mô tả"
                multiline
                rows={1}
                fullWidth
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ "& .MuiInputBase-input": { py: 0.8 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField label="Đơn vị" fullWidth size="small" value={originUnitId} onChange={(e) => setOriginUnitId(e.target.value)} />
            </Grid>

            {/* Thông tin công dân */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ mt: 1 }}>
                Thông tin công dân
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Họ tên" fullWidth size="small" required value={citizenName} onChange={(e) => setCitizenName(e.target.value)} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="CCCD"
                fullWidth
                size="small"
                value={citizenIdentityNumber}
                onChange={(e) => setCitizenIdentityNumber(e.target.value)}
                sx={{ "& .MuiInputBase-input": { py: 0.8 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Điện thoại"
                fullWidth
                size="small"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                sx={{ "& .MuiInputBase-input": { py: 0.8 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Địa chỉ"
                fullWidth
                size="small"
                value={citizenAddress}
                onChange={(e) => setCitizenAddress(e.target.value)}
                sx={{ "& .MuiInputBase-input": { py: 0.8 } }}
              />
            </Grid>

            {/* === TÀI LIỆU ĐÍNH KÈM === */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ mt: 1 }}>
                Tài liệu đính kèm
              </Typography>

              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 0.5, fontSize: "0.85rem" }}
              >
                Chọn file
                <input hidden type="file" multiple onChange={handleFileChange} />
              </Button>

              {files.length > 0 && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                    Đã chọn {files.length} file
                  </Typography>

                  <Stack spacing={0.5}>
                    {files.map((file, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          bgcolor: "grey.50",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.82rem",
                        }}
                      >
                        <Typography variant="body2" noWrap>{file.name}</Typography>
                        <IconButton 
                          size="small" 
                          color="error"           // ← Tô đỏ button xóa
                          onClick={() => removeFile(i)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" size="small" onClick={() => nav("/dossiers")} disabled={busy}>
              Hủy
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={busy || !title.trim() || !citizenName.trim()}
            >
              {busy ? "Đang tạo..." : "Tạo hồ sơ"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}