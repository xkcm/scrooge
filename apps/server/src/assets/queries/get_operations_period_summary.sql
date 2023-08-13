SELECT
  o.type,
  SUM(o.amount),
  DATE_TRUNC('day', o."createdAt")
FROM
  "Operation" o
GROUP BY
  DATE_TRUNC('day', o."createdAt"),
  o.type
ORDER BY
  DATE_TRUNC('day', o."createdAt") DESC;