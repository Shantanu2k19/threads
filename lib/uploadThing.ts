// Resource: https://docs.uploadthing.com/api-reference/react#generatereacthelpers
//https://docs.uploadthing.com/getting-started/appdir
// Copy paste (be careful with imports)

import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();