import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { userRouter } from './controller/user.routes';
import { projectRouter } from './controller/project.routes';
import { teamRouter } from './controller/team.routes';
import { taskRouter } from './controller/task.routes';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { expressjwt } from 'express-jwt';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());

const jwtSecret = process.env.JWT_SECRET
app.use(
  expressjwt({
    secret: jwtSecret || 'default_secret', algorithms: ["HS256"]
  }).unless({
    path: ['/api-docs', /^\/api-docs\/.*/, '/users/add'],
  })
);

app.use(bodyParser.json());

app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projects API',
      version: '1.0.0',
      description: 'API for managing projects',
    },
  },
  apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/users', userRouter);
app.use('/teams', teamRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'Unauthorized Error', errorMessage: err.message });
  }
  else {
    res.status(400).json({ status: 'Application Error', errorMessage: err.message });
  }
});

app.listen(port || 3000, () => {
  console.log(`Back-end is running on port ${port}.`);
});
