import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import { useState, useEffect, useMemo } from "react";
import {
  Dog,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Share2,
  Pencil,
  Scale,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Breed } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  id: string;
  text: string;
  shortLabel: (value: string) => string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: "living",
    text: "What is your living situation?",
    shortLabel: (v) =>
      ({ apartment: "live in an apartment", "small-yard": "have a small yard", "large-yard": "have a large yard", rural: "live on rural property" }[v] || v),
    options: [
      { label: "Apartment or condo", value: "apartment" },
      { label: "House with small yard", value: "small-yard" },
      { label: "House with large yard", value: "large-yard" },
      { label: "Rural property", value: "rural" },
    ],
  },
  {
    id: "activity",
    text: "How active is your lifestyle?",
    shortLabel: (v) =>
      ({ low: "prefer low-energy dogs", moderate: "want a moderately active dog", high: "want a high-energy dog", "very-high": "want a workout partner" }[v] || v),
    options: [
      { label: "Mostly sedentary — I prefer relaxing at home", value: "low" },
      { label: "Moderately active — daily walks and some outdoor time", value: "moderate" },
      { label: "Very active — I run, hike, or exercise regularly", value: "high" },
      { label: "Extremely active — I want a workout partner", value: "very-high" },
    ],
  },
  {
    id: "size",
    text: "What size dog do you prefer?",
    shortLabel: (v) =>
      ({ Small: "want a small dog", Medium: "want a medium dog", Large: "want a large dog", Giant: "want a giant dog", any: "have no size preference" }[v] || v),
    options: [
      { label: "Small (under 25 lbs)", value: "Small" },
      { label: "Medium (25-60 lbs)", value: "Medium" },
      { label: "Large (60-100 lbs)", value: "Large" },
      { label: "Giant (100+ lbs)", value: "Giant" },
      { label: "No preference", value: "any" },
    ],
  },
  {
    id: "kids",
    text: "Do you have children at home?",
    shortLabel: (v) =>
      ({ young: "have young children", older: "have older children", teens: "have teenagers", none: "don't have children at home" }[v] || v),
    options: [
      { label: "Yes, young children (under 6)", value: "young" },
      { label: "Yes, older children (6-12)", value: "older" },
      { label: "Teenagers", value: "teens" },
      { label: "No children", value: "none" },
    ],
  },
  {
    id: "experience",
    text: "How experienced are you with dogs?",
    shortLabel: (v) =>
      ({ beginner: "are a first-time dog owner", intermediate: "have some experience with dogs", advanced: "are a very experienced dog owner" }[v] || v),
    options: [
      { label: "First-time dog owner", value: "beginner" },
      { label: "Some experience with dogs", value: "intermediate" },
      { label: "Very experienced dog owner", value: "advanced" },
    ],
  },
  {
    id: "grooming",
    text: "How much time can you spend on grooming?",
    shortLabel: (v) =>
      ({ low: "want a low-maintenance coat", moderate: "are fine with weekly brushing", high: "don't mind daily grooming" }[v] || v),
    options: [
      { label: "Minimal — low-maintenance preferred", value: "low" },
      { label: "Weekly brushing is fine", value: "moderate" },
      { label: "I don't mind daily grooming", value: "high" },
    ],
  },
  {
    id: "shedding",
    text: "How do you feel about shedding?",
    shortLabel: (v) =>
      ({ low: "need a low-shedding or hypoallergenic breed", moderate: "tolerate some shedding", any: "don't mind shedding" }[v] || v),
    options: [
      { label: "I need a low-shedding or hypoallergenic breed", value: "low" },
      { label: "Some shedding is okay", value: "moderate" },
      { label: "Shedding doesn't bother me", value: "any" },
    ],
  },
];

const QUESTION_IDS = questions.map((q) => q.id);

interface ScoreResult {
  score: number;
  matchedOn: { questionId: string; reason: string }[];
}

