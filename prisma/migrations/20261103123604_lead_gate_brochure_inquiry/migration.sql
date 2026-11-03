-- AlterEnum
ALTER TYPE "InquiryType" ADD VALUE 'BROCHURE';

-- AlterTable
ALTER TABLE "Inquiry" ALTER COLUMN "email" DROP NOT NULL;
