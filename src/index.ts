import express, { Response } from 'express';
import {
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestParamsBody,
  TypedRequestQuery,
} from './types';
import { db } from './db';
import { HttpStatus } from './constants/statuses';
import { ViewCourseModel } from './models/courses/ViewCourseModel';
import { QueryInputModel } from './models/courses/QueryInputModel';
import { CreateInputModel } from './models/courses/CreateInputModel';
import { UpdateInputModel } from './models/courses/UpdateInputModel';
import { URIParamsCourseModel } from './models/courses/URIParamsCourseModel';

import { getViewCourseModel } from './utils';

const port = 3000;

const app = express();

app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

app.get('/courses', (req: TypedRequestQuery<QueryInputModel>, res: Response<ViewCourseModel[]>) => {
  const queryTitle = req.query.title || '';
  const filteredCourses = db.courses.filter((c) => c.title.includes(queryTitle));

  const mappedCourses: ViewCourseModel[] = filteredCourses.map(getViewCourseModel);
  res.send(mappedCourses);
});

app.get(
  '/courses/:id',
  (req: TypedRequestParams<URIParamsCourseModel>, res: Response<ViewCourseModel>) => {
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const mappedCourse = getViewCourseModel(foundCourse);
    res.json(mappedCourse);
  }
);

app.post('/courses', (req: TypedRequestBody<CreateInputModel>, res: Response<ViewCourseModel>) => {
  const bodyTitle = req.body.title?.toString();
  if (!bodyTitle?.length) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const newCourse = {
    id: +new Date(),
    title: bodyTitle,
    studentsCount: 0,
  };

  db.courses.push(newCourse);

  const mappedNewCourse = getViewCourseModel(newCourse);
  res.status(HttpStatus.Created_201).json(mappedNewCourse);
});

app.delete('/courses/:id', (req: TypedRequestParams<URIParamsCourseModel>, res: Response) => {
  const courseId = +req.params.id;
  const initialLength = db.courses.length;

  db.courses = db.courses.filter((c) => c.id !== courseId);

  if (db.courses.length === initialLength) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204); // Успешно удалено, но без тела
});

app.put(
  '/courses/:id',
  (
    req: TypedRequestParamsBody<URIParamsCourseModel, UpdateInputModel>,
    res: Response<ViewCourseModel>
  ) => {
    if (!req.body.title) {
      res.sendStatus(400);
      return;
    }
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    foundCourse.title = req.body.title;

    const mappedFoundCourse = getViewCourseModel(foundCourse);

    res.status(HttpStatus.Ok_200).json(mappedFoundCourse);
  }
);

app.delete('/__test__/db', (req, res: Response) => {
  db.courses = [];
  res.sendStatus(HttpStatus.NoContent_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app };
