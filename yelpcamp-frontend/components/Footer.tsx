export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-secondary-300">
          &copy; {new Date().getFullYear()} YelpCamp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
