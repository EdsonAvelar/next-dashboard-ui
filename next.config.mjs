/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "images.pexels.com" },
            { hostname: "res.cloudinary.com" },
        ]
    }, api: {
        bodyParser: {
            sizeLimit: "5mb",
        },
    },
};

export default nextConfig;
