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
  {
    id: "reassigned",
    name: "Reassigned",
    slot: "chest",
    description: "Tuer un ennemi : 1 munition spéciale aléatoire dans le pistolet.",
  },
  {
    id: "perfect-reassigned",
    name: "Perfect Reassigned",
    slot: "chest",
    description: "Tuer un ennemi : 1 munition spéciale aléatoire dans le pistolet. CD 8 s.",
    perfect: true,
  },
  {
    id: "perfect-unbreakable",
    name: "Perfect Unbreakable",
    slot: "chest",
    description:
      "Quand l'armure est détruite, répare 100% de l'armure. Recharge 60 s. Kit d'armure gratuit pendant 7 s.",
    perfect: true,
  },
  {
    id: "perfect-vanguard",
    name: "Perfect Vanguard",
    slot: "chest",
    description:
      "Déployer un bouclier : invulnérable 7 s et 60% de votre armure en bonus aux alliés (20 s). CD 60 s.",
    perfect: true,
  },
  {
    id: "perfect-headhunter",
    name: "Perfect Headhunter",
    slot: "chest",
    description:
      "Après un headshot, le prochain headshot dans les 5 s est amplifié (150% des dégâts du premier, plafonné).",
    perfect: true,
  },
  {
    id: "perfect-spark",
    name: "Perfect Spark",
    slot: "chest",
    description:
      "Détruire une compétence ennemie : +30% dégâts totaux d'arme et de compétence pendant 20 s.",
    perfect: true,
  },
  {
    id: "perfect-focus",
    name: "Perfect Focus",
    slot: "chest",
    description:
      "Rester à l'arrêt : +1,2% dégâts totaux d'arme par seconde, jusqu'à 12%. Bouger réinitialise.",
    perfect: true,
  },
  {
    id: "perfect-efficient",
    name: "Perfect Efficient",
    slot: "chest",
    description:
      "Utiliser un kit d'armure hors combat n'en consomme pas. En combat, +30% réparation de kit.",
    perfect: true,
  },
  {
    id: "perfect-braced",
    name: "Perfect Braced",
    slot: "chest",
    description: "En couverture : +50% maniement d'arme.",
    perfect: true,
  },
  {
    id: "perfect-intimidate",
    name: "Perfect Intimidate",
    slot: "chest",
    description: "À moins de 8 m, +40% dégâts totaux d'arme si vous avez de l'armure bonus.",
    perfect: true,
  },
  {
    id: "perfect-trauma",
    name: "Perfect Trauma",
    slot: "chest",
    description: "Headshot : applique saignement aux ennemis à 10 m. CD 12 s.",
    perfect: true,
  },
  {
    id: "perfect-skilled",
    name: "Perfect Skilled",
    slot: "chest",
    description: "Tuer avec une compétence : +25% dégâts de compétence pendant 15 s. Stacks jusqu'à 3.",
    perfect: true,
  },
  {
    id: "perfect-companion",
    name: "Perfect Companion",
    slot: "chest",
    description: "Allié ou compétence à moins de 5 m : +20% dégâts totaux d'arme.",
    perfect: true,
  },
  {
    id: "perfect-obliterate",
    name: "Perfect Obliterate",
    slot: "chest",
    description: "Les critiques augmentent les dégâts d'arme totaux de 1% pendant 5 s. 30 stacks max.",
    perfect: true,
  },
  {
    id: "perfect-gunslinger",
    name: "Perfect Gunslinger",
    slot: "chest",
    description: "Changer d'arme : +25% dégâts totaux d'arme pendant 8 s. CD 8 s.",
    perfect: true,
  },
  {
    id: "perfect-empathic-resolve",
    name: "Perfect Empathic Resolve",
    slot: "chest",
    description:
      "Réparer un allié : +3% à +20% dégâts totaux d'arme et de compétence pour lui pendant 10 s (selon palier).",
    perfect: true,
  },
  {
    id: "perfect-overwatch",
    name: "Perfect Overwatch",
    slot: "chest",
    description:
      "Rester en couverture 5 s : +15% dégâts totaux d'arme et de compétence pour vous et les alliés (15 s).",
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
  {
    id: "concussion",
    name: "Concussion",
    slot: "backpack",
    description:
      "Headshot : +15% dégâts totaux d'arme pendant 1,5 s (3 s au fusil de précision). Kill headshot : +10% pendant 10 s.",
  },
  {
    id: "perfect-concussion",
    name: "Perfect Concussion",
    slot: "backpack",
    description:
      "Headshot : +20% dégâts totaux d'arme pendant 1,5 s (5 s au fusil de précision). Kill headshot : +15% pendant 10 s.",
    perfect: true,
  },
  {
    id: "perfect-protector",
    name: "Perfect Protector",
    slot: "backpack",
    description:
      "Quand le bouclier prend des dégâts : +25% armure bonus, alliés +35% de votre armure pendant 3 s. CD 3 s.",
    perfect: true,
  },
  {
    id: "perfect-clutch",
    name: "Perfect Clutch",
    slot: "backpack",
    description:
      "Armure détruite : les critiques réparent 3,5% d'armure et les tirs 0,6% de santé pendant 5 s. CD 15 s.",
    perfect: true,
  },
  {
    id: "perfect-adrenaline-rush",
    name: "Perfect Adrenaline Rush",
    slot: "backpack",
    description: "Tuer à moins de 8 m : 25% armure bonus (max 50%). Dure 10 s.",
    perfect: true,
  },
  {
    id: "perfect-bloodsucker",
    name: "Perfect Bloodsucker",
    slot: "backpack",
    description: "Tuer : 12% armure bonus par ennemi proche, jusqu'à 60%. Dure 10 s.",
    perfect: true,
  },
  {
    id: "perfect-combined-arms",
    name: "Perfect Combined Arms",
    slot: "backpack",
    description: "Utiliser une compétence : +30% dégâts totaux d'arme pendant 10 s.",
    perfect: true,
  },
  {
    id: "perfect-tech-support",
    name: "Perfect Tech Support",
    slot: "backpack",
    description: "Tuer avec une compétence : +30% dégâts/réparation de compétence pendant 15 s.",
    perfect: true,
  },
  {
    id: "perfect-calculated",
    name: "Perfect Calculated",
    slot: "backpack",
    description: "Tuer avec une compétence : réduit toutes les recharges actives de 20%.",
    perfect: true,
  },
  {
    id: "perfect-shock-and-awe",
    name: "Perfect Shock and Awe",
    slot: "backpack",
    description: "Tuer avec une compétence : pulse les ennemis à 20 m pendant 8 s. CD 10 s.",
    perfect: true,
  },
  {
    id: "perfect-wicked",
    name: "Perfect Wicked",
    slot: "backpack",
    description: "Appliquer un statut : +21% dégâts totaux d'arme pendant 20 s.",
    perfect: true,
  },
  {
    id: "perfect-creeping-death",
    name: "Perfect Creeping Death",
    slot: "backpack",
    description: "Appliquer un statut : se propage à 12 m. CD 12 s.",
    perfect: true,
  },
  {
    id: "perfect-galvanize",
    name: "Perfect Galvanize",
    slot: "backpack",
    description: "Appliquer un statut : alliés à 20 m gagnent 50% armure bonus pendant 10 s.",
    perfect: true,
  },
  {
    id: "perfect-safeguard",
    name: "Perfect Safeguard",
    slot: "backpack",
    description: "Réparer un allié : +30% réparation reçue pendant 5 s.",
    perfect: true,
  },
  {
    id: "perfect-overclock",
    name: "Perfect Overclock",
    slot: "backpack",
    description:
      "Alliés à 15 m d'une compétence déployée : +30% vitesse de rechargement et −0,6 s de recharges actives par seconde.",
    perfect: true,
  },
  {
    id: "perfect-leadership",
    name: "Perfect Leadership",
    slot: "backpack",
    description:
      "Mouvement couverture à couverture : 20% de votre armure en bonus pour vous et les alliés (10 s). Triplé à moins de 10 m d'un ennemi. CD 10 s.",
    perfect: true,
  },
  {
    id: "perfect-versatile",
    name: "Perfect Versatile",
    slot: "backpack",
    description:
      "Arme 1 : +40% dégâts totaux d'arme à 15 m+. Arme 2 : +40% à moins de 15 m.",
    perfect: true,
  },
];

export const ALL_TALENTS: GearTalent[] = [...CHEST_TALENTS, ...BACKPACK_TALENTS];

export function talentsForSlot(slot: "chest" | "backpack"): GearTalent[] {
  return slot === "chest" ? CHEST_TALENTS : BACKPACK_TALENTS;
}
