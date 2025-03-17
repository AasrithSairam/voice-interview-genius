
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Laptop } from "lucide-react";
import TeamMember from "@/components/TeamMember";

const About = () => {
  const teamMembers = [
    {
      name: "Lalit Chandran",
      role: "Team Lead & Frontend Developer",
      image: "/lovable-uploads/a6ce2894-a1e0-48e8-8ac3-7b4558b97dda.png",
    },
    {
      name: "Ponguru Aasrith Sairam",
      role: "Backend Developer",
      image: "/lovable-uploads/f2af00c7-7007-43d2-b141-01b2bf7b2e2d.png",
    },
    {
      name: "Ravi Varman",
      role: "UI/UX Designer",
      image: "/lovable-uploads/3c6a3aec-fecd-4eda-9a00-3f3ae12fe39c.png",
    },
    {
      name: "Muhammed Afshan",
      role: "AI Integration Specialist",
      image: "/lovable-uploads/8d3df452-40b2-4157-94ef-b4f436add30d.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            About Interview AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal interview preparation assistant powered by artificial intelligence
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <Link to="/" className="w-full">
            <div className="h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 flex flex-col items-center justify-center border border-indigo-100">
              <Laptop className="w-16 h-16 text-indigo-600 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Try Interview AI</h2>
              <p className="text-center text-gray-600 mb-6">
                Practice your interview skills with our AI-powered interview simulator. 
                Get instant feedback and improve your chances of landing your dream job.
              </p>
              <Button className="mt-auto group">
                Go to Interview
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Link>

          <div className="h-full bg-white rounded-xl shadow-lg p-8 flex flex-col border border-indigo-100">
            <Users className="w-16 h-16 text-indigo-600 mb-6 self-center" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Project Purpose</h2>
            <p className="text-gray-600 mb-6">
              The Interview AI project was developed to address the challenges faced by job seekers
              when preparing for interviews. Our team recognized that many candidates struggle with
              interview anxiety and lack of practice opportunities.
            </p>
            <p className="text-gray-600 mb-6">
              By leveraging artificial intelligence and natural language processing, we've created
              a tool that simulates real interview scenarios, provides instant feedback, and helps
              users build confidence through repeated practice.
            </p>
            <p className="text-gray-600 mb-auto">
              Our mission is to democratize interview preparation and help job seekers showcase
              their true potential regardless of their background or experience level.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
