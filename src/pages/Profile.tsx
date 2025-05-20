
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, Profile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setIsEditing(false);
      setFormData({});
    } else {
      // Start editing with current values
      setIsEditing(true);
      setFormData({
        username: profile?.username || "",
        full_name: profile?.full_name || "",
        bio: profile?.bio || ""
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result) {
      setIsEditing(false);
    }
  };
  
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return profile?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.username || "User"} />
                ) : (
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                )}
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-semibold">{profile.full_name || profile.username || "User"}</h2>
                {profile.username && profile.username !== profile.full_name && (
                  <p className="text-gray-500">@{profile.username}</p>
                )}
              </div>
            </div>
            
            <Card>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username"
                        name="username"
                        value={formData.username || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name"
                        name="full_name"
                        value={formData.full_name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.bio ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="mt-1">{profile.bio}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No bio provided</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleEditToggle}>Edit Profile</Button>
                  </CardFooter>
                </>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Details about your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{new Date(profile.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p>You need to be signed in to view your profile.</p>
            <Button className="mt-4" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
