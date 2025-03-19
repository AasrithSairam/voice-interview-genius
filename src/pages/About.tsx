
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TeamMember from "@/components/TeamMember";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            About Source Coders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn about our innovative AI-powered interview system and the team behind it.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="glass-panel p-8 rounded-xl border border-white/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Interview AI</h2>
            <p className="text-gray-600 mb-6">
              Experience our cutting-edge AI interviewer, designed to help candidates practice their 
              technical interview skills in a realistic setting. The system evaluates responses in 
              real-time, providing valuable feedback to improve your performance.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Interview AI
              </Button>
            </Link>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-white/20 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Project Purpose</h2>
            <p className="text-gray-600 mb-4">
              This project was developed to revolutionize technical interview preparation. Our AI-powered
              system helps candidates:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Practice answering technical questions with natural voice interaction</li>
              <li>Receive objective scoring and feedback on responses</li>
              <li>Build confidence through repeated interview simulations</li>
              <li>Prepare for real-world technical interviews in a stress-free environment</li>
            </ul>
            <p className="text-gray-600">
              Our mission is to make technical interview preparation accessible, effective, and engaging for everyone.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-indigo-800">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamMember 
              name="Lalit Chandran" 
              role="AI Integration Specialist" 
              image="/lovable-uploads/8993e372-9372-4702-a0aa-7a99603246b0.png" 
            />
            <TeamMember 
              name="Ponguru Aasrith Sairam" 
              role="Team Lead & Frontend Developer" 
              image="/lovable-uploads/40a683f9-8db3-496c-b2cd-9fdb51b5b43a.png" 
            />
            <TeamMember 
              name="Ravi Varman" 
              role="Data Analyst" 
              image="/lovable-uploads/04f876aa-b802-4ead-8d77-13c1d53f4bd8.png" 
            />
            <TeamMember 
              name="Muhammed Afshan" 
              role="Backend Developer" 
              image="/lovable-uploads/e092269b-eb3c-4390-bc07-34862b8d0bc5.png" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
