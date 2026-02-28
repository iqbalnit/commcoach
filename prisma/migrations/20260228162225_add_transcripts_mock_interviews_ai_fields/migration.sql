-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "scenarioTitle" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "elapsedSeconds" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "fillerCount" INTEGER NOT NULL DEFAULT 0,
    "hasNumbers" BOOLEAN NOT NULL DEFAULT false,
    "wpm" INTEGER,
    "pauseCount" INTEGER,
    "speechRatio" REAL,
    "aiAnalysis" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transcript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MockInterview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "roleLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "messages" TEXT NOT NULL DEFAULT '[]',
    "totalTurns" INTEGER NOT NULL DEFAULT 0,
    "overallScore" INTEGER,
    "finalSummary" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MockInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scenariosCompleted" TEXT NOT NULL DEFAULT '[]',
    "frameworksViewed" TEXT NOT NULL DEFAULT '[]',
    "principlesViewed" TEXT NOT NULL DEFAULT '[]',
    "quizHighScore" INTEGER NOT NULL DEFAULT 0,
    "practiceSessionCount" INTEGER NOT NULL DEFAULT 0,
    "totalPracticeMinutes" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastPracticeDate" DATETIME,
    "storytellingModulesViewed" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Progress" ("frameworksViewed", "id", "lastPracticeDate", "practiceSessionCount", "principlesViewed", "quizHighScore", "scenariosCompleted", "streakDays", "totalPracticeMinutes", "updatedAt", "userId") SELECT "frameworksViewed", "id", "lastPracticeDate", "practiceSessionCount", "principlesViewed", "quizHighScore", "scenariosCompleted", "streakDays", "totalPracticeMinutes", "updatedAt", "userId" FROM "Progress";
DROP TABLE "Progress";
ALTER TABLE "new_Progress" RENAME TO "Progress";
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "companiesRelevant" TEXT NOT NULL DEFAULT '[]',
    "questionTypes" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "strengthScore" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" DATETIME,
    "notes" TEXT NOT NULL DEFAULT '',
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "sourceType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("action", "category", "companiesRelevant", "createdAt", "id", "impact", "lastPracticed", "notes", "questionTypes", "result", "situation", "strengthScore", "tags", "task", "title", "updatedAt", "userId") SELECT "action", "category", "companiesRelevant", "createdAt", "id", "impact", "lastPracticed", "notes", "questionTypes", "result", "situation", "strengthScore", "tags", "task", "title", "updatedAt", "userId" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Transcript_userId_createdAt_idx" ON "Transcript"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Transcript_userId_scenarioId_idx" ON "Transcript"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "MockInterview_userId_startedAt_idx" ON "MockInterview"("userId", "startedAt");
