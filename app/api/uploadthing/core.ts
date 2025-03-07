import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  csvUploader: f({ "text/csv": { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Rate limit the upload
      // const ip = req.ip ?? "127.0.0.1"
      // const { success } = await ratelimit.limit(ip)

      // if (!success) {
      //   throw new UploadThingError("Rate limit exceeded")
      // }

      // This code runs on your server before upload
      const user = await auth.api.getSession({
        headers: headers()
      })

      // If you throw, the user will not be able to upload
      if (!user?.user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)

      console.log("file url", file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  sliderImage: f({
    image: { maxFileSize: "32MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: headers()
      })

      if (!session?.user) throw new UploadThingError("Unauthorized")

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Slider image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),

  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 }
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: headers()
      })

      if (!session?.user) throw new UploadThingError("Unauthorized")

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter