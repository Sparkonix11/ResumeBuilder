const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resume = sequelize.define('Resume', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ResumeTemplates',
        key: 'id',
      },
    },
    customFontFamily: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customPrimaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customSecondaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selectedProjects: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('selectedProjects');
        return value ? value.split(',').map(Number) : [];
      },
      set(val) {
        this.setDataValue('selectedProjects', Array.isArray(val) ? val.join(',') : val);
      },
    },
    selectedWorkExperiences: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('selectedWorkExperiences');
        return value ? value.split(',').map(Number) : [];
      },
      set(val) {
        this.setDataValue('selectedWorkExperiences', Array.isArray(val) ? val.join(',') : val);
      },
    },
    selectedEducation: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('selectedEducation');
        return value ? value.split(',').map(Number) : [];
      },
      set(val) {
        this.setDataValue('selectedEducation', Array.isArray(val) ? val.join(',') : val);
      },
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

  return Resume;
};