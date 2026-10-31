import GenderPage from "@/components/GenderPage";

const config = {
  gender: "MEN",
  heroTitle: ["BUILT", "TO MOVE."],
  intro:
    "Performance-led essentials for training, movement and the life beyond it.",
  heroImage: "/images/collections/men.jpeg",
  heroAlt: "Athlete walking through a column of light in a concrete hall",
  featuredLabel: "Core Performance",
  featuredTitle: ["ENGINEERED", "FOR MOTION."],
  featuredCopy:
    "A focused approach to men's activewear. Clean lines, technical intent and movement-first design.",
  featuredImage: "/images/campaigns/aeroflextee.jpeg",
  featuredAlt: "Athlete standing in a brutalist courtyard wearing the Aeroflex Tee",
  shopHref: "/shop?gender=MEN",
  principlesTitle: ["MADE", "WITH PURPOSE."],
  principlesCopy: "Every element has a purpose. Nothing added without reason.",
  principles: [
    {
      title: "PRECISION",
      text: "Clean construction and considered silhouettes built around unrestricted movement.",
    },
    {
      title: "FUNCTION",
      text: "Performance-led pieces designed to move naturally through training and everyday life.",
    },
    {
      title: "RESTRAINT",
      text: "A focused visual language where technical purpose never overwhelms the form.",
    },
  ],
  closingTitle: ["MOVE", "WITH INTENT."],
  closingCopy: "Technical layers and refined essentials, designed to work as one system.",
};

export default function MenPage() {
  return <GenderPage config={config} />;
}
