import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function ChangePasswordPage() {
  const nav = useNavigate();
  const { me, refresh } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const forced = Boolean(me?.must_change_password);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Đổi mật khẩu
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {forced ? "Tài khoản này cần đổi mật khẩu trước khi tiếp tục." : "Bạn có thể đổi mật khẩu bất cứ lúc nào."}
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {err ? <Alert severity="error">{err}</Alert> : null}
          <TextField
            label="Mật khẩu cũ"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Tối thiểu 6 ký tự"
            fullWidth
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setErr(null);
                try {
                  await api.post("/auth/change-password", {
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirm,
                  });
                  await refresh();
                  nav("/inbox");
                } catch (e: any) {
                  setErr(e?.response?.data?.detail ?? e?.message ?? "Đổi mật khẩu thất bại");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Lưu
            </Button>
            <Button variant="outlined" disabled={busy || forced} onClick={() => nav(-1)}>
              Hủy
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}


