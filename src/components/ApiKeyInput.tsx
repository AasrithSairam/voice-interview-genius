
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    onApiKeySet(apiKey);
    localStorage.setItem('google_api_key', apiKey);
    
    toast({
      title: "Success",
      description: "API key has been set successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white/70 backdrop-blur-md rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-center">Set Google API Key</h3>
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">
          Enter your Google API key to enable the interview functionality.
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google API key"
            className="flex-1"
          />
          <Button type="submit">
            <Key className="mr-2 h-4 w-4" />
            Set Key
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Your API key is stored locally in your browser and is not sent to our servers.
        </p>
      </div>
    </form>
  );
};

export default ApiKeyInput;
