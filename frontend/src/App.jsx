import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto mt-6 px-4">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
