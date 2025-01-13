-- CreateTable
CREATE TABLE "CSVFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "file" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSVFile_pkey" PRIMARY KEY ("id")
);
