interface CompactBreed {
  name: string;
  group: string;
  origin: string;
  size: string;
  weight: string;
  height: string;
  life: string;
  coat: string;
  colors: string;
  shedding: string;
  hypo: boolean;
  temperament: string;
  energy: string;
  trainability: string;
  barking: string;
  kids: number;
  dogs: number;
  cats: number;
  strangers: number;
  apartment: boolean;
  exercise: string;
  grooming: string;
  health: string;
  funFact: string;
  popularity: number;
}

const ratingWord = (n: number, kind: string) => {
  if (n >= 5) return `excellent with ${kind}`;
  if (n >= 4) return `generally great with ${kind}`;
  if (n >= 3) return `friendly with ${kind} when properly socialized`;
  if (n >= 2) return `cautious around ${kind} and benefits from careful introductions`;
  return `not naturally suited to ${kind} and requires expert handling around them`;
};

const energyDescriptor = (energy: string): string => {
  switch (energy) {
    case "Very High": return "near-tireless drive that demands serious daily outlets";
    case "High": return "strong daily energy that needs consistent, vigorous activity";
    case "Moderate": return "balanced energy — playful when invited, calm when at rest";
    case "Low": return "laid-back energy and a love of comfortable downtime";
    default: return "a balanced activity level";
  }
};

const trainabilityDescriptor = (tr: string): string => {
  switch (tr) {
    case "Easy": return "eager to learn and quick to pick up new commands";
    case "Moderate": return "trainable with patience, consistency, and motivating rewards";
    case "Challenging": return "intelligent but stubborn — they want to know why a request matters";
    case "Independent": return "highly independent thinkers that train best when work feels purposeful";
    default: return "responsive to thoughtful, consistent training";
  }
};

const barkingDescriptor = (bt: string): string => {
  switch (bt) {
    case "Rare": return "they rarely bark — a quiet companion in most households";
    case "Occasional": return "they bark occasionally, usually with reason";
    case "Frequent": return "they're vocal and quick to alert you to anything new";
    case "Vocal": return "they are highly vocal — expect baying, howling, or talkative chatter";
    default: return "their barking is moderate";
  }
};

const sizeContext = (size: string): string => {
  switch (size) {
    case "Small": return "Their compact size makes them easy to transport and accommodate, though it also means they can be fragile around very young children or large, rough-playing dogs.";
    case "Medium": return "Their medium build strikes a practical balance — sturdy enough for active families, manageable enough for most living situations.";
    case "Large": return "Their large size means everything from food bills to leash control matters; they're a real physical presence in the home.";
    case "Giant": return "Their giant stature reshapes daily life — from the size of their bed and crate to the cost of vet care and food.";
    default: return "";
  }
};

const groupContext = (group: string): string => {
  switch (group) {
    case "Sporting": return "the Sporting Group, originally bred to assist hunters with locating, flushing, or retrieving game";
    case "Hound": return "the Hound Group, developed to hunt by scent or sight with stamina and independent drive";
    case "Working": return "the Working Group, bred for guarding, pulling carts, and other demanding jobs that require physical and mental strength";
    case "Terrier": return "the Terrier Group, developed to dig out and dispatch vermin with bold, tenacious courage";
    case "Toy": return "the Toy Group, bred specifically as devoted human companions and lap dogs";
    case "Non-Sporting": return "the Non-Sporting Group, a diverse category of breeds that don't fit neatly into the other working classifications";
    case "Herding": return "the Herding Group, developed to control the movement of livestock through stamina, intelligence, and instinctive 'eye'";
    default: return `the ${group} Group`;
  }
};

const sheddingContext = (shedding: string, coat: string): string => {
  switch (shedding) {
    case "Very High":
      return `Expect heavy year-round shedding from their ${coat.toLowerCase()} coat with two intense "blowout" seasons each year — invest in a good vacuum and a deshedding tool.`;
    case "High":
      return `Their ${coat.toLowerCase()} coat sheds heavily; regular brushing and a quality vacuum are non-negotiable parts of life with this breed.`;
    case "Moderate":
      return `Their ${coat.toLowerCase()} coat sheds at a manageable level with consistent brushing.`;
    case "Low":
      return `Their ${coat.toLowerCase()} coat sheds very little, which suits owners who prefer a tidier home — though "low-shedding" never means "no maintenance."`;
    default:
      return `Their ${coat.toLowerCase()} coat sheds at a moderate level.`;
  }
};