function scoreBreed(breed: Breed, answers: Record<string, string>): ScoreResult {
  let score = 0;
  const matched: { questionId: string; reason: string }[] = [];

  if (answers.living === "apartment" && breed.apartmentSuitable) {
    score += 3;
    matched.push({ questionId: "living", reason: "thrives in apartments" });
  }
  if (answers.living === "apartment" && !breed.apartmentSuitable) score -= 3;
  if (answers.living === "rural") score += 1;

  const energyMap: Record<string, string[]> = {
    low: ["Low"],
    moderate: ["Low", "Moderate"],
    high: ["Moderate", "High"],
    "very-high": ["High", "Very High"],
  };
  if (answers.activity && energyMap[answers.activity]?.includes(breed.energyLevel)) {
    score += 3;
    matched.push({ questionId: "activity", reason: `has a ${breed.energyLevel.toLowerCase()} energy level` });
  }

  if (answers.size && answers.size !== "any" && breed.sizeCategory === answers.size) {
    score += 3;
    matched.push({ questionId: "size", reason: `is a ${breed.sizeCategory.toLowerCase()} breed` });
  }

  if (answers.kids === "young" && breed.goodWithKids >= 4) {
    score += 3;
    matched.push({ questionId: "kids", reason: "is excellent with young children" });
  }
  if (answers.kids === "young" && breed.goodWithKids <= 2) score -= 3;
  if (answers.kids === "older" && breed.goodWithKids >= 3) {
    score += 2;
    matched.push({ questionId: "kids", reason: "does well with older children" });
  }

  if (answers.experience === "beginner" && breed.trainability === "Easy") {
    score += 3;
    matched.push({ questionId: "experience", reason: "is easy to train for first-time owners" });
  }
  if (answers.experience === "beginner" && breed.trainability === "Independent") score -= 3;
  if (answers.experience === "advanced") score += 1;

  if (answers.grooming === "low" && ["Low", "Moderate"].includes(breed.sheddingLevel)) {
    score += 1;
    matched.push({ questionId: "grooming", reason: "needs minimal grooming" });
  }

  if (answers.shedding === "low" && breed.hypoallergenic) {
    score += 3;
    matched.push({ questionId: "shedding", reason: "is hypoallergenic" });
  }
  if (answers.shedding === "low" && ["High", "Very High"].includes(breed.sheddingLevel)) score -= 3;

  return { score, matchedOn: matched };
}

function answersToQuery(answers: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const id of QUESTION_IDS) {
    if (answers[id]) params.set(id, answers[id]);
  }
  return params.toString();
}

function queryToAnswers(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const id of QUESTION_IDS) {
    const v = params.get(id);
    if (v) {
      const valid = questions.find((q) => q.id === id)?.options.some((o) => o.value === v);
      if (valid) out[id] = v;
    }
  }
  return out;
}

function buildExplanation(
  matched: { questionId: string; reason: string }[],
  answers: Record<string, string>,
  breedName: string,
): string {
  if (matched.length === 0) {
    return `${breedName} is a balanced match across the rest of your answers, even though no single answer was a perfect fit.`;
  }
  const userParts: string[] = [];
  const seenQuestions = new Set<string>();
  for (const m of matched) {
    if (seenQuestions.has(m.questionId)) continue;
    seenQuestions.add(m.questionId);
    const q = questions.find((x) => x.id === m.questionId);
    if (q && answers[m.questionId]) {
      userParts.push(q.shortLabel(answers[m.questionId]));
    }
  }
  const userClause =
    userParts.length === 0
      ? "Based on your answers"
      : userParts.length === 1
      ? `You said you ${userParts[0]}`
      : `You said you ${userParts.slice(0, -1).join(", ")} and ${userParts[userParts.length - 1]}`;
  const breedParts = matched.slice(0, 3).map((m) => m.reason);
  const breedClause =
    breedParts.length === 1
      ? breedParts[0]
      : breedParts.slice(0, -1).join(", ") + " and " + breedParts[breedParts.length - 1];
  return `${userClause} — the ${breedName} ${breedClause}.`;
}

