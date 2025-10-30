-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Add a default user for existing bookings
INSERT INTO "User" ("email", "password", "firstName", "lastName", "updatedAt")
VALUES ('default@example.com', '$2b$10$8XHwXHwXHwXHwXHwXHwXH.9XHwXHwXHwXHwXHwXHwXHwXHwXHwXHw', 'Default', 'User', NOW());

-- First, add the userId column as nullable
ALTER TABLE "Booking" ADD COLUMN "userId" INTEGER;

-- Update existing bookings to use the default user
UPDATE "Booking" SET "userId" = (SELECT "id" FROM "User" WHERE "email" = 'default@example.com');

-- Now make the column required
ALTER TABLE "Booking" ALTER COLUMN "userId" SET NOT NULL;

-- Drop the old columns
ALTER TABLE "Booking" DROP COLUMN "firstName", DROP COLUMN "lastName";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
