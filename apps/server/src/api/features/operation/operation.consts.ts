import { OperationShape } from "./services/operation.service.types.js";

export const PUBLIC_OPERATION_SHAPE = {
  id: true,
  createdAt: true,
  amount: true,
  tags: true,
  title: true,
  description: true,
  type: true,
} satisfies OperationShape;

export const LATEST_OPERATION_SHAPE = {
  id: true,
  title: true,
  amount: true,
  createdAt: true,
  type: true,
  tags: true,
} satisfies OperationShape;
