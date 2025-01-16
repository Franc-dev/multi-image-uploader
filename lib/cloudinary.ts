import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dunssu2gi',
  api_key: '159354261577733',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

