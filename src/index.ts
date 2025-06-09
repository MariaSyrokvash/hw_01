import express, { Response } from 'express';
import { db } from './db';
import { HttpStatus } from './constants/statuses';
import { PATH } from './constants/routes';
import { Video } from './types/videos';
import { TypedRequestBody, TypedRequestParams, TypedRequestParamsBody } from './types';
import { URIParamsVideoModel } from './models/videos/URIParamsCourseModel';
import { CreateInputModel } from './models/videos/CreateInputModel';
import { VALID_RESOLUTIONS } from './constants/video';
import { APIErrorResult } from './types/error';
import { UpdateVideoInputModel } from './models/videos/UpdateVideoInputModel';

const port = 3003;

const app = express();

app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

app.get(PATH.BASE.ROOT, (req, res: Response) => {
  res.json('Hello!');
});

app.get(PATH.VIDEOS.ROOT, (req, res: Response<Video[]>) => {
  res.json(db.videos);
});

app.get(PATH.VIDEOS.BY_ID, (req: TypedRequestParams<URIParamsVideoModel>, res: Response<Video>) => {
  const foundVideo = db.videos.find((v) => v.id === +req.params.id);
  if (!foundVideo) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.json(foundVideo);
});

app.post(
  PATH.VIDEOS.ROOT,
  (req: TypedRequestBody<CreateInputModel>, res: Response<Video | APIErrorResult>) => {
    const { title, author, availableResolutions } = req.body;

    const errors: { message: string; field: string }[] = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 40) {
      errors.push({
        message: 'Title is required and must not exceed 40 characters',
        field: 'title',
      });
    }

    if (!author || typeof author !== 'string' || author.trim().length === 0 || author.length > 20) {
      errors.push({
        message: 'Author is required and must not exceed 20 characters',
        field: 'author',
      });
    }

    if (
      !Array.isArray(availableResolutions) ||
      availableResolutions.length === 0 ||
      !availableResolutions.every((res) => VALID_RESOLUTIONS.includes(res))
    ) {
      errors.push({
        message: 'At least one valid resolution must be provided',
        field: 'availableResolutions',
      });
    }

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest_400).json({ errorsMessages: errors });
      return;
    }

    // TODO: add validation
    if (!title?.length) {
      res.sendStatus(HttpStatus.BadRequest_400);
      return;
    }

    const newVideo = {
      id: +new Date(),
      title: title,
      author: author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: availableResolutions,
    };

    db.videos.push(newVideo);

    res.status(HttpStatus.Created_201).json(newVideo);
  }
);

app.delete(PATH.VIDEOS.BY_ID, (req: TypedRequestParams<URIParamsVideoModel>, res: Response) => {
  const videoId = +req.params.id;
  const initialLength = db.videos.length;

  db.videos = db.videos.filter((v) => v.id !== videoId);

  if (db.videos.length === initialLength) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204); // Успешно удалено, но без тела
});

app.put(
  PATH.VIDEOS.BY_ID,
  (
    req: TypedRequestParamsBody<URIParamsVideoModel, UpdateVideoInputModel>,
    res: Response<Video | APIErrorResult>
  ) => {
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;
    const videoId = Number(req.params.id);

    const errors: { message: string; field: string }[] = [];

    // Валидация полей
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 40) {
      errors.push({
        message: 'Title is required and must not exceed 40 characters',
        field: 'title',
      });
    }

    if (!author || typeof author !== 'string' || author.trim().length === 0 || author.length > 20) {
      errors.push({
        message: 'Author is required and must not exceed 20 characters',
        field: 'author',
      });
    }

    if (
      !Array.isArray(availableResolutions) ||
      availableResolutions.length === 0 ||
      !availableResolutions.every((res) => VALID_RESOLUTIONS.includes(res))
    ) {
      errors.push({
        message: 'At least one valid resolution must be provided',
        field: 'availableResolutions',
      });
    }

    if (typeof canBeDownloaded !== 'boolean') {
      errors.push({ message: 'canBeDownloaded must be boolean', field: 'canBeDownloaded' });
    }

    if (
      minAgeRestriction !== null &&
      (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)
    ) {
      errors.push({
        message: 'minAgeRestriction must be null or an integer between 1 and 18',
        field: 'minAgeRestriction',
      });
    }

    if (!publicationDate || isNaN(Date.parse(publicationDate))) {
      errors.push({
        message: 'publicationDate must be a valid date-time string',
        field: 'publicationDate',
      });
    }

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest_400).json({ errorsMessages: errors });
      return;
    }

    const videoIndex = db.videos.findIndex((v) => v.id === videoId);
    if (videoIndex === -1) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const updatedVideo: Video = {
      ...db.videos[videoIndex],
      title: title.trim(),
      author: author.trim(),
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    };

    db.videos[videoIndex] = updatedVideo;
    res.status(HttpStatus.NoContent_204).send();
  }
);

app.delete('/testing/all-data', (req, res: Response) => {
  db.videos = [];
  res.sendStatus(HttpStatus.NoContent_204);
});

app
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on('error', (err) => {
    console.error('Failed to start server:', err);
  });

export { app };
