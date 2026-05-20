import PlanLandingTemplate from './PlanLandingTemplate';
import { PLANS_LANDING_DATA } from './data/plansLandingData';

export default function PlanProPage() {
  return <PlanLandingTemplate data={PLANS_LANDING_DATA['pro']} />;
}
