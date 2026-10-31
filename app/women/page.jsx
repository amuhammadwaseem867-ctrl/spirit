import GenderPage from "@/components/GenderPage";

const config = {
  gender: "WOMEN",
  heroTitle: ["MOVE", "FREELY."],
  intro:
    "Refined activewear designed around the body, movement and the rhythm of everyday life.",
  heroImage: "/images/collections/performance.jpeg",
  heroAlt: "Athlete in a technical jacket walking through a concrete atrium",
  featuredLabel: "Form / Performance",
  featuredTitle: ["DESIGNED", "TO FOLLOW."],
  featuredCopy:
    "Performance-led silhouettes shaped around natural movement. Refined enough for everyday wear, purposeful enough for training.",
  featuredImage: "/images/campaigns/legging.jpeg",
  featuredAlt: "Athlete walking along a concrete corridor in the Form Legging",
  shopHref: "/shop?gender=WOMEN",
  principlesTitle: ["FORM", "IN MOTION."],
  principlesCopy: "Designed around movement. Refined around the body.",
  principles: [
    {
      title: "FLUIDITY",
      text: "Silhouettes designed to follow the body naturally through every range of movement.",
    },
    {
      title: "PRECISION",
      text: "Considered construction where proportion, comfort and function work as one.",
    },
    {
      title: "VERSATILITY",
      text: "Performance essentials created to move seamlessly from training into everyday life.",
    },
  ],
  closingTitle: ["FIND", "YOUR FLOW."],
  closingCopy: "One continuous wardrobe — from the first rep to the walk home.",
};

export default function WomenPage() {
  return <GenderPage config={config} />;
}
