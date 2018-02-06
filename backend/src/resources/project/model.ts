import * as Sequelize from 'sequelize';

export const initModel = (db: Sequelize.Sequelize) => {
  db.define<IProject, IProject>(
    'project',
    {
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      completed: {
        type: Sequelize.BOOLEAN
      }
    },
    {
      timestamps: true
    }
  );
  db.model('project').belongsTo(db.model('user'));
};
export interface IProject {
  id: number;
  name: string;
  description: string;
  status: string;
  completed: boolean;
  userId: number;
}
