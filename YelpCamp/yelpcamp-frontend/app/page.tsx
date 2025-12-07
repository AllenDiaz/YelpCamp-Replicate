import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
          YelpCamp
        </h1>
        
        <p className="text-xl md:text-2xl mb-4 text-gray-300">
          Welcome to YelpCamp!
        </p>
        
        <p className="text-lg md:text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
          Jump right in and explore our many campgrounds. <br />
          Feel free to share some of your own and comment on others!
        </p>
        
        <Link
          href="/campgrounds"
          className="inline-block px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg hover:bg-gray-200 transition shadow-lg"
        >
          View Campgrounds
        </Link>
      </div>
    </div>
  );
}
