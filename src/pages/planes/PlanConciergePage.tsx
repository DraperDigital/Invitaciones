import PlanLandingTemplate from './PlanLandingTemplate';
import { PLANS_LANDING_DATA } from './data/plansLandingData';

export default function PlanConciergePage() {
  return <PlanLandingTemplate data={PLANS_LANDING_DATA['concierge']} />;
}