const exerciseContext = (energy: string): string => {
  switch (energy) {
    case "Very High": return "At least 90 minutes of vigorous daily activity is the bare minimum — and ideally a job or sport to channel their drive.";
    case "High": return "Plan on 60+ minutes of meaningful daily activity, broken into multiple sessions if possible.";
    case "Moderate": return "Plan on 30–60 minutes of daily activity — enough to take the edge off and keep them content.";
    case "Low": return "Short daily walks plus light play are usually enough; over-exertion can do more harm than good.";
    default: return "Plan on regular daily activity matched to their stamina.";
  }
};

const groomingContext = (coat: string, grooming: string): string => {
  const base = `Coat care is centered on ${grooming.toLowerCase()}.`;
  switch (coat) {
    case "Long": return `${base} Long coats mat quickly without consistent attention; line-brushing weekly prevents painful tangles.`;
    case "Curly": return `${base} Curly coats need regular professional grooming and detangling between sessions to stay healthy.`;
    case "Wiry": return `${base} A proper wiry coat is hand-stripped every few months; clipping changes the texture and color over time.`;
    case "Double": return `${base} Never shave a double coat — it disrupts the breed's natural temperature regulation and rarely grows back correctly.`;
    case "Short": return `${base} Short coats are forgiving but still benefit from a weekly rubber-curry session for skin health.`;
    case "Medium": return `${base} A medium coat needs steady attention to feathering on the legs, chest, and tail to keep mats from forming.`;
    case "Hairless": return `${base} Hairless breeds need diligent skin care — sunscreen, moisturizer, and protection from temperature extremes.`;
    default: return base;
  }
};

const apartmentContext = (apt: boolean, energy: string): string => {
  if (apt) return "They can adapt to apartment living when their daily activity needs are met — but a tired dog is the real prerequisite, not square footage.";
  if (energy === "Very High" || energy === "High") return "They are not well-suited to apartment life. They thrive with a securely fenced yard and ready access to outdoor space.";
  return "They generally prefer a home with some outdoor space, though they can manage in larger apartments with committed daily exercise.";
};

const lifespanContext = (life: string): string => {
  const num = parseInt(life);
  if (num <= 8) return "Their relatively short lifespan means owners should commit to making every year count and budget for early-onset health monitoring.";
  if (num <= 11) return "Their lifespan is typical for a dog this size — expect a full decade or so of companionship with attentive care.";
  return "Their long lifespan means a 12-to-16-year commitment is realistic — a meaningful chapter of any owner's life.";
};

const sizeForOwner = (size: string): string => {
  switch (size) {
    case "Small": return "Apartment dwellers, seniors, and families with older (gentle) children";
    case "Medium": return "Active individuals or families with moderate space";
    case "Large": return "Households with space, strong handling skills, and a tolerance for a big physical presence";
    case "Giant": return "Experienced owners with significant space, strong physical handling ability, and the budget for outsized food and vet costs";
    default: return "Owners willing to learn this breed's specific needs";
  }
};

const sizeNotGoodFor = (size: string): string => {
  switch (size) {
    case "Small": return "Households where rough-and-tumble large dogs or very active toddlers might injure them";
    case "Medium": return "Owners looking for a tiny lap dog or a giant guardian";
    case "Large": return "Tiny apartments without easy outdoor access or owners who can't physically manage a strong dog on leash";
    case "Giant": return "First-time owners, small living spaces, or anyone underestimating the cost of feeding, vet care, and joint support";
    default: return "Owners unwilling to research this breed's specific needs";
  }
};

const groupOriginNarrative = (group: string, origin: string, name: string): string => {
  const groupRole: Record<string, string> = {
    Sporting: `tracking, flushing, and retrieving game alongside hunters in the field`,
    Hound: `pursuing quarry across distance using their nose, eyes, or both`,
    Working: `pulling, guarding, hauling, and protecting human livelihood`,
    Terrier: `going to ground after rats, foxes, and other vermin that threatened farms and homes`,
    Toy: `serving as devoted companion animals to royalty, merchants, and city dwellers alike`,
    "Non-Sporting": `filling a variety of specialized roles before joining the modern companion-dog landscape`,
    Herding: `moving and managing livestock through brains, instinct, and stamina`,
  };
  const role = groupRole[group] ?? `serving alongside humans in specific working roles`;
  return `The ${name}'s lineage traces back to ${origin}, where the breed was developed for ${role}. Centuries of selective work shaped the temperament, structure, and instincts you see in the breed today, and many of those original drives remain — even in dogs that will spend their lives as family companions.`;
};

