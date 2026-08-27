import type { GearTalent } from "../types";

export const CHEST_TALENTS: GearTalent[] = [
  {
    id: "glass-cannon",
    name: "Glass Cannon",
    slot: "chest",
    description: "Tous les dégâts infligés +25%. Tous les dégâts reçus +50%.",
  },
  {
    id: "obliterate",
    name: "Obliterate",
    slot: "chest",
    description: "Les critiques augmentent les dégâts d'arme totaux de 1% pendant 5 s. 25 stacks max.",
  },
  {
    id: "unbreakable",
    name: "Unbreakable",
    slot: "chest",
    description: "Quand l'armure est détruite, répare 95% de l'armure. Recharge 60 s.",
  },
  {
    id: "intimidate",
    name: "Intimidate",
    slot: "chest",
    description: "À moins de 8 m, +35% dégâts totaux d'arme si vous avez de l'armure bonus.",
  },
  {
    id: "spotter",
    name: "Spotter",
    slot: "chest",
    description: "+15% dégâts totaux d'arme et de compétence vs cibles pulsées.",
  },
  {
    id: "headhunter",
    name: "Headhunter",
    slot: "chest",
    description: "Après un headshot, le prochain headshot dans les 5 s est amplifié (125% des dégâts du premier, plafonné).",
  },
  {
    id: "kinetic-momentum",
    name: "Kinetic Momentum",
    slot: "chest",
    description: "Tuer avec une arme : +25% dégâts de compétence. Tuer avec une compétence : +25% dégâts d'arme. 10 s.",
  },
  {
    id: "spark",
    name: "Spark",
    slot: "chest",
    description: "Détruire une compétence ennemie : +25% dégâts totaux d'arme et de compétence pendant 20 s.",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    slot: "chest",
    description: "Déployer un bouclier : invulnérable 5 s et 45% de votre armure en bonus aux alliés (20 s). CD 60 s.",
  },
  {
    id: "focus",
    name: "Focus",
    slot: "chest",
    description: "Rester à l'arrêt : +1% dégâts totaux d'arme par seconde, jusqu'à 10%. Bouger réinitialise.",
  },
  {
    id: "efficient",
    name: "Efficient",
    slot: "chest",
    description: "Utiliser une armure kit hors combat n'en consomme pas. En combat, +20% réparation d'armure kit.",
  },
  {
    id: "braced",
    name: "Braced",
    slot: "chest",
    description: "En couverture : +40% maniement d'arme.",
  },
  {
    id: "mad-bomber",
    name: "Mad Bomber",
    slot: "chest",
    description: "Grenades à fragmentation. Tuer avec une grenade recharge une grenade.",
  },
  {
    id: "trauma",
    name: "Trauma",
    slot: "chest",
    description: "Headshot : applique saignement aux ennemis à 8 m. CD 15 s.",
  },
  {
    id: "wicked",
    name: "Wicked",
    slot: "chest",
    description: "Appliquer un statut : +18% dégâts totaux d'arme pendant 20 s.",
  },
  {
    id: "protector",
    name: "Protector",
    slot: "chest",
    description: "Allié à moins de 5 m prend des dégâts : vous gagnez 40% armure bonus pendant 5 s. CD 10 s.",
  },
  {
    id: "berserk",
    name: "Berserk",
    slot: "chest",
    description: "+2% dégâts totaux d'arme par 10% d'armure manquante, jusqu'à 20%.",
  },
  {
    id: "perfect-glass-cannon",
    name: "Perfect Glass Cannon",
    slot: "chest",
    description: "Tous les dégâts infligés +30%. Tous les dégâts reçus +60%.",
    perfect: true,
  },
];

export const BACKPACK_TALENTS: GearTalent[] = [
  {
    id: "vigilance",
    name: "Vigilance",
    slot: "backpack",
    description: "+25% dégâts totaux d'arme. Prendre des dégâts désactive le buff 4 s.",
  },
  {
    id: "adrenaline-rush",
    name: "Adrenaline Rush",
    slot: "backpack",
    description: "Tuer à moins de 8 m : 20% armure bonus (max 40%). Dure 10 s.",
  },
  {
    id: "bloodsucker",
    name: "Bloodsucker",
    slot: "backpack",
    description: "Tuer : 10% armure bonus par ennemi proche, jusqu'à 50%. Dure 10 s.",
  },
  {
    id: "companion",
    name: "Companion",
    slot: "backpack",
    description: "Allié ou compétence à moins de 5 m : +15% dégâts totaux d'arme.",
  },
  {
    id: "combined-arms",
    name: "Combined Arms",
    slot: "backpack",
    description: "Utiliser une compétence : +25% dégâts totaux d'arme pendant 8 s.",
  },
  {
    id: "opportunistic",
    name: "Opportunistic",
    slot: "backpack",
    description: "Toucher un ennemi : il subit +10% dégâts de toutes sources pendant 5 s.",
  },
  {
    id: "overwatch",
    name: "Overwatch",
    slot: "backpack",
    description: "Rester en couverture 5 s : +12% dégâts totaux d'arme et de compétence pour vous et les alliés (15 s).",
  },
  {
    id: "safeguard",
    name: "Safeguard",
    slot: "backpack",
    description: "Réparer un allié : +25% réparation reçue pendant 4 s.",
  },
  {
    id: "tech-support",
    name: "Tech Support",
    slot: "backpack",
    description: "Tuer avec une compétence : +25% dégâts/réparation de compétence pendant 15 s.",
  },
  {
    id: "unstoppable-force",
    name: "Unstoppable Force",
    slot: "backpack",
    description: "Tuer : +4% dégâts totaux d'arme pendant 15 s. 5 stacks max.",
  },
  {
    id: "versatile",
    name: "Versatile",
    slot: "backpack",
    description: "Arme 1 : +35% dégâts totaux d'arme à 15 m+. Arme 2 : +35% à moins de 15 m.",
  },
  {
    id: "galvanize",
    name: "Galvanize",
    slot: "backpack",
    description: "Appliquer un statut : alliés à 20 m gagnent 40% armure bonus pendant 10 s.",
  },
  {
    id: "clutch",
    name: "Clutch",
    slot: "backpack",
    description: "Armure détruite : les critiques réparent 3% d'armure et les tirs 0,5% de santé. 4 s, CD 15 s.",
  },
  {
    id: "creeping-death",
    name: "Creeping Death",
    slot: "backpack",
    description: "Appliquer un statut : se propage à 8 m. CD 15 s.",
  },
  {
    id: "tag-team",
    name: "Tag Team",
    slot: "backpack",
    description: "Toucher un ennemi avec une compétence : -5% recharge de toutes les compétences.",
  },
  {
    id: "perfect-vigilance",
    name: "Perfect Vigilance",
    slot: "backpack",
    description: "+25% dégâts totaux d'arme. Prendre des dégâts désactive le buff 3 s.",
    perfect: true,
  },
];

export const ALL_TALENTS: GearTalent[] = [...CHEST_TALENTS, ...BACKPACK_TALENTS];

export function talentsForSlot(slot: "chest" | "backpack"): GearTalent[] {
  return slot === "chest" ? CHEST_TALENTS : BACKPACK_TALENTS;
}
