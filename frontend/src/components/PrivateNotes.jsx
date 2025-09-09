import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, TextField, Button, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export default function PrivateNotes({ ticketId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const load = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/notes`);
    setNotes(data);
  };

  const add = async () => {
    const t = text.trim();
    if (!t) return;
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets/${ticketId}/notes`, { content: t });
    setText("");
    await load();
  };

  const remove = async (id) => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tickets/notes/${id}`);
    await load();
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ticketId]);

  return (
    <Paper style={{ padding: 12, marginTop: 8, background: "#f7f7ff" }}>
      <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
        Notas particulares (visíveis só para atendentes)
      </Typography>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TextField
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escreva uma nota interna…"
          fullWidth
          variant="outlined"
          size="small"
        />
        <Button onClick={add} color="primary" variant="contained">Adicionar</Button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {notes.map(n => (
          <Paper key={n.id} style={{ padding: 8, background: "#fffef0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>{n.content}</Typography>
              <Typography variant="caption" color="textSecondary">
                {n.user?.name || "Usuário"} • {new Date(n.createdAt).toLocaleString()}
              </Typography>
            </div>
            <IconButton size="small" onClick={() => remove(n.id)} aria-label="Excluir">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
        {notes.length === 0 && (
          <Typography variant="caption" color="textSecondary">Nenhuma nota ainda.</Typography>
        )}
      </div>
    </Paper>
  );
}
