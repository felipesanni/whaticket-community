const { TicketNote, Ticket, User } = require("../models");

module.exports = {
  async list(req, res) {
    try {
      const { ticketId } = req.params;
      const notes = await TicketNote.findAll({
        where: { ticketId },
        include: [{ model: User, as: "user", attributes: ["id","name","email"] }],
        order: [["createdAt","ASC"]]
      });
      return res.json(notes);
    } catch (e) {
      console.error("notes:list", e.message);
      return res.status(500).json({ error: "Falha ao listar notas" });
    }
  },

  async create(req, res) {
    try {
      const { ticketId } = req.params;
      const { content } = req.body;
      if (!content || !content.trim()) return res.status(400).json({ error: "Conteúdo obrigatório" });

      // garante que o ticket existe
      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) return res.status(404).json({ error: "Ticket não encontrado" });

      const note = await TicketNote.create({
        ticketId: ticket.id,
        userId: req.user.id,
        content: content.trim()
      });

      const full = await TicketNote.findByPk(note.id, {
        include: [{ model: User, as: "user", attributes: ["id","name","email"] }]
      });

      return res.status(201).json(full);
    } catch (e) {
      console.error("notes:create", e.message);
      return res.status(500).json({ error: "Falha ao criar nota" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const note = await TicketNote.findByPk(id);
      if (!note) return res.status(404).json({ error: "Nota não encontrada" });

      // opcional: permitir apagar só a própria nota
      if (note.userId !== req.user.id && !req.user.profile || req.user.profile !== "admin") {
        // ajuste conforme seu controle de permissões
      }

      await note.destroy();
      return res.json({ ok: true });
    } catch (e) {
      console.error("notes:remove", e.message);
      return res.status(500).json({ error: "Falha ao remover nota" });
    }
  }
};
