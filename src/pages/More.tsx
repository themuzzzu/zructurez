import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Settings, Info, Send, Calendar, MessagesSquare, Briefcase, SunMoon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";

export default function More() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Layout>
      <div className="container max-w-[1400px] py-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">{t("more")}</h1>

        <div className="space-y-4">
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base" 
              onClick={() => navigate("/profile")}
            >
              <User className="mr-3 h-5 w-5" />
              {t("profile")}
            </Button>
          )}

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/maps")}
          >
            <Map className="mr-3 h-5 w-5" />
            {t("maps")}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={toggleTheme}
          >
            <SunMoon className="mr-3 h-5 w-5" />
            {theme === "dark" ? t("light_mode") : t("dark_mode")}
          </Button>

          <Separator />

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-3 h-5 w-5" />
            {t("settings")}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/messaging")}
          >
            <MessagesSquare className="mr-3 h-5 w-5" />
            {t("messaging")}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/events")}
          >
            <Calendar className="mr-3 h-5 w-5" />
            {t("events")}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/jobs")}
          >
            <Briefcase className="mr-3 h-5 w-5" />
            {t("jobs")}
          </Button>

          <Separator />

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => window.open("mailto:support@zructures.com", "_blank")}
          >
            <Send className="mr-3 h-5 w-5" />
            {t("contact")}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-base" 
            onClick={() => navigate("/about")}
          >
            <Info className="mr-3 h-5 w-5" />
            {t("about")}
          </Button>

          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-base text-red-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t("logout")}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