function QuizMode({
  initialAnswers,
  onComplete,
}: {
  initialAnswers: Record<string, string>;
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [currentQ, setCurrentQ] = useState(() => {
    const firstUnanswered = questions.findIndex((q) => !initialAnswers[q.id]);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });

  const handleAnswer = (questionId: string, value: string) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(next);
    }
  };

  const question = questions[currentQ];
  const isRefining = Object.keys(initialAnswers).length === questions.length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Dog className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-3xl font-bold mb-2" data-testid="text-quiz-title">
            Dog Breed Selector Quiz
          </h1>
          <p className="text-muted-foreground">
            {isRefining
              ? "Refine your answers — your previous picks are pre-filled."
              : `Answer ${questions.length} quick questions to find your ideal match`}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl" data-testid="text-quiz-question">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option) => (
              <Button
                key={option.value}
                variant={answers[question.id] === option.value ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                onClick={() => handleAnswer(question.id, option.value)}
                data-testid={`button-quiz-option-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          {currentQ > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setCurrentQ(currentQ - 1)}
              data-testid="button-quiz-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Question
            </Button>
          ) : (
            <span />
          )}
          {isRefining && Object.keys(answers).length === questions.length && (
            <Button onClick={() => onComplete(answers)} data-testid="button-quiz-see-results">
              See My Results <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmailCaptureCard({
  topMatches,
  answers,
}: {
  topMatches: Breed[];
  answers: Record<string, string>;
}) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { email: string; matchedBreeds: string[]; answers: Record<string, string> }) => {
      return apiRequest("POST", "/api/quiz-results", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Saved", description: "We'll send tips for your top match shortly." });
    },
    onError: () => {
      toast({ title: "Couldn't save", description: "Please check your email and try again.", variant: "destructive" });
    },
  });

  if (submitted) {
    return (
      <Card className="bg-emerald-500/5 border-emerald-500/30" data-testid="card-email-thanks">
        <CardContent className="p-6 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Thanks — you're on the list.</p>
            <p className="text-sm text-muted-foreground">
              We'll send breed-specific tips for the {topMatches[0]?.name} to {email}. No spam, unsubscribe anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30" data-testid="card-email-capture">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Want tips for your top match?</h3>
            <p className="text-sm text-muted-foreground">
              Optional — we'll email a few breed-specific tips for the {topMatches[0]?.name}. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            mutation.mutate({
              email: email.trim(),
              matchedBreeds: topMatches.map((b) => b.slug),
              answers,
            });
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending}
            data-testid="input-quiz-email"
          />
          <Button
            type="submit"
            disabled={mutation.isPending || !email.trim()}
            data-testid="button-quiz-email-submit"
          >
            {mutation.isPending ? "Saving…" : "Send My Tips"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ResultsMode({
  answers,
  breeds,
  isLoading,
}: {
  answers: Record<string, string>;
  breeds: Breed[] | undefined;
  isLoading: boolean;
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const results = useMemo(() => {
    if (!breeds) return [];
    return breeds
      .map((b) => ({ breed: b, ...scoreBreed(b, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [breeds, answers]);

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const queryString = answersToQuery(answers);
  const topThreeSlugs = results.slice(0, 3).map((r) => r.breed.slug).join(",");

  const handleShare = async () => {
    const url = `${window.location.origin}/dog-breed-selector/results?${queryString}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share your results anywhere." });
    } catch {
      toast({ title: "Couldn't copy", description: url, variant: "destructive" });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
          <h1 className="text-3xl font-bold mb-2" data-testid="text-quiz-results-title">
            Your Top {results.length} Breed Matches
          </h1>
          <p className="text-muted-foreground">
            Based on your lifestyle answers, here are the breeds we recommend exploring first.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Button onClick={handleShare} variant="outline" size="sm" data-testid="button-share-results">
            <Share2 className="mr-2 h-4 w-4" /> Share My Results
          </Button>
          <Button
            onClick={() => setLocation(`/dog-breed-selector?${queryString}`)}
            variant="outline"
            size="sm"
            data-testid="button-refine-answers"
          >
            <Pencil className="mr-2 h-4 w-4" /> Refine My Answers
          </Button>
          {topThreeSlugs && (
            <Link href={`/compare?breeds=${topThreeSlugs}`}>
              <Button variant="outline" size="sm" data-testid="button-compare-top-matches">
                <Scale className="mr-2 h-4 w-4" /> Compare My Top Matches
              </Button>
            </Link>
          )}
          <Button
            onClick={() => setLocation("/dog-breed-selector")}
            variant="ghost"
            size="sm"
            data-testid="button-start-over"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Start Over
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {results.map(({ breed, matchedOn }, index) => (
            <Card key={breed.id} className="overflow-hidden" data-testid={`card-quiz-result-${index}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-primary w-10 text-center shrink-0 pt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Link href={`/breeds/${breed.slug}`}>
                        <h3
                          className="font-semibold text-lg hover:text-primary cursor-pointer"
                          data-testid={`text-result-name-${index}`}
                        >
                          {breed.name}
                        </h3>
                      </Link>
                      <Link href={`/breeds/${breed.slug}`}>
                        <ArrowRight className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer shrink-0" />
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                      <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
                      <Badge variant="outline" className="text-xs">{breed.energyLevel} Energy</Badge>
                      {breed.hypoallergenic && <Badge variant="secondary" className="text-xs">Hypoallergenic</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {breed.temperamentSummary}
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3" data-testid={`text-result-explanation-${index}`}>
                      <p className="text-sm">
                        <span className="font-semibold text-primary">Why this match:</span>{" "}
                        {buildExplanation(matchedOn, answers, breed.name)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length > 0 && <EmailCaptureCard topMatches={results.map((r) => r.breed)} answers={answers} />}
      </div>
    </div>
  );
}

export default function Quiz() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const isResultsRoute = location === "/dog-breed-selector/results";
  useCanonical(isResultsRoute ? "/dog-breed-selector/results" : "/dog-breed-selector");

  const { data: breeds, isLoading } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  const urlAnswers = useMemo(() => queryToAnswers(search), [search]);
  const isComplete = QUESTION_IDS.every((id) => urlAnswers[id]);

  const topNamesForMeta = useMemo(() => {
    if (!isResultsRoute || !isComplete || !breeds) return [];
    return breeds
      .map((b) => ({ breed: b, ...scoreBreed(b, urlAnswers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => r.breed.name);
  }, [isResultsRoute, isComplete, breeds, urlAnswers]);

  usePageMeta(
    isResultsRoute && topNamesForMeta.length > 0
      ? `Your Quiz Results: ${topNamesForMeta.slice(0, 3).join(", ")} & More | Dog Breeds & Needs`
      : isResultsRoute
      ? "Your Dog Breed Quiz Results: Top 5 Personalized Matches | Dog Breeds & Needs"
      : "Dog Breed Selector Quiz: Find Your Perfect Breed | Dog Breeds & Needs",
    isResultsRoute
      ? "See your top 5 personalized dog breed matches based on lifestyle, living situation, and preferences. Refine your answers, share results, or compare your matches."
      : "Not sure which dog breed is right for you? Take our free 7-question breed selector quiz and get personalized matches based on your lifestyle. Start now!",
  );

  useEffect(() => {
    if (location === "/dog-breed-selector/results" && !isComplete) {
      const qs = answersToQuery(urlAnswers);
      setLocation(qs ? `/dog-breed-selector?${qs}` : "/dog-breed-selector", { replace: true });
    }
  }, [location, isComplete, urlAnswers]);

  if (isResultsRoute && !isComplete) {
    return (
      <div className="py-12 text-center text-muted-foreground" data-testid="text-results-redirecting">
        Redirecting to the quiz to finish your answers…
      </div>
    );
  }
  if (isResultsRoute) {
    return <ResultsMode answers={urlAnswers} breeds={breeds} isLoading={isLoading} />;
  }

  return (
    <QuizMode
      initialAnswers={urlAnswers}
      onComplete={(finalAnswers) => {
        setLocation(`/dog-breed-selector/results?${answersToQuery(finalAnswers)}`);
      }}
    />
  );
}