export function generatePersonality(b: CompactBreed): string {
  const traits = b.temperament.split(",").map(s => s.trim()).filter(Boolean);
  const traitsList = traits.length > 1
    ? `${traits.slice(0, -1).join(", ")} and ${traits[traits.length - 1]}`
    : traits[0] ?? "well-rounded";
  const opener = `Owners who live with the ${b.name} consistently describe them as ${traitsList.toLowerCase()} — a personality shaped by generations of purposeful breeding.`;
  const energyLine = `In daily life this shows up as ${energyDescriptor(b.energy)}, paired with a temperament that is ${trainabilityDescriptor(b.trainability)}.`;
  const socialLine = `With family they are ${ratingWord(b.kids, "children")}, ${ratingWord(b.dogs, "other dogs")}, and ${ratingWord(b.strangers, "new people")}; ${barkingDescriptor(b.barking)}.`;
  const livingLine = apartmentContext(b.apartment, b.energy);
  const sizeLine = sizeContext(b.size);
  const closer = `Above all, the ${b.name} thrives when their physical and mental needs are taken seriously — under-stimulated, even the gentlest individuals can develop frustrating habits, while a well-exercised, mentally engaged ${b.name} is genuinely one of the best companions you can ask for.`;
  return [
    [opener, energyLine].join(" "),
    [socialLine, livingLine].join(" "),
    [sizeLine, closer].join(" "),
  ].join("\n\n");
}

export function generateHistory(b: CompactBreed): string {
  const origin = groupOriginNarrative(b.group, b.origin, b.name);
  const groupSentence = `As a member of ${groupContext(b.group)}, the ${b.name} carries hallmark traits of the group — visible in everything from how they move to how they read situations.`;
  const popLine = b.popularity <= 30
    ? `Today the ${b.name} ranks among the most popular breeds in America, a reflection of how well their working heritage has translated into modern family life.`
    : b.popularity <= 100
    ? `The ${b.name} sits in the middle of the popularity charts — well-known to dog enthusiasts but not so common that they've been over-bred by careless breeders.`
    : `The ${b.name} is one of the rarer breeds on the AKC roster, which means finding a responsible breeder takes more patience and travel — but also that the breed has avoided much of the damage done by mass-market puppy production.`;
  const factLine = `An often-cited piece of breed history: ${b.funFact}`;
  return [origin, [groupSentence, popLine].join(" "), factLine].join("\n\n");
}

export function generateLivingWith(b: CompactBreed): string {
  const exercise = exerciseContext(b.energy);
  const space = apartmentContext(b.apartment, b.energy);
  const social = `Within the household, expect a dog who is ${ratingWord(b.kids, "kids").replace("excellent with kids", "excellent with kids when both are taught to respect each other")} and ${ratingWord(b.cats, "cats")}.`;
  const noise = `On the noise front, ${barkingDescriptor(b.barking)} — important to factor in if you have close neighbors or work-from-home calls.`;
  const lifespan = lifespanContext(b.life);
  return [
    [exercise, space].join(" "),
    [social, noise].join(" "),
    lifespan,
  ].join("\n\n");
}

export function generateTrainingNotes(b: CompactBreed): string {
  const base = `${b.name}s are ${trainabilityDescriptor(b.trainability)}.`;
  const method = `Positive-reinforcement methods — food, play, and genuine praise — work far better than corrections; this breed in particular shuts down or grows resistant under harsh handling.`;
  const energyTip = b.energy === "Very High" || b.energy === "High"
    ? `Because of their ${b.energy.toLowerCase()} energy, training sessions are most productive after exercise, not before — a tired ${b.name} learns faster than a fresh one.`
    : `Their ${b.energy.toLowerCase()} energy means short, focused 10–15 minute training sessions yield the best results.`;
  const socialTip = `Early, frequent, and varied socialization between 8 and 16 weeks is critical, especially given their ${b.strangers >= 4 ? "naturally social" : "more reserved"} disposition toward strangers.`;
  const barkTip = b.barking === "Frequent" || b.barking === "Vocal"
    ? `Specifically work on a "quiet" cue from puppyhood — left untrained, this breed's vocal nature can become a real lifestyle issue.`
    : `Their generally measured vocalizations make impulse-control training easier than with more vocal breeds.`;
  return [base, method, energyTip, socialTip, barkTip].join(" ");
}

