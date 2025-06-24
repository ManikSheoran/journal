import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#ffe3bb] via-[#B5FFFC] to-[#C2F0FC] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[80px] z-0 select-none pointer-events-none">
        ✨
      </span>

      <div className="text-center z-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#03A6A1] leading-tight mb-6 tracking-tight">
          Reflect. Grow. <br />
          Live Mindfully.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          Journee is your private AI-powered journal for tracking moods, setting
          intentions, and understanding yourself — all encrypted, all yours.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#03A6A1] hover:bg-[#028985] text-white font-semibold py-3 px-10 rounded-full text-lg shadow transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-white border border-[#03A6A1] text-[#03A6A1] hover:bg-[#D1FFFA] font-semibold py-3 px-10 rounded-full text-lg shadow transition-all"
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl w-full px-4 z-10">
        <Feature
          icon="📝"
          title="Smart Journaling"
          description="Guided prompts powered by AI to help you write and reflect."
        />
        <Feature
          icon="😊"
          title="Mood Insights"
          description="Track how you feel and uncover emotional patterns."
        />
        <Feature
          icon="🔒"
          title="End-to-End Privacy"
          description="All your thoughts are encrypted. You're in control."
        />
        <Feature
          icon="🤖"
          title="Mindful Assistant - Eeme"
          description="Daily tips, reminders, and support from your AI buddy."
        />
      </div>

      <p className="absolute bottom-4 text-center text-gray-500 text-xs w-full font-bold">
        &copy; {new Date().getFullYear()} Journee — Your thoughts, your journey.
      </p>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#F1F1F1] flex flex-col items-start gap-3">
    <div className="text-4xl">{icon}</div>
    <h3 className="text-lg font-semibold text-[#03A6A1]">{title}</h3>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export default Main;
