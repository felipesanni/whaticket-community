'use strict';
module.exports = (sequelize, DataTypes) => {
  const TicketNote = sequelize.define('TicketNote', {
    content: { type: DataTypes.TEXT, allowNull: false }
  }, { tableName: 'TicketNotes' });

  TicketNote.associate = (models) => {
    TicketNote.belongsTo(models.Ticket, { as: 'ticket', foreignKey: 'ticketId' });
    TicketNote.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return TicketNote;
};
