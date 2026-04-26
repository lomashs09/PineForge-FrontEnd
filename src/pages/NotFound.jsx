import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Page Not Found"
        description="The page you're looking for doesn't exist on PineForge."
        path="/404"
        noindex
      />
      <Navbar />
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold text-emerald-400">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-gray-400">
          The page you're looking for has moved, been renamed, or never existed. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            Back to home
          </Link>
          <Link
            to="/blog"
            className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition"
          >
            Read the blog
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
