import Layout from "@/components/layout/Layout";
import { useAppStore } from "@/store/productionStore";
import Dashboard from "@/pages/Dashboard";
import BallMilling from "@/pages/BallMilling";
import SprayDrying from "@/pages/SprayDrying";
import PressForming from "@/pages/PressForming";
import Glazing from "@/pages/Glazing";
import KilnFiring from "@/pages/KilnFiring";
import Polishing from "@/pages/Polishing";
import GradingPackaging from "@/pages/GradingPackaging";
import BatchTracking from "@/pages/BatchTracking";
import QualityAnalysis from "@/pages/QualityAnalysis";

export default function App() {
  const { activeModule } = useAppStore();

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "ball-milling":
        return <BallMilling />;
      case "spray-drying":
        return <SprayDrying />;
      case "press-forming":
        return <PressForming />;
      case "glazing":
        return <Glazing />;
      case "kiln-firing":
        return <KilnFiring />;
      case "polishing":
        return <Polishing />;
      case "grading-packaging":
        return <GradingPackaging />;
      case "batch-tracking":
        return <BatchTracking />;
      case "quality-analysis":
        return <QualityAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderModule()}</Layout>;
}