export function generateHealthCare(b: CompactBreed): string {
  const opener = `The ${b.name} has an average lifespan of ${b.life}, which is ${lifespanContext(b.life).toLowerCase()}`;
  const issues = `Breed-specific concerns to discuss with your vet include: ${b.health.toLowerCase()}. Reputable breeders screen breeding stock for these conditions, so always ask to see health clearances before committing to a puppy.`;
  const general = `Beyond breed-specific issues, follow the standards of good preventative care: a core vaccine schedule, year-round parasite prevention, regular dental cleaning, and an annual senior workup once your dog passes the midpoint of their expected lifespan.`;
  const sizeAdvice = b.size === "Giant" || b.size === "Large"
    ? `Large and giant breeds are particularly susceptible to bloat (gastric torsion); learn the symptoms, feed two smaller meals per day instead of one large meal, and consider a prophylactic gastropexy if your vet recommends it.`
    : b.size === "Small"
    ? `Small breeds are particularly prone to dental disease; daily brushing or a vet-approved dental routine is one of the highest-impact things you can do for their long-term health.`
    : `Watch their weight closely — even a few extra pounds shortens lifespan and worsens any joint or cardiac issues.`;
  return [opener, issues, [general, sizeAdvice].join(" ")].join("\n\n");
}

export function generateDietNotes(b: CompactBreed): string {
  const base = `Feed a high-quality, AAFCO-certified diet appropriate for the ${b.name}'s life stage and ${b.size.toLowerCase()} size.`;
  const energy = b.energy === "Very High" || b.energy === "High"
    ? `Active ${b.name}s burn meaningful calories — match portions to their actual workload, not generic feeding-chart numbers.`
    : `Because their energy level is ${b.energy.toLowerCase()}, it's easy for this breed to become overweight; measure portions and skip the constant treat-feeding.`;
  const sizing = b.size === "Giant" || b.size === "Large"
    ? `Large and giant breeds need a "large breed" puppy formula until growth completes (12–24 months) to support proper joint development.`
    : `Small breeds can be prone to hypoglycemia as puppies — multiple smaller meals per day during the first six months helps prevent it.`;
  return [base, energy, sizing].join(" ");
}

export function generateGroomingGuide(b: CompactBreed): string {
  const base = b.grooming;
  const detailed = groomingContext(b.coat, b.grooming);
  const shedding = sheddingContext(b.shedding, b.coat);
  const general = `Trim nails every 3–4 weeks, check ears weekly for redness or odor, and brush teeth daily or use vet-approved dental chews.`;
  return [base + ".", detailed, shedding, general].join(" ");
}

export function generateFunFacts(b: CompactBreed): string[] {
  const facts: string[] = [b.funFact];
  facts.push(`The ${b.name} originated in ${b.origin}, where the breed was developed for purposes that still influence their behavior today.`);
  facts.push(`As a ${b.group} Group breed, the ${b.name} shares structural and temperamental traits with other breeds developed for the same kind of work.`);
  if (b.hypo) {
    facts.push(`The ${b.name} is considered one of the lower-shedding breeds, which makes them a more workable choice for some allergy sufferers — though no dog is truly hypoallergenic.`);
  }
  const lifeNum = parseInt(b.life);
  if (!Number.isNaN(lifeNum)) {
    facts.push(`A typical ${b.name} lifespan is ${b.life} — meaning families should plan for that full commitment when bringing one home.`);
  }
  return facts.slice(0, 5);
}

export function generateMisconceptions(b: CompactBreed): string {
  const groupMisc: Record<string, string> = {
    Herding: `People assume any herding dog will "just adapt" to a sedentary household. They won't — under-stimulated herding breeds frequently develop nipping, spinning, and obsessive behaviors. They need a job, even a structured one like nose work or trick training.`,
    Working: `Working breeds are often mistaken for guard-only dogs or "tough" breeds suited to anyone strong. In reality they're sensitive, deeply bonded animals that suffer in homes that treat them as security equipment instead of family.`,
    Sporting: `Sporting breeds aren't automatically calm "family dogs." Field-bred lines especially carry serious drive and require real exercise — picking the wrong line for your lifestyle is a common mismatch.`,
    Hound: `Hounds are not stubborn or unintelligent — they're independent. Their nose or sight drives them, and traditional obedience methods built for biddable breeds simply work less well; they need motivation that competes with their hardwired instincts.`,
    Terrier: `Terriers are often misread as small lap dogs because of their size. In personality they're tenacious, prey-driven, and quick to react — closer to a working dog in a small package than a true companion-bred toy.`,
    Toy: `Toy breeds are not fragile decorations. Treating them like accessories produces neurotic, anxious, snappy adults. They are real dogs and need socialization, training, and exercise like any other breed.`,
    "Non-Sporting": `Because the Non-Sporting Group is so diverse, generalizations about them rarely hold. Each breed in this group has its own purpose and needs — assuming one Non-Sporting breed is like another is a setup for surprise.`,
  };
  const energyMisc = b.energy === "Very High" || b.energy === "High"
    ? `A daily walk around the block is not "exercise" for a high-energy breed like the ${b.name}. They need real, sustained activity that engages both body and brain.`
    : b.energy === "Low"
    ? `Low energy doesn't mean zero exercise. Even calm breeds need consistent walks and mental stimulation to stay healthy and balanced.`
    : `Don't assume a "moderate energy" label like the ${b.name}'s means a couch-potato dog — moderate-energy breeds still need consistent daily activity to stay balanced and prevent boredom-driven habits.`;
  const breedSpecific = `One specific point worth correcting about the ${b.name}: their ${b.origin} origin and ${b.group.toLowerCase()}-group heritage shape behavior in ways the casual observer often misses, including their reaction to ${b.health.toLowerCase().split(",")[0].trim()} risks and the level of socialization they actually need from puppyhood onward.`;
  return [groupMisc[b.group] ?? "", energyMisc, breedSpecific].filter(Boolean).join(" ");
}

