import { Request } from 'express';

export type TypedRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>; // TODO: del

export type TypedRequestQuery<Q> = Request<{}, {}, {}, Q>;

export type TypedRequestParams<P> = Request<P, {}, {}, {}>;

export type TypedRequestBody<B> = Request<{}, {}, B, {}>;

export type TypedRequestParamsBody<P, B> = Request<P, {}, B, {}>;
