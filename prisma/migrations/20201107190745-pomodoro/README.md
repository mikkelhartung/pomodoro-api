# Migration `20201107190745-pomodoro`

This migration has been generated by Mikkel Hartung at 11/7/2020, 8:07:45 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
Begin;
CREATE TYPE "public"."PomodoroStatus_new" AS ENUM ('STARTED', 'PAUSE', 'STOPPED');
ALTER TABLE "public"."User" ALTER COLUMN "status" TYPE "PomodoroStatus_new" USING ("status"::text::"PomodoroStatus_new");
ALTER TYPE "PomodoroStatus" RENAME TO "PomodoroStatus_old";
ALTER TYPE "PomodoroStatus_new" RENAME TO "PomodoroStatus";
DROP TYPE "PomodoroStatus_old";
Commit

CREATE TABLE "public"."User" (
"id" SERIAL,
"email" text   NOT NULL ,
"name" text   NOT NULL ,
"status" "PomodoroStatus"  NOT NULL DEFAULT E'STOPPED',
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201107190745-pomodoro
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,25 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id      Int      @default(autoincrement()) @id
+  email   String   @unique
+  name    String
+  status  PomodoroStatus @default(STOPPED)
+}
+
+
+enum PomodoroStatus {
+  STARTED
+  PAUSE
+  STOPPED
+}
```


