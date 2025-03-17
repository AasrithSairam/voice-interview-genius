
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember = ({ name, role, image }: TeamMemberProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="team-card">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"></div>
          <Avatar className="w-full h-full border-4 border-white shadow-lg">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-800">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="text-xl font-semibold text-center mb-1">{name}</h3>
        <p className="text-sm text-center text-gray-500">{role}</p>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
