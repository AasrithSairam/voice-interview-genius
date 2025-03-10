
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember = ({ name, role, image }: TeamMemberProps) => {
  return (
    <Card className="team-card">
      <CardContent className="p-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
          <img
            src={image}
            alt={name}
            className="relative w-full h-full object-cover rounded-full"
          />
        </div>
        <h3 className="text-xl font-semibold text-center mb-1">{name}</h3>
        <p className="text-sm text-center text-gray-500">{role}</p>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
