import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const DocumentoLegal = sequelize.define("DocumentoLegal", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
    tableName: "documentos_legales"
});

export default DocumentoLegal;
