const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    techStack: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('techStack');
        return value ? value.split(',') : [];
      },
      set(val) {
        this.setDataValue('techStack', Array.isArray(val) ? val.join(',') : val);
      },
    },
    repoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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

  return Project;
};
