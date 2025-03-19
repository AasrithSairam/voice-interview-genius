
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TeamMember from "@/components/TeamMember";
import { ArrowLeft, Video } from "lucide-react";
import FaceDetectionVideo from "@/components/FaceDetectionVideo";

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

        {/* Face Detection Section */}
        <div className="glass-panel p-8 rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-indigo-800">Live Interview Monitoring</h2>
            <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-sm">
              <Video className="h-4 w-4" />
              <span>Live Feed</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Our system uses advanced face detection to track engagement during interviews. 
              This helps ensure candidates maintain proper posture and attention throughout the process.
            </p>
            
            <FaceDetectionVideo />
            
            <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 mt-4">
              <p className="font-medium">Privacy Note:</p>
              <p>All video processing happens locally in your browser. No video data is sent to our servers or stored anywhere.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-indigo-800">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamMember 
              name="Ponguru Aasrith Sairam" 
              role="Team Lead & Frontend Developer" 
              image="/lovable-uploads/3c6a3aec-fecd-4eda-9a00-3f3ae12fe39c.png" 
            />
            <TeamMember 
              name="Lalit Chandran" 
              role="AI Integration Specialist" 
              image="/lovable-uploads/8d3df452-40b2-4157-94ef-b4f436add30d.png" 
            />
            <TeamMember 
              name="Ravi Varman" 
              role="Data Analyst" 
              image="/lovable-uploads/a6ce2894-a1e0-48e8-8ac3-7b4558b97dda.png" 
            />
            <TeamMember 
              name="Muhammed Afshan" 
              role="Backend Developer" 
              image="/lovable-uploads/f2af00c7-7007-43d2-b141-01b2bf7b2e2d.png" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