export function generateIdealOwner(b: CompactBreed): string {
  const parts: string[] = [];
  parts.push(sizeForOwner(b.size) + ".");
  if (b.energy === "Very High" || b.energy === "High") {
    parts.push(`People with active lifestyles — runners, hikers, dog-sport enthusiasts — who can deliver daily, vigorous exercise.`);
  } else {
    parts.push(`Owners who want a steady companion without committing to high-octane daily workouts.`);
  }
  if (b.trainability === "Independent" || b.trainability === "Challenging") {
    parts.push(`Experienced dog owners comfortable with independent thinkers and patient enough to make training feel like partnership rather than command-and-obey.`);
  } else {
    parts.push(`First-time and seasoned owners alike, provided they commit to consistent positive-reinforcement training.`);
  }
  if (b.kids >= 4) parts.push(`Families with respectful children are usually a great fit.`);
  if (b.apartment) parts.push(`Adaptable enough for apartment living when daily exercise is non-negotiable.`);
  parts.push(`Above all, the ideal ${b.name} owner understands the breed's ${b.group.toLowerCase()}-group heritage from ${b.origin} and is prepared to honor those instincts with appropriate outlets, structure, and the kind of patient, daily commitment this breed deserves.`);
  return parts.join(" ");
}

export function generateNotGoodFor(b: CompactBreed): string {
  const parts: string[] = [];
  parts.push(sizeNotGoodFor(b.size) + ".");
  if (b.energy === "Very High" || b.energy === "High") {
    parts.push(`Sedentary households or owners who travel frequently without a plan for daily, vigorous exercise.`);
  } else if (b.energy === "Low") {
    parts.push(`Marathon trainers or anyone looking for a long-distance running partner.`);
  } else {
    parts.push(`Owners at the extremes — people who want a true couch potato or a tireless endurance athlete should look at breeds outside the moderate-energy range.`);
  }
  if (b.trainability === "Independent" || b.trainability === "Challenging") {
    parts.push(`Owners expecting instant obedience or unwilling to make training mutually motivating; this breed reads coercion as a reason to disengage.`);
  } else {
    parts.push(`Anyone who plans to skip foundational obedience entirely — even an "easy" breed needs structure to thrive.`);
  }
  if (b.barking === "Frequent" || b.barking === "Vocal") {
    parts.push(`Apartment dwellers in noise-restrictive buildings, or owners who need long stretches of quiet for work-from-home calls.`);
  }
  if (b.shedding === "Very High" || b.shedding === "High") {
    parts.push(`Owners who can't tolerate hair on furniture, clothing, and floors year-round.`);
  }
  if (b.kids <= 2) parts.push(`Households with very young or unsupervised children.`);
  parts.push(`Anyone unwilling to research the specific health risks common in the ${b.name} (notably ${b.health.toLowerCase().split(",").slice(0, 2).join(" and ").trim()}) and budget for the preventive care that follows.`);
  return parts.join(" ");
}

export function expandFully(b: CompactBreed) {
  return {
    personalityDeepDive: generatePersonality(b),
    history: generateHistory(b),
    livingWith: generateLivingWith(b),
    healthCareGuide: generateHealthCare(b),
    trainingNotes: generateTrainingNotes(b),
    dietNotes: generateDietNotes(b),
    groomingGuide: generateGroomingGuide(b),
    funFacts: generateFunFacts(b),
    commonMisconceptions: generateMisconceptions(b),
    idealOwnerProfile: generateIdealOwner(b),
    notGoodFor: generateNotGoodFor(b),
  };
}

export type { CompactBreed };
