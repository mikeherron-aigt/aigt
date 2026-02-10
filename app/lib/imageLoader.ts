// Custom image loader for Netlify deployments
// This bypasses Next.js image optimization and returns the original URL
export default function imageLoader({ src }: { src: string }) {
  return src;
}
