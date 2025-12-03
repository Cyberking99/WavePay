import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";
import { USER, ROUTES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  const [profile, setProfile] = useState({
    fullName: USER?.fullName,
    username: USER?.username,
    walletAddress: USER?.address,
    email: USER?.userDetails?.email,
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  const handleDisconnect = () => {
    toast.success("Wallet disconnected");
    disconnect();
    navigate(ROUTES.AUTH);
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{profile.fullName}</p>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full gradient-primary hover:opacity-90 transition-smooth"
          >
            <User className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Wallet</CardTitle>
          <CardDescription>Your connected blockchain wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <code className="flex-1 text-sm overflow-x-auto">{profile.walletAddress}</code>
          </div>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
