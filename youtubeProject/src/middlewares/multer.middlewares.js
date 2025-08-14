import multer from "multer";


// disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // we will change the file name latter
    cb(null, file.originalname);
  }
})

export const upload = multer({ storage })