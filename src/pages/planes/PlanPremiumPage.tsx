import PlanLandingTemplate from './PlanLandingTemplate';
import { PLANS_LANDING_DATA } from './data/plansLandingData';

export default function PlanPremiumPage() {
  return <PlanLandingTemplate data={PLANS_LANDING_DATA['premium']} />;
}
