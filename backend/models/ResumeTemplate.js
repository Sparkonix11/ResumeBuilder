const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResumeTemplate = sequelize.define('ResumeTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    layout: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fontFamily: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Arial, sans-serif',
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#000000',
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#4A90E2',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return ResumeTemplate;
};