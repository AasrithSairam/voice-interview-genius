
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/70 backdrop-blur-md rounded-lg shadow-xl border border-purple-100">
      <h3 className="text-xl font-medium text-center text-indigo-800">Set Google API Key</h3>
      <div className="flex flex-col space-y-3">
        <p className="text-sm text-gray-600">
          Enter your Google API key to enable the interview functionality.
        </p>
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google API key"
            className="pr-10 border-indigo-200 focus:border-indigo-400"
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Key className="mr-2 h-4 w-4" />
          Set Key
        </Button>
        <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100 mt-2">
          <p className="text-xs text-indigo-800">
            Your API key is stored locally in your browser and is not sent to our servers.
            You'll need a Google API key with Speech Recognition enabled.
          </p>
        </div>
      </div>
    </form>
  );
};

export default ApiKeyInput;
